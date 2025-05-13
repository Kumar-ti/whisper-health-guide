import React, { createContext, useState, useContext, useEffect } from 'react';

// Types for doctor context
type Availability = {
  date: string;
  timeSlots: string[];
};

type Patient = {
  id: string;
  consultationId: string;
  symptoms: string[];
  date: string;
  time: string;
  mode: 'audio' | 'video' | 'whatsapp' | 'in-person';
  status: 'pending' | 'accepted' | 'declined';
  prescription?: string;
  notes?: string;
  prescribingDoctor?: {
    id: string;
    name: string;
    specialty: string;
  };
};

type Doctor = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  availability: Availability[];
};

type PossibleDisease = {
  name: string;
  probability: number;
  description: string;
};

interface DoctorContextType {
  // Doctor authentication
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  currentDoctor: Doctor | null;
  
  // Availability management
  updateAvailability: (availability: Availability[]) => void;
  
  // Appointment management
  pendingAppointments: Patient[];
  acceptedAppointments: Patient[];
  acceptAppointment: (consultationId: string) => void;
  declineAppointment: (consultationId: string) => void;
  
  // Disease prediction based on symptoms
  getPossibleDiseases: (symptoms: string[]) => PossibleDisease[];
  
  // Past consultations
  getPatientHistory: (patientId: string) => Patient[];
}

// Create doctor context with default values
const DoctorContext = createContext<DoctorContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  currentDoctor: null,
  updateAvailability: () => {},
  pendingAppointments: [],
  acceptedAppointments: [],
  acceptAppointment: () => {},
  declineAppointment: () => {},
  getPossibleDiseases: () => [],
  getPatientHistory: () => [],
});

// Mock data for doctors
const MOCK_DOCTORS: Doctor[] = [
  {
    id: "dr1",
    name: "Dr. Sarah Johnson",
    email: "sarah@example.com",
    specialty: "General Practitioner",
    availability: [
      {
        date: "2023-11-01",
        timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00"]
      },
      {
        date: "2023-11-02",
        timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00"]
      }
    ]
  },
  {
    id: "dr2",
    name: "Dr. Michael Chen",
    email: "michael@example.com",
    specialty: "Cardiologist",
    availability: [
      {
        date: "2023-11-01",
        timeSlots: ["10:00", "11:00", "13:00", "14:00"]
      },
      {
        date: "2023-11-03",
        timeSlots: ["09:00", "10:00", "11:00", "15:00"]
      }
    ]
  }
];

// Mock pending appointments
const MOCK_PENDING_APPOINTMENTS: Patient[] = [
  {
    id: "p1",
    consultationId: "c1",
    symptoms: ["Fever", "Headache", "Fatigue"],
    date: "2023-11-01",
    time: "10:00",
    mode: "video",
    status: "pending"
  },
  {
    id: "p2",
    consultationId: "c2",
    symptoms: ["Chest pain", "Shortness of breath"],
    date: "2023-11-02",
    time: "14:00",
    mode: "in-person",
    status: "pending"
  }
];

