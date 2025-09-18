
import { City, Gender, Hobby } from './types';

export const CITIES: City[] = [
  City.Gurugram,
  City.Delhi,
  City.Mumbai,
  City.Bangalore,
];

export const GENDERS: Gender[] = [
  Gender.Male,
  Gender.Female,
  Gender.NonBinary,
  Gender.PreferNotToSay,
];

export const HOBBIES: Hobby[] = [
    { id: '1', name: 'Gaming' },
    { id: '2', name: 'Reading' },
    { id: '3', name: 'Hiking' },
    { id: '4', name: 'Coding' },
    { id: '5', name: 'Cooking' },
    { id: '6', name: 'Painting' },
    { id: '7', name: 'Photography' },
    { id: '8', name: 'Music Production' },
    { id: '9', name: 'Yoga' },
    { id: '10', name: 'Board Games' },
    { id: '11', name: 'Traveling' },
    { id: '12', name: 'Blogging' },
    { id: '13', name: 'Stand-up Comedy' },
    { id: '14', name: 'Film Making' },
    { id: '15', name: 'Podcasting' },
    { id: '16', name: 'Volunteering' },
    { id: '17', name: 'Gardening' },
    { id: '18', name: 'Martial Arts' },
    { id: '19', name: 'Dancing' },
    { id: '20', name: 'Creative Writing' },
    { id: '21', name: 'Anime/Manga' },
    { id: '22', name: 'Thrifting' },
    { id: '23', name: 'DIY Projects' },
    { id: '24', name: 'Stargazing' },
    { id: '25', name: 'Skateboarding' },
    { id: '26', name: 'Rock Climbing' },
    { id: '27', name: 'Meditation' },
    { id: '28', name: 'Archery' },
    { id: '29', name: 'Kayaking' },
    { id: '30', name: 'Language Learning' },
    { id: '33', name: 'Cosplay' },
    { id: '34', name: 'Astrology' },
    { id: '35', name: 'Memes' },
    { id: '36', name: 'Binge-watching series' },
    { id: '37', name: 'Singing' },
    { id: '38', name: 'Playing an instrument' },
    { id: '39', name: 'Going to concerts' },
    { id: '40', name: 'Trying new food' },
];

export const PERSONALITY_QUESTIONS = [
  {
    question: "After a long week, you'd rather:",
    options: ["Go to a party with lots of people", "Chill at home with a book or movie"],
    trait: "Introvert/Extrovert"
  },
  {
    question: "When making decisions, you rely more on:",
    options: ["Logic and objective facts", "Feelings and how it affects people"],
    trait: "Thinking/Feeling"
  },
  {
    question: "You are more interested in:",
    options: ["What is real and practical", "What is possible and imaginative"],
    trait: "Sensing/Intuition"
  },
  {
    question: "Your life is more:",
    options: ["Planned and organized", "Spontaneous and flexible"],
    trait: "Judging/Perceiving"
  },
  {
    question: "You see yourself as more:",
    options: ["Pragmatic and down-to-earth", "Creative and visionary"],
    trait: "Sensing/Intuition-2"
  },
];
