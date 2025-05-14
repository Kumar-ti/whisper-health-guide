

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

// Expanded and more comprehensive keyword mapping to specialties
const keywordToSpecialty: Record<string, string[]> = {
  // Dermatology keywords - skin related issues
  skin: [SPECIALTIES.DERMATOLOGY],
  rash: [SPECIALTIES.DERMATOLOGY],
  acne: [SPECIALTIES.DERMATOLOGY],
  itch: [SPECIALTIES.DERMATOLOGY],
  itchy: [SPECIALTIES.DERMATOLOGY],
  itching: [SPECIALTIES.DERMATOLOGY],
  pimple: [SPECIALTIES.DERMATOLOGY],
  mole: [SPECIALTIES.DERMATOLOGY],
  dermatitis: [SPECIALTIES.DERMATOLOGY],
  eczema: [SPECIALTIES.DERMATOLOGY],
  psoriasis: [SPECIALTIES.DERMATOLOGY],
  hives: [SPECIALTIES.DERMATOLOGY],
  
  // ENT keywords - ear, nose, throat issues
  ear: [SPECIALTIES.ENT],
  nose: [SPECIALTIES.ENT],
  throat: [SPECIALTIES.ENT],
  hearing: [SPECIALTIES.ENT],
  voice: [SPECIALTIES.ENT],
  sinus: [SPECIALTIES.ENT],
  tonsil: [SPECIALTIES.ENT],
  snore: [SPECIALTIES.ENT],
  snoring: [SPECIALTIES.ENT],
  hoarse: [SPECIALTIES.ENT],
  nasal: [SPECIALTIES.ENT],
  
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
  weakness: [SPECIALTIES.GENERAL],
  
  // Orthopedics keywords - bone and joint issues
  joint: [SPECIALTIES.ORTHOPEDICS],
  bone: [SPECIALTIES.ORTHOPEDICS],
  fracture: [SPECIALTIES.ORTHOPEDICS],
  sprain: [SPECIALTIES.ORTHOPEDICS],
  back: [SPECIALTIES.ORTHOPEDICS],
  knee: [SPECIALTIES.ORTHOPEDICS],
  shoulder: [SPECIALTIES.ORTHOPEDICS],
  neck: [SPECIALTIES.ORTHOPEDICS, SPECIALTIES.NEUROLOGY],
  pain: [SPECIALTIES.ORTHOPEDICS, SPECIALTIES.GENERAL],
  arthritis: [SPECIALTIES.ORTHOPEDICS],
  swelling: [SPECIALTIES.ORTHOPEDICS],
  
  // Cardiology keywords - heart related issues
  heart: [SPECIALTIES.CARDIOLOGY],
  chest: [SPECIALTIES.CARDIOLOGY, SPECIALTIES.GENERAL],
  breath: [SPECIALTIES.CARDIOLOGY, SPECIALTIES.GENERAL],
  breathing: [SPECIALTIES.CARDIOLOGY, SPECIALTIES.GENERAL],
  palpitation: [SPECIALTIES.CARDIOLOGY],
  pressure: [SPECIALTIES.CARDIOLOGY],
  cholesterol: [SPECIALTIES.CARDIOLOGY],
  hypertension: [SPECIALTIES.CARDIOLOGY],
  
  // Neurology keywords - brain and nervous system issues
  headache: [SPECIALTIES.NEUROLOGY],
  migraine: [SPECIALTIES.NEUROLOGY],
  dizzy: [SPECIALTIES.NEUROLOGY],
  dizziness: [SPECIALTIES.NEUROLOGY],
  memory: [SPECIALTIES.NEUROLOGY],
  numbness: [SPECIALTIES.NEUROLOGY],
  tingling: [SPECIALTIES.NEUROLOGY],
  seizure: [SPECIALTIES.NEUROLOGY],
  tremor: [SPECIALTIES.NEUROLOGY],
  
  // Psychiatry keywords - mental health issues
  anxiety: [SPECIALTIES.PSYCHIATRY],
  anxious: [SPECIALTIES.PSYCHIATRY],
  depression: [SPECIALTIES.PSYCHIATRY],
  depressed: [SPECIALTIES.PSYCHIATRY],
  sleep: [SPECIALTIES.PSYCHIATRY, SPECIALTIES.GENERAL],
  stress: [SPECIALTIES.PSYCHIATRY],
  mood: [SPECIALTIES.PSYCHIATRY],
  panic: [SPECIALTIES.PSYCHIATRY],
  insomnia: [SPECIALTIES.PSYCHIATRY],
  
  // Pediatrics keywords - children's health issues
  child: [SPECIALTIES.PEDIATRICS],
  infant: [SPECIALTIES.PEDIATRICS],
  baby: [SPECIALTIES.PEDIATRICS],
  toddler: [SPECIALTIES.PEDIATRICS],
  
  // Gynecology keywords - women's health issues
  menstrual: [SPECIALTIES.GYNECOLOGY],
  period: [SPECIALTIES.GYNECOLOGY],
  pregnancy: [SPECIALTIES.GYNECOLOGY],
  pregnant: [SPECIALTIES.GYNECOLOGY],
};