// Mock disease predictions
const MOCK_DISEASE_PREDICTIONS: { [key: string]: PossibleDisease[] } = {
  "Fever,Headache,Fatigue": [
    { name: "Common Cold", probability: 0.7, description: "A viral infection of the upper respiratory tract." },
    { name: "Influenza", probability: 0.6, description: "A viral infection that attacks your respiratory system." },
    { name: "COVID-19", probability: 0.5, description: "An infectious disease caused by the SARS-CoV-2 virus." }
  ],
  "Chest pain,Shortness of breath": [
    { name: "Angina", probability: 0.8, description: "A type of chest pain caused by reduced blood flow to the heart." },
    { name: "Myocardial Infarction", probability: 0.5, description: "A heart attack occurs when the flow of blood to the heart is blocked." },
    { name: "Pulmonary Embolism", probability: 0.4, description: "A blockage in one of the pulmonary arteries in your lungs." }
  ],
  "Sore throat,Cough": [
    { name: "Pharyngitis", probability: 0.8, description: "Inflammation of the pharynx, resulting in a sore throat." },
    { name: "Laryngitis", probability: 0.6, description: "Inflammation of the voice box (larynx) from overuse, irritation or infection." },
    { name: "Tonsillitis", probability: 0.4, description: "Inflammation of the tonsils, usually caused by a viral or bacterial infection." }
  ],
  "Fever,Rash": [
    { name: "Chickenpox", probability: 0.7, description: "A highly contagious viral infection causing an itchy, blister-like rash." },
    { name: "Measles", probability: 0.5, description: "A highly contagious viral infection that causes a distinctive red rash." },
    { name: "Drug Allergy", probability: 0.4, description: "An adverse reaction to medications causing symptoms such as rash and fever." }
  ],
  "Joint pain,Stiffness,Fatigue": [
    { name: "Rheumatoid Arthritis", probability: 0.75, description: "An inflammatory disorder affecting the joints." },
    { name: "Fibromyalgia", probability: 0.6, description: "A disorder characterized by widespread musculoskeletal pain." },
    { name: "Lupus", probability: 0.45, description: "A systemic autoimmune disease that occurs when your body's immune system attacks your own tissues and organs." }
  ],
  "Abdominal pain,Nausea,Vomiting": [
    { name: "Gastroenteritis", probability: 0.8, description: "Inflammation of the stomach and intestines, typically resulting from a bacterial or viral infection." },
    { name: "Appendicitis", probability: 0.5, description: "Inflammation of the appendix causing severe abdominal pain." },
    { name: "Gastritis", probability: 0.6, description: "Inflammation of the stomach lining causing abdominal pain." }
  ]
};

