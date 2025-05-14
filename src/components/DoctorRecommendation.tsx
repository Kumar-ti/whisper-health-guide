
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
import { matchSymptomsToSpecialties, SPECIALTIES_LIST, analyzeSymptoms } from '@/utils/symptomMatching';
import { Filter, Star, MapPin, ToggleLeft, ToggleRight, X } from 'lucide-react';

const DoctorRecommendation: React.FC = () => {
  const navigate = useNavigate();
  const { currentSymptoms, recommendedDoctors, setSelectedDoctor } = useConsultation();
  
  // View mode state (recommended vs all)
  const [viewMode, setViewMode] = useState<'recommended' | 'all'>('recommended');
  const [activeSpecialty, setActiveSpecialty] = useState<string>('all');
  
  // Filter states
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [costFilter, setCostFilter] = useState<[number]>([2000]); // Max value to show all by default
  const [ratingFilter, setRatingFilter] = useState<number>(4.0); // Default rating filter
  const [showFilters, setShowFilters] = useState(false);
  
  // Get specialty recommendations and scores based on symptoms
  const specialtyScores = analyzeSymptoms(currentSymptoms);
  const matchedSpecialties = Object.keys(specialtyScores)
    .sort((a, b) => specialtyScores[b] - specialtyScores[a]);
  
  // Get doctor recommendations with specialty-based ranking
  const getDoctorRankingScore = (doctor: any) => {
    // Base score is the specialty match score
    let score = specialtyScores[doctor.specialty] || 0;
    
    // Add points for rating (0-1 scale)
    score += (doctor.rating / 5) * 0.3;
    
    // Add points for experience (0-0.5 scale, capped at 20 years)
    score += Math.min(doctor.experience / 20, 1) * 0.2;
    
    return score;
  };
  
  // Sort doctors by their relevance to the symptoms
  const sortedDoctors = [...recommendedDoctors].sort((a, b) => {
    return getDoctorRankingScore(b) - getDoctorRankingScore(a);
  });
  
  // Get top matches (initially show only the top 3 best matching doctors)
  const topMatchedDoctors = sortedDoctors.slice(0, 3);
  
  // Apply all filters to doctors
  const getFilteredDoctors = () => {
    // Start with either all doctors or just the recommended ones
    const baseList = viewMode === 'recommended' ? topMatchedDoctors : sortedDoctors;
    
    return baseList
      .filter(doctor => activeSpecialty === 'all' || doctor.specialty === activeSpecialty)
      .filter(doctor => !locationFilter || doctor.location?.toLowerCase().includes(locationFilter.toLowerCase()))
      .filter(doctor => doctor.fee <= costFilter[0])
      .filter(doctor => doctor.rating >= ratingFilter);
  };
  
  const filteredDoctors = getFilteredDoctors();
  
  // Reset all filters to default values
  const resetFilters = () => {
    setActiveSpecialty('all');
    setLocationFilter('');
    setCostFilter([2000]);
    setRatingFilter(4.0);
  };
  
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
          <span className="font-medium text-foreground">{matchedSpecialties.slice(0, 3).join(', ')}</span>
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
            <div className="flex items-center gap-2">
              {showFilters && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters}
                  className="text-xs flex items-center"
                >
                  <X className="h-3 w-3 mr-1" />
                  Reset Filters
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs"
              >
                {showFilters ? 'Hide' : 'Show'}
              </Button>
            </div>
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
              <label className="text-sm font-medium">Max Consultation Fee (₹)</label>
              <div className="pt-2">
                <Slider
                  value={costFilter}
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
      
      {/* View mode toggle: Recommended vs All */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-center">
            <ToggleGroup type="single" value={viewMode} onValueChange={(val) => val && setViewMode(val as 'recommended' | 'all')}>
              <ToggleGroupItem value="recommended" size="sm" className="flex items-center">
                {viewMode === 'recommended' ? (
                  <ToggleRight className="h-4 w-4 mr-2 text-health-primary" />
                ) : (
                  <ToggleLeft className="h-4 w-4 mr-2" />
                )}
                Recommended Doctors
              </ToggleGroupItem>
              <ToggleGroupItem value="all" size="sm" className="flex items-center">
                {viewMode === 'all' ? (
                  <ToggleRight className="h-4 w-4 mr-2 text-health-primary" />
                ) : (
                  <ToggleLeft className="h-4 w-4 mr-2" />
                )}
                All Doctors
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>
      
      {/* Specialty filter tabs */}
      <Tabs defaultValue="all" value={activeSpecialty} onValueChange={setActiveSpecialty} className="mb-6">
        <TabsList className="mb-4 overflow-x-auto flex-nowrap">
          <TabsTrigger value="all">All Specialists</TabsTrigger>
          {matchedSpecialties.slice(0, 5).map((specialty, index) => (
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
              <Button onClick={resetFilters}>
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
                    
                    {/* Added specialty match score indicator */}
                    {specialtyScores[doctor.specialty] > 0 && (
                      <div className="mt-2 flex items-center">
                        <span className="text-xs text-muted-foreground mr-2">Symptom match:</span>
                        <div className="bg-gray-200 h-2 rounded-full w-full max-w-[120px]">
                          <div 
                            className="bg-health-primary h-2 rounded-full" 
                            style={{ width: `${Math.round(specialtyScores[doctor.specialty] * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium ml-2">
                          {Math.round(specialtyScores[doctor.specialty] * 100)}%
                        </span>
                      </div>
                    )}
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
