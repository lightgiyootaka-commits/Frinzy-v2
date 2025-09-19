// Fix: Populating the previously empty types file with all necessary type definitions.

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

export interface Hobby {
    id: string;
    name: string;
}

export interface TraitHints {
    introvert?: boolean;
    openness?: boolean;
    conscientious?: boolean;
    nightOwl?: boolean;
}

export interface User {
    id: string; // This will be the Supabase auth user ID (UUID)
    name: string;
    age: number;
    avatarUrl: string;
    bio: string;
    hobbies: Hobby[];
    city: City;
    gender: Gender;
    isVerified: boolean;
    personalityType: string;
    points: number;
    thisOrThat: string[];
    vibeStickers: string[];
    funLine?: string | null;
    traitHints?: TraitHints;
    // Fields added from quiz
    aiSummary?: string | null;
    quizAnswers?: Record<string, string> | null;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
}

export interface Match {
    id: string;
    users: User[];
    messages: Message[];
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    city: City;
    attendees: string[]; // array of user IDs
}
