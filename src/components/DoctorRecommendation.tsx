
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useConsultation } from '@/context/ConsultationContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { matchSymptomsToSpecialties, SPECIALTIES_LIST } from '@/utils/symptomMatching';
import { Filter, Star, MapPin, ToggleLeft, ToggleRight } from 'lucide-react';

const DoctorRecommendation: React.FC = () => {
  const navigate = useNavigate();
  const { currentSymptoms, recommendedDoctors, setSelectedDoctor } = useConsultation();
  
  // View mode (recommended vs all)
  const [viewMode, setViewMode] = useState<'recommended' | 'all'>('recommended');
  const [activeSpecialty, setActiveSpecialty] = useState<string>('all');
  
  // Filters state
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [costFilter, setCostFilter] = useState<[number]>([500]); // Default cost filter
  const [ratingFilter, setRatingFilter] = useState<number>(4.0); // Default rating filter
  const [showFilters, setShowFilters] = useState(false);
  
  // Match symptoms to specialties
  const matchedSpecialties = matchSymptomsToSpecialties(currentSymptoms);
  
  // Get top matches (initially show only the top 3 best matching doctors)
  const topMatchedDoctors = recommendedDoctors
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  
  // Apply all filters to doctors
  const getFilteredDoctors = () => {
    // Start with either recommended or all doctors
    const baseList = viewMode === 'recommended' ? topMatchedDoctors : recommendedDoctors;
    
    return baseList
      .filter(doctor => activeSpecialty === 'all' || doctor.specialty === activeSpecialty)
      .filter(doctor => !locationFilter || 
        (doctor.location && doctor.location.toLowerCase().includes(locationFilter.toLowerCase())))
      .filter(doctor => doctor.fee <= costFilter[0])
      .filter(doctor => doctor.rating >= ratingFilter);
  };
  
  const filteredDoctors = getFilteredDoctors();
  
  // If no symptoms have been entered, redirect to symptom checker
  if (currentSymptoms.length === 0) {
    navigate('/');
    return null;
  }
  
  // Handle selecting a doctor
  const handleSelectDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    navigate('/booking');
  };
  
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
      
      {/* Filters section */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="text-xs"
            >
              {showFilters ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardHeader>
        
        {showFilters && (
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location filter */}
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <label htmlFor="location" className="text-sm font-medium">Location</label>
              </div>
              <Input
                id="location"
                placeholder="Enter pincode or area"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="h-9"
              />
            </div>
            
            {/* Cost filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Consultation Fee</label>
              <div className="pt-2">
                <Slider
                  defaultValue={costFilter}
                  max={2000}
                  step={100}
                  onValueChange={(value) => setCostFilter(value as [number])}
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>₹0</span>
                  <span>₹{costFilter[0]}</span>
                  <span>₹2000+</span>
                </div>
              </div>
            </div>
            
            {/* Rating filter */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                <label className="text-sm font-medium">Minimum Rating</label>
              </div>
              <ToggleGroup type="single" value={ratingFilter.toString()} onValueChange={(val) => val && setRatingFilter(parseFloat(val))}>
                <ToggleGroupItem value="3.0" size="sm">3+</ToggleGroupItem>
                <ToggleGroupItem value="3.5" size="sm">3.5+</ToggleGroupItem>
                <ToggleGroupItem value="4.0" size="sm">4+</ToggleGroupItem>
                <ToggleGroupItem value="4.5" size="sm">4.5+</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Primary Tabs: View Modes and Specialties */}
      <Tabs className="mb-6">
        {/* View Mode Toggle: Recommended vs All */}
        <TabsList className="mb-4 w-full overflow-x-auto flex space-x-2">
          <TabsTrigger 
            value="recommended" 
            onClick={() => setViewMode('recommended')}
            className={viewMode === 'recommended' ? 'bg-health-primary text-white' : ''}
          >
            Recommended Doctors
          </TabsTrigger>
          <TabsTrigger 
            value="all" 
            onClick={() => setViewMode('all')}
            className={viewMode === 'all' ? 'bg-health-primary text-white' : ''}
          >
            All Doctors
          </TabsTrigger>
          
          {/* Specialty filters */}
          {viewMode === 'all' && (
            <>
              <TabsTrigger 
                value="all-specialties" 
                onClick={() => setActiveSpecialty('all')}
                className={activeSpecialty === 'all' ? 'bg-health-primary text-white' : ''}
              >
                All Specialists
              </TabsTrigger>
              {matchedSpecialties.map((specialty, index) => (
                <TabsTrigger 
                  key={index} 
                  value={specialty}
                  onClick={() => setActiveSpecialty(specialty)}
                  className={activeSpecialty === specialty ? 'bg-health-primary text-white' : ''}
                >
                  {specialty}
                </TabsTrigger>
              ))}
            </>
          )}
        </TabsList>
        
        {/* Doctor Lists */}
        <div className="mt-4">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium mb-2">No doctors found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any doctors matching these criteria.
              </p>
              <Button onClick={() => {
                setActiveSpecialty('all');
                setLocationFilter('');
                setCostFilter([500]);
                setRatingFilter(4.0);
              }}>
                Reset filters
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
                        <div className="flex flex-wrap gap-2 text-muted-foreground">
                          <span>{doctor.experience} yrs exp</span>
                          <span className="px-1">•</span>
                          <span>₹{doctor.fee}/consultation</span>
                        </div>
                        <div className="flex items-center mt-1 text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="text-xs">{doctor.location}</span>
                        </div>
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
        </div>
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
