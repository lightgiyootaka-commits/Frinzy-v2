import React, { useState, useEffect } from 'react';
import { Event } from '../../types';
import { supabase } from '../../services/supabaseClient';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const [isAttending, setIsAttending] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(event.attendees.length);
  const { user } = useAuth();
  
  // In a real app, you'd check if the current user ID is in the attendees list.
  
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
  
  const handleRsvp = async () => {
      if (!user) return;
      // This is a simplified toggle. A real implementation would need to properly
      // add/remove user from the attendees array in the database.
      // Using an RPC in Supabase would be the best way to handle this atomically.
      setIsAttending(!isAttending);
      setAttendeeCount(prev => isAttending ? prev - 1 : prev + 1);
  };

  return (
    <GlassCard>
      <h3 className="text-xl font-bold text-primary dark:text-purple-300">{event.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{event.city}</p>
      <p className="font-semibold mb-3">{formattedDate}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{attendeeCount} attending</p>
        <Button onClick={handleRsvp} variant={isAttending ? 'secondary' : 'primary'} size="sm">
          {isAttending ? 'Attending ✓' : 'RSVP'}
        </Button>
      </div>
    </GlassCard>
  );
};


const EventsScreen: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
        
      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data as Event[]);
      }
      setLoading(false);
    };
    loadEvents();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Upcoming Events</h1>
        <Button>+ Create Event</Button>
      </div>
      
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  );
};

export default EventsScreen;
