export const generalTimeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM"
];

// Helper function to generate random availability indices
export const generateRandomAvailability = (numSlots: number = 4): number[] => {
  const indices: number[] = [];
  const maxIndex = generalTimeSlots.length - 1;
  
  while (indices.length < numSlots) {
    const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }
  
  return indices.sort((a, b) => a - b);
}; 