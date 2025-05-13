
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
  location?: string;
  fee?: number;
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
    location: "400001, Mumbai Central",
    fee: 800,
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
    location: "400028, Bandra",
    fee: 1200,
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
    location: "400050, Andheri",
    fee: 500,
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
    location: "400005, Girgaon",
    fee: 1500,
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
    location: "400076, Powai",
    fee: 1800,
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
    location: "400021, Parel",
    fee: 1600,
    availabilityIndices: [0, 1, 2, 3, 4, 5, 6],
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
    location: "400058, Santacruz",
    fee: 1400,
    availabilityIndices: [0, 1, 2, 3, 4, 5, 6],
    get availability() { return this.availabilityIndices.map(index => generalTimeSlots[index]); }
  }
];

export default mockDoctors;
