import { generalTimeSlots, generateRandomAvailability } from './timeSlots';

// Define the doctor type
type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  image: string;
  bio: string;
  availabilityIndices: number[];
  availability: string[];
};

const mockDoctors: Doctor[] = [
  {
    id: "dr-smith",
    name: "Dr. Sarah Smith",
    specialty: "Dermatology",
    experience: 12,
    rating: 4.8,
    image: "/placeholder.svg",
    bio: "Dr. Smith specializes in treating skin conditions and has expertise in cosmetic dermatology.",
    availabilityIndices: generateRandomAvailability(5),
    get availability() { return this.availabilityIndices.map(index => generalTimeSlots[index]); }
  },
  {
    id: "dr-johnson",
    name: "Dr. Michael Johnson",
    specialty: "ENT",
    experience: 15,
    rating: 4.9,
    image: "/placeholder.svg",
    bio: "Dr. Johnson is an experienced ENT specialist focused on both surgical and non-surgical treatments.",
    availabilityIndices: generateRandomAvailability(4),
    get availability() { return this.availabilityIndices.map(index => generalTimeSlots[index]); }
  },
  {
    id: "dr-patel",
    name: "Dr. Aisha Patel",
    specialty: "General Medicine",
    experience: 8,
    rating: 4.7,
    image: "/placeholder.svg",
    bio: "Dr. Patel provides comprehensive primary care services for patients of all ages.",
    availabilityIndices: generateRandomAvailability(6),
    get availability() { return this.availabilityIndices.map(index => generalTimeSlots[index]); }
  },
  {
    id: "dr-garcia",
    name: "Dr. Carlos Garcia",
    specialty: "Orthopedics",
    experience: 20,
    rating: 4.9,
    image: "/placeholder.svg",
    bio: "Dr. Garcia specializes in sports injuries and joint replacements.",
    availabilityIndices: generateRandomAvailability(4),
    get availability() { return this.availabilityIndices.map(index => generalTimeSlots[index]); }
  },
  {
    id: "dr-chen",
    name: "Dr. Li Chen",
    specialty: "Cardiology",
    experience: 17,
    rating: 4.8,
    image: "/placeholder.svg",
    bio: "Dr. Chen is a board-certified cardiologist focused on preventive cardiology.",
    availabilityIndices: generateRandomAvailability(4),
    get availability() { return this.availabilityIndices.map(index => generalTimeSlots[index]); }
  },
  {
    id: "dr-williams",
    name: "Dr. James Williams",
    specialty: "Neurology",
    experience: 14,
    rating: 4.6,
    image: "/placeholder.svg",
    bio: "Dr. Williams specializes in headaches, migraines, and neurological disorders.",
    //availabilityIndices: generateRandomAvailability(4),
    availabilityIndices: [0, 1, 2, 3,4,5,6],
    get availability() { return this.availabilityIndices.map(index => generalTimeSlots[index]); }
  },
  {
    id: "dr-kim",
    name: "Dr. Soo-Jin Kim",
    specialty: "Psychiatry",
    experience: 10,
    rating: 4.7,
    image: "/placeholder.svg",
    bio: "Dr. Kim focuses on anxiety disorders, depression, and sleep issues.",
    //availabilityIndices: generateRandomAvailability(4),
    availabilityIndices: [0, 1, 2, 3,4,5,6],
    get availability() { return this.availabilityIndices.map(index => generalTimeSlots[index]); }
  }
];

export default mockDoctors;
