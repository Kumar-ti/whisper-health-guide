
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useConsultation } from '@/context/ConsultationContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { matchSymptomsToSpecialties, SPECIALTIES_LIST } from '@/utils/symptomMatching';

const DoctorRecommendation: React.FC = () => {
  const navigate = useNavigate();
  const { currentSymptoms, recommendedDoctors, setSelectedDoctor } = useConsultation();
  const [activeSpecialty, setActiveSpecialty] = useState<string>('all');
  
  // Match symptoms to specialties
  const matchedSpecialties = matchSymptomsToSpecialties(currentSymptoms);
  
  // Filter doctors by active specialty
  const filteredDoctors = activeSpecialty === 'all' 
    ? recommendedDoctors 
    : recommendedDoctors.filter(doctor => doctor.specialty === activeSpecialty);
  
  // Handle selecting a doctor
  const handleSelectDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    navigate('/booking');
  };
  
  // If no symptoms have been entered, redirect to symptom checker
  if (currentSymptoms.length === 0) {
    navigate('/');
    return null;
  }
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-5xl">
      {/* Summary of symptoms */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-health-dark mb-2">Based on your symptoms</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {currentSymptoms.map((symptom, index) => (
            <Badge key={index} variant="outline" className="bg-health-light border-health-primary text-health-primary">
              {symptom}
            </Badge>
          ))}
        </div>
        <p className="text-muted-foreground">
          We've identified potential matches with specialists in: {' '}
          <span className="font-medium text-foreground">{matchedSpecialties.join(', ')}</span>
        </p>
      </div>
      
      {/* Specialty filter tabs */}
      <Tabs defaultValue="all" value={activeSpecialty} onValueChange={setActiveSpecialty} className="mb-6">
        <TabsList className="mb-4 overflow-x-auto flex-nowrap">
          <TabsTrigger value="all">All Specialists</TabsTrigger>
          {matchedSpecialties.map((specialty, index) => (
            <TabsTrigger key={index} value={specialty}>
              {specialty}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeSpecialty} className="mt-0">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">No doctors found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any doctors matching these criteria.
              </p>
              <Button onClick={() => setActiveSpecialty('all')}>
                View all doctors
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{doctor.name}</CardTitle>
                        <CardDescription>{doctor.specialty}</CardDescription>
                      </div>
                      <div className="flex items-center bg-health-light rounded-md px-2 py-1">
                        <span className="text-health-primary font-semibold text-sm">
                          {doctor.rating}★
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center mb-2 gap-4">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="text-sm">
                        <p className="mb-1">{doctor.bio}</p>
                        <p className="text-muted-foreground">{doctor.experience} years experience</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleSelectDoctor(doctor)}
                      className="w-full bg-health-primary hover:bg-health-dark"
                    >
                      Book Consultation
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="text-center mt-6">
        <Button variant="outline" onClick={() => navigate('/')}>
          Update Symptoms
        </Button>
      </div>
    </div>
  );
};

export default DoctorRecommendation;
