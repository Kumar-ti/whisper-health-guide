
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Calendar, Clock, Phone, Video, MessageCircle, User, Home } from 'lucide-react';
import { useConsultation } from '@/context/ConsultationContext';
import { hasAnonymousToken } from '@/utils/localStorage';
import mockDoctors from '@/data/mockDoctors';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDoctor: selectedDoctorId, selectedDate, selectedTime, selectedMode, resetBookingData } = useConsultation();
  
  // Find the selected doctor object using the doctor ID
  const selectedDoctor = mockDoctors.find(doctor => doctor.id === selectedDoctorId);
  
  // Map of consultation mode to icon
  const modeIconMap: Record<string, React.ReactNode> = {
    'audio': <Phone className="h-5 w-5" />,
    'video': <Video className="h-5 w-5" />,
    'whatsapp': <MessageCircle className="h-5 w-5" />,
    'in-person': <User className="h-5 w-5" />
  };
  
  // Map of consultation mode to text
  const modeTextMap: Record<string, string> = {
    'audio': 'Audio Call',
    'video': 'Video Call',
    'whatsapp': 'WhatsApp',
    'in-person': 'In-Person Visit'
  };
  
  // Get consultation details (ensure we have all required data)
  if (!selectedDoctorId || !selectedDoctor || !selectedDate || !selectedTime || !selectedMode) {
    navigate('/');
    return null;
  }
  
  // Handle booking another consultation
  const handleBookAnother = () => {
    resetBookingData();
    navigate('/');
  };
  
  // Handle viewing consultation history
  const handleViewHistory = () => {
    navigate('/history');
  };

  // Handle going home
  const handleGoHome = () => {
    resetBookingData();
    navigate('/');
  };
  
  return (
    <div className="container px-4 py-10 mx-auto max-w-lg">
      <div className="text-center mb-6">
        <div className="h-16 w-16 rounded-full bg-health-primary/10 text-health-primary mx-auto mb-4 flex items-center justify-center">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-health-dark">Consultation Confirmed!</h1>
        <p className="text-muted-foreground mt-1">
          Your appointment has been scheduled successfully.
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-muted mr-3 overflow-hidden">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{selectedDoctor.name}</p>
                <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-muted rounded-lg">
            <Calendar className="h-5 w-5 text-health-primary mr-3" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-muted-foreground">
                {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-muted rounded-lg">
            <Clock className="h-5 w-5 text-health-primary mr-3" />
            <div>
              <p className="text-sm font-medium">Time</p>
              <p className="text-muted-foreground">{selectedTime}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-muted rounded-lg">
            {modeIconMap[selectedMode] && (
              <div className="text-health-primary mr-3">
                {modeIconMap[selectedMode]}
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Consultation Mode</p>
              <p className="text-muted-foreground">{modeTextMap[selectedMode]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-3">
        <Button 
          className="w-full bg-health-primary hover:bg-health-dark"
          onClick={handleBookAnother}
        >
          Book Another Consultation
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleViewHistory}
        >
          View My Consultations
        </Button>

        <Button
          variant="outline"
          className="w-full flex items-center gap-2" 
          onClick={handleGoHome}
        >
          <Home className="h-4 w-4" />
          Go to Home
        </Button>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {hasAnonymousToken() 
            ? "Your consultation is saved anonymously on this device." 
            : "Please keep this page open, as your appointment details aren't saved yet."}
        </p>
      </div>
    </div>
  );
};

export default Confirmation;
