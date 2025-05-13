
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

// Expanded keyword mapping to specialties with more common symptoms and variants
const keywordToSpecialty: Record<string, string[]> = {
  // Dermatology keywords
  skin: [SPECIALTIES.DERMATOLOGY],
  rash: [SPECIALTIES.DERMATOLOGY],
  acne: [SPECIALTIES.DERMATOLOGY],
  itch: [SPECIALTIES.DERMATOLOGY],
  itchy: [SPECIALTIES.DERMATOLOGY],
  itching: [SPECIALTIES.DERMATOLOGY],
  pimple: [SPECIALTIES.DERMATOLOGY],
  mole: [SPECIALTIES.DERMATOLOGY],
  
  // ENT keywords
  ear: [SPECIALTIES.ENT],
  nose: [SPECIALTIES.ENT],
  throat: [SPECIALTIES.ENT],
  hearing: [SPECIALTIES.ENT],
  voice: [SPECIALTIES.ENT],
  sinus: [SPECIALTIES.ENT],
  tonsil: [SPECIALTIES.ENT],
  snore: [SPECIALTIES.ENT],
  snoring: [SPECIALTIES.ENT],
  
  // General Medicine keywords
  fever: [SPECIALTIES.GENERAL],
  cold: [SPECIALTIES.GENERAL, SPECIALTIES.ENT],
  flu: [SPECIALTIES.GENERAL],
  cough: [SPECIALTIES.GENERAL, SPECIALTIES.ENT],
  infection: [SPECIALTIES.GENERAL],
  tired: [SPECIALTIES.GENERAL],
  fatigue: [SPECIALTIES.GENERAL],
  nausea: [SPECIALTIES.GENERAL],
  vomit: [SPECIALTIES.GENERAL],
  vomiting: [SPECIALTIES.GENERAL],
  diarrhea: [SPECIALTIES.GENERAL],
  
  // Orthopedics keywords
  joint: [SPECIALTIES.ORTHOPEDICS],
  bone: [SPECIALTIES.ORTHOPEDICS],
  fracture: [SPECIALTIES.ORTHOPEDICS],
  sprain: [SPECIALTIES.ORTHOPEDICS],
  back: [SPECIALTIES.ORTHOPEDICS],
  knee: [SPECIALTIES.ORTHOPEDICS],
  shoulder: [SPECIALTIES.ORTHOPEDICS],
  neck: [SPECIALTIES.ORTHOPEDICS, SPECIALTIES.NEUROLOGY],
  pain: [SPECIALTIES.ORTHOPEDICS, SPECIALTIES.GENERAL],
  
  // Cardiology keywords
  heart: [SPECIALTIES.CARDIOLOGY],
  chest: [SPECIALTIES.CARDIOLOGY, SPECIALTIES.GENERAL],
  breath: [SPECIALTIES.CARDIOLOGY, SPECIALTIES.GENERAL],
  breathing: [SPECIALTIES.CARDIOLOGY, SPECIALTIES.GENERAL],
  palpitation: [SPECIALTIES.CARDIOLOGY],
  
  // Neurology keywords
  headache: [SPECIALTIES.NEUROLOGY],
  migraine: [SPECIALTIES.NEUROLOGY],
  dizzy: [SPECIALTIES.NEUROLOGY],
  dizziness: [SPECIALTIES.NEUROLOGY],
  memory: [SPECIALTIES.NEUROLOGY],
  numbness: [SPECIALTIES.NEUROLOGY],
  tingling: [SPECIALTIES.NEUROLOGY],
  
  // Psychiatry keywords
  anxiety: [SPECIALTIES.PSYCHIATRY],
  anxious: [SPECIALTIES.PSYCHIATRY],
  depression: [SPECIALTIES.PSYCHIATRY],
  depressed: [SPECIALTIES.PSYCHIATRY],
  sleep: [SPECIALTIES.PSYCHIATRY, SPECIALTIES.GENERAL],
  stress: [SPECIALTIES.PSYCHIATRY],
  mood: [SPECIALTIES.PSYCHIATRY],
  panic: [SPECIALTIES.PSYCHIATRY],
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
 * Extracts keywords from text input with improved detection
 */
export const extractKeywords = (text: string): string[] => {
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Extract keywords that are in our mapping
  const matchedKeywords = new Set<string>();
  
  Object.keys(keywordToSpecialty).forEach(keyword => {
    if (lowerText.includes(keyword)) {
      matchedKeywords.add(keyword);
    }
  });
  
  // If we found keywords, return them
  if (matchedKeywords.size > 0) {
    return Array.from(matchedKeywords);
  }
  
  // If no direct keyword matches, try to extract potential symptoms
  // This is a very basic implementation - a real app would use NLP
  
  // Look for common symptom phrases
  const commonPhrases = [
    "I feel", "I have", "I'm experiencing", "suffering from", 
    "problem with", "issues with", "pain in", "ache in"
  ];
  
  for (const phrase of commonPhrases) {
    if (lowerText.includes(phrase)) {
      // Extract the word after the phrase
      const startIndex = lowerText.indexOf(phrase) + phrase.length;
      const restOfText = lowerText.substring(startIndex).trim();
      const firstWord = restOfText.split(/\s+/)[0];
      
      if (firstWord && firstWord.length > 2) {
        matchedKeywords.add(firstWord);
      }
    }
  }
  
  return Array.from(matchedKeywords);
};

export const SPECIALTIES_LIST = Object.values(SPECIALTIES);
