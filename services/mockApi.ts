import { User, Match, Event, City, Gender, PersonalityType, Hobby } from '../types';
import { HOBBIES } from '../constants';

const getRandomItems = <T,>(arr: T[], n: number): T[] => {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  if (n > len) throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

export const MOCK_CURRENT_USER: User = {
    id: 'user_0',
    name: 'Alex',
    age: 22,
    gender: Gender.NonBinary,
    city: City.Bangalore,
    hobbies: getRandomItems(HOBBIES, 5),
    bio: 'Just a human trying to vibe. Fueled by coffee and code. Let\'s talk about anything and everything!',
    personalityType: PersonalityType.TheAdvocate,
    avatarUrl: 'https://picsum.photos/seed/alex/512',
    status: 'Exploring new cafes ☕',
    points: 1250,
    isVerified: true,
};


export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Priya',
    age: 24,
    gender: Gender.Female,
    city: City.Mumbai,
    hobbies: getRandomItems(HOBBIES, 4),
    bio: 'Film enthusiast and amateur photographer. Looking for fellow creatives.',
    personalityType: PersonalityType.TheCampaigner,
    avatarUrl: 'https://picsum.photos/seed/priya/512',
    status: 'Just watched a masterpiece!',
    points: 800,
    isVerified: true,
  },
  {
    id: 'user_2',
    name: 'Rohan',
    age: 21,
    gender: Gender.Male,
    city: City.Delhi,
    hobbies: getRandomItems(HOBBIES, 6),
    bio: 'Gamer, meme lord, and aspiring chef. Let\'s team up!',
    personalityType: PersonalityType.TheDebater,
    avatarUrl: 'https://picsum.photos/seed/rohan/512',
    status: 'Leveling up 🎮',
    points: 2100,
    isVerified: false,
  },
  {
    id: 'user_3',
    name: 'Sam',
    age: 26,
    gender: Gender.NonBinary,
    city: City.Bangalore,
    hobbies: getRandomItems(HOBBIES, 3),
    bio: 'Hiking on weekends, coding on weekdays. Nature is my sanctuary.',
    personalityType: PersonalityType.TheArchitect,
    avatarUrl: 'https://picsum.photos/seed/sam/512',
    status: 'Lost in the mountains',
    points: 1500,
    isVerified: true,
  },
  {
    id: 'user_4',
    name: 'Aisha',
    age: 23,
    gender: Gender.Female,
    city: City.Gurugram,
    hobbies: getRandomItems(HOBBIES, 5),
    bio: 'Bookworm and artist. My happy place is a quiet corner with a good story.',
    personalityType: PersonalityType.TheMediator,
    avatarUrl: 'https://picsum.photos/seed/aisha/512',
    status: 'Currently reading...',
    points: 950,
    isVerified: false,
  },
];

export const MOCK_LIKES: User[] = [MOCK_USERS[1], MOCK_USERS[3]];


export const MOCK_MATCHES: Match[] = [
  {
    id: 'match_1',
    users: [MOCK_CURRENT_USER, MOCK_USERS[0]],
    messages: [
      { id: 'msg_1', senderId: 'user_0', text: 'Hey Priya! Saw we both like photography.', timestamp: Date.now() - 200000 },
      { id: 'msg_2', senderId: 'user_1', text: 'Hey Alex! Yeah, that\'s so cool. What do you like to shoot?', timestamp: Date.now() - 100000 },
    ]
  },
   {
    id: 'match_2',
    users: [MOCK_CURRENT_USER, MOCK_USERS[2]],
    messages: [
      { id: 'msg_3', senderId: 'user_2', text: 'Dude, Bangalore hiking spots? Spill the tea.', timestamp: Date.now() - 500000 },
      { id: 'msg_4', senderId: 'user_0', text: 'Haha, for sure! Nandi Hills sunrise is epic.', timestamp: Date.now() - 400000 },
    ]
  }
];

export const MOCK_EVENTS: Event[] = [
    {
        id: 'event_1',
        title: 'Board Game Night',
        description: 'Casual board game night for all levels. Bring your favorite game or just yourself!',
        city: City.Bangalore,
        date: '2024-08-15T18:00:00',
        attendees: ['user_0', 'user_3']
    },
    {
        id: 'event_2',
        title: 'Gurugram Food Walk',
        description: 'Explore the best street food stalls in Gurugram. Come hungry!',
        city: City.Gurugram,
        date: '2024-08-18T12:00:00',
        attendees: ['user_4']
    },
    {
        id: 'event_3',
        title: 'Open Mic Night',
        description: 'A night for poetry, comedy, and music. Come perform or just enjoy the show.',
        city: City.Mumbai,
        date: '2024-08-22T19:30:00',
        attendees: ['user_1']
    }
];

// Mock API functions
export const fetchDiscoverUsers = async (): Promise<User[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_USERS), 500));
}

export const fetchLikes = async (): Promise<User[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_LIKES), 500));
}

export const fetchMatchDetails = async (matchId: string): Promise<Match | undefined> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_MATCHES.find(m => m.id === matchId)), 300));
}

export const fetchEvents = async (): Promise<Event[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_EVENTS), 400));
}

export const fetchMatchesForUser = async (userId: string): Promise<Match[]> => {
    return new Promise(resolve => 
        setTimeout(() => 
            resolve(MOCK_MATCHES.filter(match => match.users.some(u => u.id === userId)))
        , 300)
    );
}