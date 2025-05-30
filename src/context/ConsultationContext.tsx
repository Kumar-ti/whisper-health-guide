import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAnonymousToken, saveAnonymousToken } from '../utils/localStorage';
import { Doctor as MockDoctor } from '../data/mockDoctors';

// Define types for our context
type ConsultationMode = 'audio' | 'video' | 'whatsapp' | 'in-person';

type Symptom = {
  id: string;
  name: string;
  specialty: string[];
};

// Update Doctor type to match the one in mockDoctors.ts
type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  image: string;
  bio: string;
  location: string; // Add required location property
  fee: number; // Add required fee property
  availability: string[];
};

type Consultation = {
  id: string;
  date: string;
  doctorId: string;
  symptoms: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  prescription?: string;
  mode: ConsultationMode;
};

interface ConsultationContextType {
  // User identification
  anonymousId: string | null;
  
  // Symptom checker state
  currentSymptoms: string[];
  addSymptom: (symptom: string) => void;
  removeSymptom: (symptom: string) => void;
  clearSymptoms: () => void;
  
  // Doctors
  recommendedDoctors: Doctor[];
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  
  // Booking
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
  selectedMode: ConsultationMode | null;
  setSelectedMode: (mode: ConsultationMode | null) => void;
  
  // Consultations history
  pastConsultations: Consultation[];
  addConsultation: (consultation: Omit<Consultation, 'id'> & { id?: string }) => void;
  reschedulingConsultationId: string | null;
  setReschedulingConsultationId: (id: string | null) => void;
  
  // Workflow
  resetBookingData: () => void;
}

// Create the context with default values
const ConsultationContext = createContext<ConsultationContextType>({
  anonymousId: null,
  currentSymptoms: [],
  addSymptom: () => {},
  removeSymptom: () => {},
  clearSymptoms: () => {},
  recommendedDoctors: [],
  selectedDoctor: null,
  setSelectedDoctor: () => {},
  selectedDate: null,
  setSelectedDate: () => {},
  selectedTime: null,
  setSelectedTime: () => {},
  selectedMode: null,
  setSelectedMode: () => {},
  pastConsultations: [],
  addConsultation: () => {},
  reschedulingConsultationId: null,
  setReschedulingConsultationId: () => {},
  resetBookingData: () => {},
});

export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Anonymous ID management
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  
  // Symptom checker state
  const [currentSymptoms, setCurrentSymptoms] = useState<string[]>([]);
  
  // Doctors state
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<ConsultationMode | null>(null);
  
  // Consultations history
  const [pastConsultations, setPastConsultations] = useState<Consultation[]>([]);
  
  // Rescheduling consultation ID
  const [reschedulingConsultationId, setReschedulingConsultationId] = useState<string | null>(null);
  
  // Load consultations from localStorage on mount
  useEffect(() => {
    const storedId = getAnonymousToken();
    if (storedId) {
      setAnonymousId(storedId);
      // Load stored consultations
      const storedConsultations = localStorage.getItem(`consultations_${storedId}`);
      if (storedConsultations) {
        console.log('Loading consultations from localStorage:', JSON.parse(storedConsultations));
        setPastConsultations(JSON.parse(storedConsultations));
      }
    } else {
      const newId = crypto.randomUUID();
      saveAnonymousToken(newId);
      setAnonymousId(newId);
    }
  }, []);
  
  // Save consultations to localStorage whenever they change
  useEffect(() => {
    if (anonymousId) {
      console.log('Saving consultations to localStorage:', pastConsultations);
      localStorage.setItem(`consultations_${anonymousId}`, JSON.stringify(pastConsultations));
    }
  }, [pastConsultations, anonymousId]);
  
  // Add a symptom to the current list
  const addSymptom = (symptom: string) => {
    if (!currentSymptoms.includes(symptom)) {
      setCurrentSymptoms([...currentSymptoms, symptom]);
    }
  };
  
  // Remove a symptom from the current list
  const removeSymptom = (symptom: string) => {
    setCurrentSymptoms(currentSymptoms.filter(s => s !== symptom));
  };
  
  // Clear all symptoms
  const clearSymptoms = () => {
    setCurrentSymptoms([]);
  };
  
  // Add or update a consultation in history
  const addConsultation = (consultation: Omit<Consultation, 'id'> & { id?: string }) => {
    try {
      // Ensure date is in ISO format and valid
      const date = new Date(consultation.date);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      
      const formattedConsultation = {
        ...consultation,
        date: date.toISOString()
      };

      if (consultation.id) {
        // Update existing consultation
        setPastConsultations(currentConsultations => {
          console.log('Updating consultation. Current consultations:', currentConsultations);
          const updatedConsultations = currentConsultations.map(c => 
            c.id === consultation.id ? { ...formattedConsultation, id: consultation.id } as Consultation : c
          );
          console.log('Updated consultations:', updatedConsultations);
          return updatedConsultations;
        });
      } else {
        // Add new consultation
        const newConsultation = {
          ...formattedConsultation,
          id: crypto.randomUUID()
        } as Consultation;
        console.log('Adding new consultation:', newConsultation);
        setPastConsultations(currentConsultations => {
          console.log('Current consultations before adding:', currentConsultations);
          const updatedConsultations = [newConsultation, ...currentConsultations];
          console.log('Updated consultations after adding:', updatedConsultations);
          return updatedConsultations;
        });
      }
    } catch (error) {
      console.error('Error adding consultation:', error);
    }
  };
  
  // Reset booking-related data
  const resetBookingData = () => {
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedMode(null);
    setReschedulingConsultationId(null);
  };
  
  // Update recommended doctors whenever symptoms change
  useEffect(() => {
    // In a real implementation, this would use the actual symptom matching logic
    // For now, we'll just import some mock doctors in the component that needs them
    if (currentSymptoms.length > 0) {
      // This would be replaced with actual logic to match symptoms to doctors
      import('../data/mockDoctors').then((module) => {
        // Simple logic: if current symptoms include certain keywords, recommend certain specialists
        const mockDoctors = module.default;
        setRecommendedDoctors(mockDoctors);
      });
    } else {
      setRecommendedDoctors([]);
    }
  }, [currentSymptoms]);
  
  return (
    <ConsultationContext.Provider 
      value={{
        anonymousId,
        currentSymptoms,
        addSymptom,
        removeSymptom,
        clearSymptoms,
        recommendedDoctors,
        selectedDoctor,
        setSelectedDoctor,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        selectedMode,
        setSelectedMode,
        pastConsultations,
        addConsultation,
        reschedulingConsultationId,
        setReschedulingConsultationId,
        resetBookingData
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

// Custom hook for using the consultation context
export const useConsultation = () => useContext(ConsultationContext);
