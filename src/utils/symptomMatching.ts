
// Define specialties
const SPECIALTIES = {
  DERMATOLOGY: 'Dermatology',
  ENT: 'ENT',
  GENERAL: 'General Medicine',
  ORTHOPEDICS: 'Orthopedics',
  CARDIOLOGY: 'Cardiology',
  NEUROLOGY: 'Neurology',
  PSYCHIATRY: 'Psychiatry',
  PEDIATRICS: 'Pediatrics',
  GYNECOLOGY: 'Gynecology',
};

// Keyword mapping to specialties
const keywordToSpecialty: Record<string, string[]> = {
  // Dermatology keywords
  skin: [SPECIALTIES.DERMATOLOGY],
  rash: [SPECIALTIES.DERMATOLOGY],
  acne: [SPECIALTIES.DERMATOLOGY],
  itch: [SPECIALTIES.DERMATOLOGY],
  
  // ENT keywords
  ear: [SPECIALTIES.ENT],
  nose: [SPECIALTIES.ENT],
  throat: [SPECIALTIES.ENT],
  hearing: [SPECIALTIES.ENT],
  voice: [SPECIALTIES.ENT],
  
  // General Medicine keywords
  fever: [SPECIALTIES.GENERAL],
  cold: [SPECIALTIES.GENERAL, SPECIALTIES.ENT],
  flu: [SPECIALTIES.GENERAL],
  cough: [SPECIALTIES.GENERAL, SPECIALTIES.ENT],
  
  // Orthopedics keywords
  joint: [SPECIALTIES.ORTHOPEDICS],
  bone: [SPECIALTIES.ORTHOPEDICS],
  fracture: [SPECIALTIES.ORTHOPEDICS],
  sprain: [SPECIALTIES.ORTHOPEDICS],
  back: [SPECIALTIES.ORTHOPEDICS],
  
  // Cardiology keywords
  heart: [SPECIALTIES.CARDIOLOGY],
  chest: [SPECIALTIES.CARDIOLOGY, SPECIALTIES.GENERAL],
  breath: [SPECIALTIES.CARDIOLOGY, SPECIALTIES.GENERAL],
  
  // Neurology keywords
  headache: [SPECIALTIES.NEUROLOGY],
  migraine: [SPECIALTIES.NEUROLOGY],
  dizzy: [SPECIALTIES.NEUROLOGY],
  
  // Psychiatry keywords
  anxiety: [SPECIALTIES.PSYCHIATRY],
  depression: [SPECIALTIES.PSYCHIATRY],
  sleep: [SPECIALTIES.PSYCHIATRY, SPECIALTIES.GENERAL],
  stress: [SPECIALTIES.PSYCHIATRY],
  
  // Add more keyword mappings as needed
};

/**
 * Match symptoms to specialties based on keywords
 */
export const matchSymptomsToSpecialties = (symptoms: string[]): string[] => {
  const specialties = new Set<string>();
  
  // Process each symptom
  symptoms.forEach(symptom => {
    // Convert to lowercase for case-insensitive matching
    const lowerSymptom = symptom.toLowerCase();
    
    // Check for keyword matches
    Object.keys(keywordToSpecialty).forEach(keyword => {
      if (lowerSymptom.includes(keyword)) {
        keywordToSpecialty[keyword].forEach(specialty => {
          specialties.add(specialty);
        });
      }
    });
  });
  
  // If no matches, default to General Medicine
  if (specialties.size === 0) {
    specialties.add(SPECIALTIES.GENERAL);
  }
  
  return Array.from(specialties);
};

/**
 * Get common symptoms for a chatbot to suggest
 */
export const getCommonSymptoms = (): string[] => {
  return [
    'Headache',
    'Fever',
    'Sore throat',
    'Cough',
    'Skin rash',
    'Back pain',
    'Stomach pain',
    'Nausea',
    'Dizziness',
    'Fatigue',
    'Ear pain',
    'Eye irritation',
    'Joint pain',
    'Anxiety',
    'Breathing difficulty'
  ];
};

/**
 * Extracts keywords from text input
 */
export const extractKeywords = (text: string): string[] => {
  // A very basic implementation - in a real app, this would use NLP
  const lowerText = text.toLowerCase();
  return Object.keys(keywordToSpecialty).filter(keyword => 
    lowerText.includes(keyword)
  );
};

export const SPECIALTIES_LIST = Object.values(SPECIALTIES);
