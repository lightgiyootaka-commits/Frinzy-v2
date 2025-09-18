
export enum City {
  Gurugram = 'Gurugram',
  Delhi = 'Delhi',
  Mumbai = 'Mumbai',
  Bangalore = 'Bangalore',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  NonBinary = 'Non-binary',
  PreferNotToSay = 'Prefer not to say',
}

export enum PersonalityType {
  TheArchitect = 'The Architect',
  TheLogician = 'The Logician',
  TheCommander = 'The Commander',
  TheDebater = 'The Debater',
  TheAdvocate = 'The Advocate',
  TheMediator = 'The Mediator',
  TheProtagonist = 'The Protagonist',
  TheCampaigner = 'The Campaigner',
}

export interface Hobby {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  city: City;
  hobbies: Hobby[];
  bio: string;
  personalityType: PersonalityType;
  avatarUrl: string;
  status: string;
  points: number;
  isVerified: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Match {
  id: string;
  users: [User, User];
  messages: Message[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  city: City;
  date: string;
  attendees: string[]; // array of user IDs
}
