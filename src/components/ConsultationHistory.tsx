import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO } from 'date-fns';
import { Phone, Video, MessageCircle, User, Calendar, Clock, ArrowUp, X, AlertTriangle } from 'lucide-react';
import { useConsultation } from '@/context/ConsultationContext';
import { hasAnonymousToken } from '@/utils/localStorage';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const ConsultationHistory: React.FC = () => {
  const navigate = useNavigate();
  const { pastConsultations, selectedDate, selectedTime, selectedMode, selectedDoctor, 
    addConsultation, setSelectedDate, setSelectedTime, setSelectedMode, setSelectedDoctor } = useConsultation();
  
  // States for UI elements
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [confirmBackDialogOpen, setConfirmBackDialogOpen] = useState(false);
  
  // Check for anonymous token
  const hasToken = hasAnonymousToken();
  
  // Handle scroll events for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Map of consultation mode to icon
  const modeIconMap: Record<string, React.ReactNode> = {
    'audio': <Phone className="h-4 w-4" />,
    'video': <Video className="h-4 w-4" />,
    'whatsapp': <MessageCircle className="h-4 w-4" />,
    'in-person': <User className="h-4 w-4" />
  };
  
  // Format date function that properly handles date strings
  const formatDate = (dateString: string, formatString: string): string => {
    try {
      // Try to parse the date string
      const date = parseISO(dateString);
      // Format the date
      return format(date, formatString);
    } catch (error) {
      console.error(`Error formatting date: ${dateString}`, error);
      return 'Invalid Date';
    }
  };

  // Handle back to top button click
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Handle reschedule button click
  const handleReschedule = (consultationId: string) => {
    setSelectedConsultation(consultationId);
    setRescheduleDialogOpen(true);
    
    // Find the consultation to be rescheduled
    const consultation = pastConsultations.find(c => c.id === consultationId);
    if (consultation) {
      // Set the existing details in the context for the booking flow
      setSelectedDoctor(consultation.doctorId); 
      setSelectedMode(consultation.mode);
    }
  };
  
  // Handle confirming reschedule
  const confirmReschedule = () => {
    navigate('/booking');
  };
  
  // Handle back button on reschedule
  const handleRescheduleBack = () => {
    setConfirmBackDialogOpen(true);
  };
  
  // Handle cancel button click
  const handleCancelClick = (consultationId: string) => {
    setSelectedConsultation(consultationId);
    setCancelDialogOpen(true);
  };
  
  // Handle confirm cancel
  const confirmCancel = () => {
    if (!selectedConsultation || !cancelReason.trim()) return;
    
    // Find the consultation to be updated
    const consultationToCancel = pastConsultations.find(c => c.id === selectedConsultation);
    
    if (consultationToCancel) {
      // Create a new consultation with status changed to cancelled
      const updatedConsultation = {
        ...consultationToCancel,
        status: 'cancelled' as 'scheduled' | 'completed' | 'cancelled',
        notes: `Cancelled: ${cancelReason}`
      };
      
      // Add the updated consultation (this will replace the old one)
      addConsultation(updatedConsultation);
      
      // Close dialog and reset state
      setCancelDialogOpen(false);
      setCancelReason('');
      setSelectedConsultation(null);
    }
  };
  
  // If no anonymous token, show token missing message
  if (!hasToken) {
    return (
      <div className="container px-4 py-10 mx-auto max-w-3xl">
        <Card className="mx-auto text-center">
          <CardHeader>
            <CardTitle>No History Found</CardTitle>
            <CardDescription>We couldn't find your consultation history.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Your device doesn't have an anonymous identifier. History is stored locally 
              and linked to your device's anonymous ID.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // If no consultations, show empty state
  if (pastConsultations.length === 0) {
    return (
      <div className="container px-4 py-10 mx-auto max-w-3xl">
        <Card className="mx-auto text-center">
          <CardHeader>
            <CardTitle>No Consultations Yet</CardTitle>
            <CardDescription>You haven't booked any consultations yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Book your first consultation to get started. Your history will appear here.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={() => navigate('/')}>
              Book A Consultation
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6">Your Consultation History</h2>
      
      <Tabs defaultValue="scheduled">
        <TabsList className="mb-6">
          <TabsTrigger value="scheduled">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scheduled">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {pastConsultations
                .filter(c => c.status === 'scheduled')
                .map((consultation) => (
                  <Card key={consultation.id} className="overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/40">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-base">
                            {formatDate(consultation.date, 'MMMM d, yyyy')}
                          </CardTitle>
                          <CardDescription>
                            {formatDate(consultation.date, 'h:mm a')}
                          </CardDescription>
                        </div>
                        <Badge>Upcoming</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Doctor</span>
                        <span>{consultation.doctorId}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Mode</span>
                        <div className="flex items-center">
                          {modeIconMap[consultation.mode]}
                          <span className="ml-1">
                            {consultation.mode.charAt(0).toUpperCase() + consultation.mode.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <span className="font-medium block mb-1">Symptoms</span>
                        <div className="flex flex-wrap gap-1">
                          {consultation.symptoms.map((symptom, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Join Consultation
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 flex items-center justify-center gap-1"
                        onClick={() => handleReschedule(consultation.id)}
                      >
                        <Calendar className="h-4 w-4" />
                        Reschedule
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 flex items-center justify-center gap-1 text-destructive hover:bg-destructive/10"
                        onClick={() => handleCancelClick(consultation.id)}
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              
              {pastConsultations.filter(c => c.status === 'scheduled').length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No upcoming consultations.</p>
                  <Button onClick={() => navigate('/')} className="mt-4">
                    Book A Consultation
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="completed">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {pastConsultations
                .filter(c => c.status === 'completed')
                .map((consultation) => (
                  <Card key={consultation.id} className="overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/40">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-base">
                            {formatDate(consultation.date, 'MMMM d, yyyy')}
                          </CardTitle>
                          <CardDescription>
                            {formatDate(consultation.date, 'h:mm a')}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Doctor</span>
                        <span>{consultation.doctorId}</span>
                      </div>
                      
                      {consultation.prescription && (
                        <div className="mb-4">
                          <span className="font-medium block mb-1">Prescription</span>
                          <p className="text-sm p-2 bg-muted rounded">
                            {consultation.prescription}
                          </p>
                        </div>
                      )}
                      
                      {consultation.notes && (
                        <div className="mb-2">
                          <span className="font-medium block mb-1">Notes</span>
                          <p className="text-sm">{consultation.notes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t pt-3">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              
              {pastConsultations.filter(c => c.status === 'completed').length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No past consultations.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="cancelled">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {pastConsultations
                .filter(c => c.status === 'cancelled')
                .map((consultation) => (
                  <Card key={consultation.id} className="overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/40">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-base">
                            {formatDate(consultation.date, 'MMMM d, yyyy')}
                          </CardTitle>
                          <CardDescription>
                            {formatDate(consultation.date, 'h:mm a')}
                          </CardDescription>
                        </div>
                        <Badge variant="destructive">Cancelled</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Doctor</span>
                        <span>{consultation.doctorId}</span>
                      </div>
                      
                      {consultation.notes && (
                        <div className="mb-2">
                          <span className="font-medium block mb-1">Reason</span>
                          <p className="text-sm text-destructive">{consultation.notes.replace('Cancelled: ', '')}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t pt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center justify-center gap-1"
                        onClick={() => handleReschedule(consultation.id)}
                      >
                        <Calendar className="h-4 w-4" />
                        Reschedule
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              
              {pastConsultations.filter(c => c.status === 'cancelled').length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No cancelled consultations.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          className="fixed bottom-6 right-6 h-10 w-10 rounded-full shadow-lg flex items-center justify-center bg-health-primary hover:bg-health-dark"
          onClick={handleBackToTop}
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      {/* Cancel Consultation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Cancel Consultation
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this consultation.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            placeholder="Reason for cancellation"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="min-h-[100px]"
            maxLength={200}
          />
          <p className="text-right text-xs text-muted-foreground">
            {cancelReason.length}/200 characters
          </p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Back
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmCancel}
              disabled={!cancelReason.trim()}
            >
              Cancel Consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Consultation Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-health-primary" />
              Reschedule Consultation
            </DialogTitle>
            <DialogDescription>
              Would you like to reschedule this consultation? You'll be redirected to the booking page.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleRescheduleBack}>
              Back
            </Button>
            <Button 
              variant="default" 
              className="bg-health-primary hover:bg-health-dark"
              onClick={confirmReschedule}
            >
              Continue to Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Back Dialog */}
      <AlertDialog open={confirmBackDialogOpen} onOpenChange={setConfirmBackDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Rescheduling?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you don't want to reschedule this consultation?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmBackDialogOpen(false)}>
              No, Continue Rescheduling
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setConfirmBackDialogOpen(false);
              setRescheduleDialogOpen(false);
            }}>
              Yes, Cancel Rescheduling
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Your consultation history is stored anonymously on this device only.
        </p>
      </div>
    </div>
  );
};

export default ConsultationHistory;
