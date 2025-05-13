import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Clock, Calendar as CalendarIcon, User, LogOut, CheckCircle, XCircle, ClipboardList, X } from 'lucide-react';
import { useDoctor } from '@/context/DoctorContext';
import { format } from 'date-fns';

type TabType = 'appointments' | 'availability' | 'history';

const DoctorDashboard: React.FC = () => {
  const { currentDoctor, pendingAppointments, acceptedAppointments, acceptAppointment, declineAppointment, updateAvailability, getPossibleDiseases, logout, getPatientHistory } = useDoctor();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('appointments');
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [appointmentAction, setAppointmentAction] = useState<'accept' | 'decline' | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientHistoryOpen, setPatientHistoryOpen] = useState<boolean>(false);
  const [patientHistory, setPatientHistory] = useState<any[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentDoctor) {
      navigate('/doctor-login');
    }
  }, [currentDoctor, navigate]);

  // Fetch patient history when a patient is selected
  useEffect(() => {
    if (selectedPatientId) {
      const history = getPatientHistory(selectedPatientId);
      setPatientHistory(history);
      setPatientHistoryOpen(true);
    } else {
      setPatientHistoryOpen(false);
    }
  }, [selectedPatientId, getPatientHistory]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get time slots for the selected date
  const getAvailableTimeSlots = () => {
    if (!currentDoctor || !selectedDate) return [];
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dateAvailability = currentDoctor.availability.find(a => a.date === dateStr);
    return dateAvailability?.timeSlots || [];
  };

  // Toggle time slot availability
  const toggleTimeSlot = (time: string) => {
    if (!currentDoctor || !selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const currentAvailability = [...currentDoctor.availability];
    const dateIndex = currentAvailability.findIndex(a => a.date === dateStr);
    
    if (dateIndex >= 0) {
      const currentTimeSlots = currentAvailability[dateIndex].timeSlots;
      if (currentTimeSlots.includes(time)) {
        // Remove time slot
        currentAvailability[dateIndex] = {
          ...currentAvailability[dateIndex],
          timeSlots: currentTimeSlots.filter(t => t !== time)
        };
      } else {
        // Add time slot
        currentAvailability[dateIndex] = {
          ...currentAvailability[dateIndex],
          timeSlots: [...currentTimeSlots, time].sort()
        };
      }
    } else {
      // Create new date entry
      currentAvailability.push({
        date: dateStr,
        timeSlots: [time]
      });
    }
    
    updateAvailability(currentAvailability);
  };

  // Generate time slots for UI
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  // Handle appointment action confirmation
  const handleAppointmentAction = () => {
    if (!selectedAppointment || !appointmentAction) return;
    
    if (appointmentAction === 'accept') {
      acceptAppointment(selectedAppointment);
    } else {
      declineAppointment(selectedAppointment);
    }
    
    setSelectedAppointment(null);
    setAppointmentAction(null);
  };

  // Get disease predictions based on symptoms
  const getDiseaseAnalysis = (symptoms: string[]) => {
    return getPossibleDiseases(symptoms);
  };

  // Close patient history dialog
  const closePatientHistory = () => {
    setSelectedPatientId(null);
    setPatientHistory([]);
    setPatientHistoryOpen(false);
  };

  if (!currentDoctor) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-health-primary">{currentDoctor.name}</h1>
          <p className="text-muted-foreground">{currentDoctor.specialty}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments" className="relative">
            Appointments
            {pendingAppointments.length > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                {pendingAppointments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="history">Patient History</TabsTrigger>
        </TabsList>
        
        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Patient Appointments</CardTitle>
              <CardDescription>
                Manage your upcoming appointments and requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pendingAppointments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Pending Requests</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Symptoms</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingAppointments.map((appointment) => (
                          <TableRow key={appointment.consultationId}>
                            <TableCell>{appointment.id}</TableCell>
                            <TableCell>{appointment.date}</TableCell>
                            <TableCell>{appointment.time}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {appointment.mode}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {appointment.symptoms.map((symptom, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointment(appointment.consultationId);
                                    setAppointmentAction('accept');
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointment(appointment.consultationId);
                                    setAppointmentAction('decline');
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {acceptedAppointments.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Accepted Appointments</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Symptoms</TableHead>
                          <TableHead>Possible Conditions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {acceptedAppointments.map((appointment) => {
                          const diseases = getDiseaseAnalysis(appointment.symptoms);
                          return (
                            <TableRow key={appointment.consultationId}>
                              <TableCell>{appointment.id}</TableCell>
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell>{appointment.time}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {appointment.mode}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {appointment.symptoms.map((symptom, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {symptom}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  {diseases.map((disease, i) => (
                                    <div key={i} className="text-xs">
                                      <span className="font-medium">{disease.name}</span>
                                      <span className="ml-1 text-muted-foreground">
                                        ({Math.round(disease.probability * 100)}%)
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  pendingAppointments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No appointments scheduled at the moment.
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Availability Tab */}
        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Manage Availability</CardTitle>
              <CardDescription>
                Set your available time slots for patient appointments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Time Slots for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      const isAvailable = getAvailableTimeSlots().includes(time);
                      return (
                        <Button
                          key={time}
                          variant={isAvailable ? "default" : "outline"}
                          className={`${isAvailable ? "bg-health-primary" : ""}`}
                          onClick={() => toggleTimeSlot(time)}
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Click on a time slot to toggle its availability. Highlighted slots are available for booking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Patient History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Patient History</CardTitle>
              <CardDescription>
                View consultation history for patients you've treated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {acceptedAppointments.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Symptoms</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {acceptedAppointments.map((appointment) => (
                        <TableRow key={appointment.consultationId}>
                          <TableCell>{appointment.id}</TableCell>
                          <TableCell>{appointment.date}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {appointment.symptoms.map((symptom, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedPatientId(appointment.id)}
                            >
                              <User className="h-4 w-4 mr-1" />
                              View History
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No patient history available.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Accept/Decline Appointment Confirmation Dialog */}
      <AlertDialog 
        open={!!selectedAppointment && !!appointmentAction} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAppointment(null);
            setAppointmentAction(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {appointmentAction === 'accept' ? 'Accept Appointment' : 'Decline Appointment'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {appointmentAction === 'accept' 
                ? 'Are you sure you want to accept this appointment? The patient will be notified of your decision.'
                : 'Are you sure you want to decline this appointment? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAppointmentAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Patient History Dialog */}
      <Dialog open={patientHistoryOpen} onOpenChange={(open) => !open && closePatientHistory()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-health-primary" />
                Patient History - ID: {selectedPatientId}
              </span>
              <Button variant="ghost" size="icon" onClick={closePatientHistory} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Complete medical history and previous consultations
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-6">
            {/* Patient Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-health-primary">Patient Summary</h3>
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Consultations</p>
                    <p className="text-lg">{patientHistory.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
                    <p className="text-lg">{patientHistory.length > 0 ? patientHistory[0].date : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Prescriptions Section */}
            {patientHistory.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-health-primary flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-health-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
                  </svg>
                  Previous Prescriptions History
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-health-light hover:bg-health-light/90">
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Symptoms</TableHead>
                        <TableHead className="font-semibold">Diagnosis</TableHead>
                        <TableHead className="font-semibold">Prescribing Doctor</TableHead>
                        <TableHead className="font-semibold w-1/3">Prescription</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientHistory.map((record, index) => {
                        const diseases = getDiseaseAnalysis(record.symptoms);
                        const primaryDiagnosis = diseases.length > 0 ? diseases[0].name : 'No diagnosis';
                        
                        return (
                          <TableRow key={record.consultationId || index}>
                            <TableCell className="whitespace-nowrap">
                              <div className="font-medium">{record.date}</div>
                              <div className="text-xs text-muted-foreground">{record.time}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {record.symptoms.map((symptom: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{primaryDiagnosis}</Badge>
                            </TableCell>
                            <TableCell>
                              {record.prescribingDoctor ? (
                                <div className="text-sm">
                                  <div className="font-medium">{record.prescribingDoctor.name}</div>
                                  <div className="text-xs text-muted-foreground">{record.prescribingDoctor.specialty}</div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">Unknown</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="bg-health-light/50 p-2 rounded text-sm border-l-2 border-health-primary">
                                {record.prescription || "No prescription issued."}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Consultation History */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-health-primary">Detailed Consultation History</h3>
              {patientHistory.length > 0 ? (
                <div className="space-y-4">
                  {patientHistory.map((record, index) => (
                    <Card key={record.consultationId || index} className="overflow-hidden">
                      <CardHeader className="bg-health-light py-3 px-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{record.date} - {record.time}</p>
                            <Badge variant="outline" className="capitalize mt-1">
                              {record.mode}
                            </Badge>
                          </div>
                          <Badge variant="secondary">
                            Consultation #{patientHistory.length - index}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Symptoms</h4>
                            <div className="flex flex-wrap gap-1">
                              {record.symptoms.map((symptom: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Diagnosis</h4>
                            <div className="space-y-1">
                              {getDiseaseAnalysis(record.symptoms).map((disease, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <span className="font-medium">{disease.name}</span>
                                  <Badge variant={i === 0 ? "default" : "outline"} className="ml-auto">
                                    {Math.round(disease.probability * 100)}%
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          {record.prescribingDoctor && (
                            <>
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                  </svg>
                                  Prescribing Doctor
                                </h4>
                                <div className="flex items-center bg-health-light/30 p-2 rounded">
                                  <div className="h-8 w-8 rounded-full bg-health-primary text-white flex items-center justify-center mr-2">
                                    {record.prescribingDoctor.name.split(' ').map(part => part[0]).join('')}
                                  </div>
                                  <div>
                                    <div className="font-medium">{record.prescribingDoctor.name}</div>
                                    <div className="text-xs text-muted-foreground">{record.prescribingDoctor.specialty}</div>
                                  </div>
                                </div>
                              </div>
                              <Separator />
                            </>
                          )}
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2Z" />
                                <path d="M8 11h8" />
                                <path d="M8 8h8" />
                                <path d="M8 14h4" />
                              </svg>
                              Prescription
                            </h4>
                            <div className="bg-health-light/50 p-3 rounded-md border-l-2 border-health-primary">
                              <p className="font-medium text-sm">{record.prescription || "No prescription issued."}</p>
                            </div>
                          </div>
                          
                          {record.notes && (
                            <>
                              <Separator />
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Doctor's Notes</h4>
                                <p className="text-sm">{record.notes}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No previous consultations found.
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={closePatientHistory}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard; 