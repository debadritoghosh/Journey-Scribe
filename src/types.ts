export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  imageUrl?: string;
  itinerary?: ItineraryItem[];
  userId?: string;
  createdAt: number;
  budgetLevel?: 'Economy' | 'Standard' | 'Luxury';
  totalEstimatedPrice?: number;
  bookingUrl?: string;
  weatherForecast?: {
    temp: string;
    condition: string;
    description: string;
  };
  stressScore?: number;
  efficiencyReport?: string;
  budgetBreakdown?: {
    activities: number;
    transport: number;
    food: number;
    shopping: number;
  };
  uniqueInsights?: {
    photographySpots: string[];
    culturalEtiquette: string[];
    localSecrets: string[];
  };
}

export interface ItineraryItem {
  day: number;
  activities: Activity[];
  notes?: string;
}

export interface Activity {
  name: string;
  time?: string;
  price?: number;
  locationUrl?: string;
  ticketUrl?: string;
  imageUrl?: string;
  riskLevel?: number;
  transitNote?: string;
}

export interface JournalEntry {
  id: string;
  tripId: string;
  date: string;
  title: string;
  content: string;
  imageUrl?: string;
  userId: string;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isPremium: boolean;
  createdAt: number;
}

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
