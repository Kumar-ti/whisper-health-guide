
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, isValid } from 'date-fns';
import { Phone, Video, MessageCircle, User } from 'lucide-react';
import { useConsultation } from '@/context/ConsultationContext';
import { hasAnonymousToken } from '@/utils/localStorage';

const ConsultationHistory: React.FC = () => {
  const navigate = useNavigate();
  const { pastConsultations } = useConsultation();
  
  // Check for anonymous token
  const hasToken = hasAnonymousToken();
  
  // Map of consultation mode to icon
  const modeIconMap: Record<string, React.ReactNode> = {
    'audio': <Phone className="h-4 w-4" />,
    'video': <Video className="h-4 w-4" />,
    'whatsapp': <MessageCircle className="h-4 w-4" />,
    'in-person': <User className="h-4 w-4" />
  };
  
  // Safe format function to handle potentially invalid dates
  const safeFormat = (dateString: string, formatString: string): string => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, formatString) : 'Invalid Date';
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
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
        </TabsList>
        
        <TabsContent value="scheduled">
          <div className="space-y-4">
            {pastConsultations
              .filter(c => c.status === 'scheduled')
              .map((consultation) => (
                <Card key={consultation.id} className="overflow-hidden">
                  <CardHeader className="pb-2 bg-muted/40">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-base">
                          {safeFormat(consultation.date, 'MMMM d, yyyy')}
                        </CardTitle>
                        <CardDescription>
                          {safeFormat(consultation.date, 'h:mm a')}
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
                  <CardFooter className="border-t pt-3">
                    <Button variant="outline" size="sm" className="w-full">
                      Join Consultation
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
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="space-y-4">
            {pastConsultations
              .filter(c => c.status === 'completed')
              .map((consultation) => (
                <Card key={consultation.id} className="overflow-hidden">
                  <CardHeader className="pb-2 bg-muted/40">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-base">
                          {safeFormat(consultation.date, 'MMMM d, yyyy')}
                        </CardTitle>
                        <CardDescription>
                          {safeFormat(consultation.date, 'h:mm a')}
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
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Your consultation history is stored anonymously on this device only.
        </p>
      </div>
    </div>
  );
};

export default ConsultationHistory;
