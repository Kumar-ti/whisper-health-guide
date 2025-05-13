import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Phone, Video, MessageCircle, User } from 'lucide-react';
import { useConsultation } from '@/context/ConsultationContext';

// Consultation mode options
const CONSULTATION_MODES = [
  { 
    id: 'audio', 
    name: 'Audio Call', 
    icon: <Phone className="h-5 w-5" />,
    description: 'Talk to your doctor over the phone'
  },
  { 
    id: 'video', 
    name: 'Video Call', 
    icon: <Video className="h-5 w-5" />,
    description: 'Face-to-face consultation via video'
  },
  { 
    id: 'whatsapp', 
    name: 'WhatsApp', 
    icon: <MessageCircle className="h-5 w-5" />,
    description: 'Chat with your doctor on WhatsApp'
  },
  { 
    id: 'in-person', 
    name: 'In-Person', 
    icon: <User className="h-5 w-5" />,
    description: 'Visit the doctor at their office'
  }
];

const BookingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    selectedDoctor, 
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    selectedMode, setSelectedMode,
    currentSymptoms,
    addConsultation,
    reschedulingConsultationId
  } = useConsultation();
  
  const [activeStep, setActiveStep] = useState('date'); // 'date', 'time', 'mode'
  const [date, setDate] = useState<Date | undefined>(selectedDate ? new Date(selectedDate) : undefined);
  
  // Redirect if no doctor is selected
  if (!selectedDoctor) {
    navigate('/doctors');
    return null;
  }
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setSelectedDate(format(date, 'yyyy-MM-dd'));
      setActiveStep('time');
    } else {
      setSelectedDate(null);
    }
  };
  
  // Handle time slot selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setActiveStep('mode');
  };
  
  // Handle consultation mode selection
  const handleModeSelect = (mode: any) => {
    setSelectedMode(mode);
  };
  
  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime || !selectedMode) {
      toast({
        title: "Incomplete booking",
        description: "Please select a date, time and consultation mode.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a proper ISO date string by combining date and time
    const bookingDate = new Date(selectedDate);
    const [time, period] = selectedTime.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    
    // Convert to 24-hour format
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    bookingDate.setHours(hour, parseInt(minutes, 10), 0, 0);
    
    // Add or update the consultation
    addConsultation({
      id: reschedulingConsultationId, // This will update the existing consultation if rescheduling
      date: bookingDate.toISOString(),
      doctorId: selectedDoctor.id,
      symptoms: currentSymptoms,
      status: 'scheduled',
      mode: selectedMode
    });
    
    // Show success message
    toast({
      title: reschedulingConsultationId ? "Consultation Rescheduled!" : "Consultation Booked!",
      description: `Your appointment with ${selectedDoctor.name} is confirmed.`,
    });
    
    // Navigate to confirmation page
    navigate('/confirmation');
  };
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-3xl">
      {/* Doctor info */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div>
              <CardTitle>{selectedDoctor.name}</CardTitle>
              <CardDescription>{selectedDoctor.specialty}</CardDescription>
            </div>
            <div className="bg-health-light p-1 px-2 rounded">
              <span className="text-health-primary font-medium">{selectedDoctor.rating}★</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted overflow-hidden">
              <img
                src={selectedDoctor.image}
                alt={selectedDoctor.name}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-sm text-muted-foreground">{selectedDoctor.bio}</p>
          </div>
          {currentSymptoms.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-1">Your symptoms:</p>
              <div className="flex flex-wrap gap-1">
                {currentSymptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Booking steps */}
      <Tabs value={activeStep} onValueChange={setActiveStep} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="date">Date</TabsTrigger>
          <TabsTrigger value="time" disabled={!selectedDate}>Time</TabsTrigger>
          <TabsTrigger value="mode" disabled={!selectedTime}>Mode</TabsTrigger>
        </TabsList>
        
        {/* Date selection */}
        <TabsContent value="date" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Select a date</CardTitle>
              <CardDescription>When would you like to see the doctor?</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                className="p-3 pointer-events-auto mx-auto"
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                disabled={!date}
                onClick={() => setActiveStep('time')}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Time selection */}
        <TabsContent value="time" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Select a time</CardTitle>
              <CardDescription>
                Available slots for {selectedDate && format(new Date(selectedDate), 'MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {selectedDoctor.availability.map((time, index) => (
                  <Button
                    key={index}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={selectedTime === time ? "bg-health-primary" : ""}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveStep('date')}>
                Back
              </Button>
              <Button 
                disabled={!selectedTime}
                onClick={() => setActiveStep('mode')}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Consultation mode selection */}
        <TabsContent value="mode" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Select consultation mode</CardTitle>
              <CardDescription>How would you like to connect with the doctor?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONSULTATION_MODES.map((mode) => (
                  <div
                    key={mode.id}
                    className={`booking-option ${selectedMode === mode.id ? 'selected' : ''}`}
                    onClick={() => handleModeSelect(mode.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${selectedMode === mode.id ? 'bg-health-primary text-white' : 'bg-muted'}`}>
                        {mode.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{mode.name}</h4>
                        <p className="text-sm text-muted-foreground">{mode.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveStep('time')}>
                Back
              </Button>
              <Button 
                disabled={!selectedMode}
                onClick={handleConfirmBooking}
                className="bg-health-primary hover:bg-health-dark"
              >
                Confirm Booking
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Booking summary */}
      {selectedDate && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Doctor:</span>
                <span>{selectedDoctor.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{selectedDate && format(new Date(selectedDate), 'MMMM d, yyyy')}</span>
              </div>
              {selectedTime && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                </>
              )}
              {selectedMode && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mode:</span>
                    <span>{CONSULTATION_MODES.find(m => m.id === selectedMode)?.name}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingFlow;