// Mock patient history records by patient ID
const MOCK_PATIENT_HISTORY: { [key: string]: Patient[] } = {
  "p1": [
    {
      id: "p1",
      consultationId: "past1",
      symptoms: ["Sore throat", "Cough"],
      date: "2023-10-15",
      time: "11:00",
      mode: "video",
      status: "accepted",
      prescription: "Amoxicillin 500mg, 3 times daily for 7 days. Lozenges for throat pain as needed.",
      notes: "Patient reports sore throat for 3 days with increasing cough. Temperature 37.8°C. Throat appears red and inflamed. Advise plenty of fluids and rest.",
      prescribingDoctor: {
        id: "dr3",
        name: "Dr. Emily Rodriguez",
        specialty: "General Practitioner"
      }
    },
    {
      id: "p1",
      consultationId: "past2",
      symptoms: ["Fever", "Rash"],
      date: "2023-09-20",
      time: "14:30",
      mode: "in-person",
      status: "accepted",
      prescription: "Antihistamine for itching. Paracetamol for fever. Apply calamine lotion to affected areas.",
      notes: "Patient presents with fever and widespread rash. No recent medication changes. No known allergies. Advised to follow up if symptoms worsen.",
      prescribingDoctor: {
        id: "dr4",
        name: "Dr. James Wilson",
        specialty: "Dermatologist"
      }
    },
    {
      id: "p1",
      consultationId: "past3",
      symptoms: ["Joint pain", "Stiffness", "Fatigue"],
      date: "2023-07-12",
      time: "09:30",
      mode: "in-person",
      status: "accepted",
      prescription: "Ibuprofen 400mg as needed for pain, maximum 3 times daily. Referral to rheumatologist.",
      notes: "Patient complains of ongoing joint pain, mostly in mornings. Physical examination shows slight swelling in finger joints. Blood tests ordered to check inflammatory markers.",
      prescribingDoctor: {
        id: "dr5",
        name: "Dr. Robert Chang",
        specialty: "Rheumatologist"
      }
    }
  ],
  "p2": [
    {
      id: "p2",
      consultationId: "past4",
      symptoms: ["Chest pain", "Shortness of breath"],
      date: "2023-10-05",
      time: "10:15",
      mode: "in-person",
      status: "accepted",
      prescription: "Nitroglycerin sublingual tablets for chest pain. Referral for cardiac stress test.",
      notes: "Patient describes chest pain on exertion. ECG shows minor abnormalities. Advised to avoid strenuous activity until cardiology assessment.",
      prescribingDoctor: {
        id: "dr2",
        name: "Dr. Michael Chen",
        specialty: "Cardiologist"
      }
    },
    {
      id: "p2",
      consultationId: "past5",
      symptoms: ["Abdominal pain", "Nausea", "Vomiting"],
      date: "2023-08-18",
      time: "16:00",
      mode: "video",
      status: "accepted",
      prescription: "Ondansetron 4mg for nausea. Clear liquid diet for 24 hours.",
      notes: "Patient reports abdominal pain and vomiting for 24 hours. No fever. Likely viral gastroenteritis. Advised to stay hydrated and monitor symptoms.",
      prescribingDoctor: {
        id: "dr1",
        name: "Dr. Sarah Johnson",
        specialty: "General Practitioner"
      }
    }
  ]
};

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [pendingAppointments, setPendingAppointments] = useState<Patient[]>([]);
  const [acceptedAppointments, setAcceptedAppointments] = useState<Patient[]>([]);

  // Load doctor data from localStorage on mount
  useEffect(() => {
    const storedDoctor = localStorage.getItem('currentDoctor');
    if (storedDoctor) {
      setCurrentDoctor(JSON.parse(storedDoctor));
      setIsAuthenticated(true);

      // Load appointments
      setPendingAppointments(MOCK_PENDING_APPOINTMENTS);
    }
  }, []);

  // Mock login functionality
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would validate credentials with an API
    const doctor = MOCK_DOCTORS.find(d => d.email === email);
    
    // For demo purposes, any password will work
    if (doctor) {
      setCurrentDoctor(doctor);
      setIsAuthenticated(true);
      setPendingAppointments(MOCK_PENDING_APPOINTMENTS);
      
      // Store in localStorage
      localStorage.setItem('currentDoctor', JSON.stringify(doctor));
      return true;
    }
    
    return false;
  };

  // Logout functionality
  const logout = () => {
    setCurrentDoctor(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentDoctor');
  };

  // Update doctor availability
  const updateAvailability = (availability: Availability[]) => {
    if (currentDoctor) {
      const updatedDoctor = {
        ...currentDoctor,
        availability
      };
      setCurrentDoctor(updatedDoctor);
      localStorage.setItem('currentDoctor', JSON.stringify(updatedDoctor));
    }
  };

  // Accept an appointment
  const acceptAppointment = (consultationId: string) => {
    const appointment = pendingAppointments.find(a => a.consultationId === consultationId);
    if (appointment) {
      const updatedAppointment = {...appointment, status: 'accepted' as const};
      setPendingAppointments(prev => prev.filter(a => a.consultationId !== consultationId));
      setAcceptedAppointments(prev => [...prev, updatedAppointment]);
    }
  };

  // Decline an appointment
  const declineAppointment = (consultationId: string) => {
    setPendingAppointments(prev => prev.filter(a => a.consultationId !== consultationId));
  };

  // Get possible diseases based on symptoms
  const getPossibleDiseases = (symptoms: string[]): PossibleDisease[] => {
    const key = symptoms.sort().join(',');
    return MOCK_DISEASE_PREDICTIONS[key] || [];
  };

  // Get patient history (mock implementation)
  const getPatientHistory = (patientId: string): Patient[] => {
    return MOCK_PATIENT_HISTORY[patientId] || [];
  };

  return (
    <DoctorContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        currentDoctor,
        updateAvailability,
        pendingAppointments,
        acceptedAppointments,
        acceptAppointment,
        declineAppointment,
        getPossibleDiseases,
        getPatientHistory
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

// Custom hook for using the doctor context
export const useDoctor = () => useContext(DoctorContext); 