/**
 * Match symptoms to specialties based on keywords with improved accuracy
 */
export const matchSymptomsToSpecialties = (symptoms: string[]): string[] => {
  // Use a map to count specialty matches and their confidence scores
  const specialtyScores: Record<string, number> = {};
  
  // Process each symptom
  symptoms.forEach(symptom => {
    // Convert to lowercase for case-insensitive matching
    const lowerSymptom = symptom.toLowerCase();
    
    // Check for keyword matches
    Object.keys(keywordToSpecialty).forEach(keyword => {
      if (lowerSymptom.includes(keyword)) {
        keywordToSpecialty[keyword].forEach(specialty => {
          // Add to score - primary specialties get higher score 
          specialtyScores[specialty] = (specialtyScores[specialty] || 0) + 1;
        });
      }
    });
  });
  
  // If no matches, default to General Medicine
  if (Object.keys(specialtyScores).length === 0) {
    return [SPECIALTIES.GENERAL];
  }
  
  // Sort specialties by score (most relevant first)
  const sortedSpecialties = Object.entries(specialtyScores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  return sortedSpecialties;
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
  // This is a basic implementation - a real app would use NLP
  
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

/**
 * Analyze symptoms and categorize by medical specialty with confidence scores
 * This provides a more comprehensive analysis for more accurate doctor matching
 */
export const analyzeSymptoms = (symptoms: string[]): Record<string, number> => {
  const specialtyScores: Record<string, number> = {};
  
  // If no symptoms provided, return general medicine
  if (!symptoms.length) {
    specialtyScores[SPECIALTIES.GENERAL] = 1.0;
    return specialtyScores;
  }
  
  // Process each symptom and calculate specialty scores
  symptoms.forEach(symptom => {
    const lowerSymptom = symptom.toLowerCase();
    let matched = false;
    
    // Match keywords to specialties
    Object.keys(keywordToSpecialty).forEach(keyword => {
      if (lowerSymptom.includes(keyword)) {
        keywordToSpecialty[keyword].forEach(specialty => {
          // Primary matches get a higher score
          const score = keywordToSpecialty[keyword][0] === specialty ? 1.0 : 0.5;
          specialtyScores[specialty] = (specialtyScores[specialty] || 0) + score;
          matched = true;
        });
      }
    });
    
    // If no match found, add a small score to general medicine
    if (!matched) {
      specialtyScores[SPECIALTIES.GENERAL] = (specialtyScores[SPECIALTIES.GENERAL] || 0) + 0.3;
    }
  });
  
  // Normalize scores between 0 and 1
  const totalScore = Object.values(specialtyScores).reduce((sum, score) => sum + score, 0);
  if (totalScore > 0) {
    Object.keys(specialtyScores).forEach(specialty => {
      specialtyScores[specialty] /= totalScore;
    });
  }
  
  return specialtyScores;
};

export const SPECIALTIES_LIST = Object.values(SPECIALTIES);

