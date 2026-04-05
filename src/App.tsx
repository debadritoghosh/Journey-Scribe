import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Sparkles, Compass, Map, BookOpen, LogIn, User, Loader2 } from "lucide-react";
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, db, collection, query, where, onSnapshot, setDoc, doc, deleteDoc, getDoc, User as FirebaseUser } from "./firebase";
import { Trip, JournalEntry, UserProfile } from "./types";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import TripCard from "./components/TripCard";
import JournalEntryCard from "./components/JournalEntry";
import TripForm from "./components/TripForm";
import JournalForm from "./components/JournalForm";
import TripDetails from "./components/TripDetails";
import ChatAssistant from "./components/ChatAssistant";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import HowItWorks from "./components/HowItWorks";
import InstallAppPrompt from "./components/InstallAppPrompt";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState("explore");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isTripFormOpen, setIsTripFormOpen] = useState(false);
  const [isJournalFormOpen, setIsJournalFormOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      if (error instanceof Error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.warn(`Storage quota exceeded for ${key}. Attempting to save without large images...`);
        
        // Strategy: Strip images from older items to save space
        if (key === 'js_trips') {
          const optimizedData = data.map((trip: Trip, index: number) => {
            // Keep image for the most recent trip, strip for others if they are base64
            if (index > 0 && trip.imageUrl?.startsWith('data:image')) {
              return { ...trip, imageUrl: undefined };
            }
            return trip;
          });
          
          try {
            localStorage.setItem(key, JSON.stringify(optimizedData));
            setTrips(optimizedData);
            alert("Storage limit reached. Older trip images have been removed to save space. Sign in to save unlimited trips with high-quality images!");
          } catch (retryError) {
            alert("Local storage is completely full. Please sign in or delete some trips to continue.");
          }
        } else {
          alert("Storage limit reached. Please sign in or delete some items to continue.");
        }
      } else {
        console.error("Error saving to localStorage:", error);
      }
    }
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch or create user profile
        const userDoc = doc(db, 'users', firebaseUser.uid);
        try {
          const userSnap = await getDoc(userDoc);
          if (userSnap.exists()) {
            setUserProfile(userSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "Explorer",
              photoURL: firebaseUser.photoURL || undefined,
              isPremium: false,
              createdAt: Date.now(),
            };
            await setDoc(userDoc, newProfile);
            setUserProfile(newProfile);
          }
        } catch (e) {
          console.error("Error fetching user profile:", e);
        }
      } else {
        setUserProfile(null);
        // Load from local storage for Free Mode
        const localTrips = JSON.parse(localStorage.getItem('js_trips') || '[]');
        
        // Add sample trip if empty to showcase new features
        if (localTrips.length === 0) {
          const sampleTrip: Trip = {
            id: "sample-kashmir",
            title: "Kashmir Paradise Expedition",
            destination: "Kashmir, India",
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            description: "A 5-day luxury journey exploring the crown jewel of India, featuring Dal Lake, Gulmarg, and Pahalgam.",
            imageUrl: "https://images.unsplash.com/photo-1598305371124-42ad188d5817?auto=format&fit=crop&q=80&w=800",
            budgetLevel: "Luxury",
            totalEstimatedPrice: 85000,
            budgetBreakdown: {
              activities: 45000,
              transport: 15000,
              food: 15000,
              shopping: 10000
            },
            bookingUrl: "https://www.irctc.co.in/",
            stressScore: 12,
            efficiencyReport: "The Efficiency Architect confirms: This itinerary is highly optimized with minimal dead time and robust transit logic.",
            weatherForecast: {
              temp: "18°C",
              condition: "Partly Cloudy",
              description: "Expect pleasant days with a light breeze. Perfect for shikara rides and meadow walks."
            },
            createdAt: Date.now(),
            uniqueInsights: {
              photographySpots: [
                "Shikara at Sunset on Dal Lake",
                "Phase 2 Gondola Summit in Gulmarg",
                "Aru Valley Meadows in Pahalgam"
              ],
              culturalEtiquette: [
                "Dress modestly when visiting local shrines",
                "Always ask permission before photographing locals",
                "Remove shoes before entering houseboats"
              ],
              localSecrets: [
                "Visit the floating vegetable market at 5 AM",
                "Try the authentic Wazwan at a local's home",
                "The hidden Betaab Valley stream for a quiet picnic"
              ]
            },
            itinerary: [
              {
                day: 1,
                activities: [
                  { 
                    name: "Shikara Ride on Dal Lake", 
                    time: "04:00 PM - 06:00 PM", 
                    price: 2500, 
                    locationUrl: "Dal Lake, Srinagar",
                    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400",
                    ticketUrl: "https://www.jktdc.co.in/",
                    riskLevel: 0.1,
                    transitNote: "Short walk from most lakeside houseboats. Grab a 'Kahwa' tea on the way."
                  },
                  { 
                    name: "Mughal Gardens Tour", 
                    time: "10:00 AM - 01:00 PM", 
                    price: 1200, 
                    locationUrl: "Shalimar Bagh, Srinagar",
                    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400",
                    ticketUrl: "https://www.jktdc.co.in/",
                    riskLevel: 0.2,
                    transitNote: "Efficient taxi route via Boulevard Road. Stop at a local bakery for fresh 'Girda'."
                  }
                ],
                notes: "Enjoy the sunset from your houseboat."
              },
              {
                day: 2,
                activities: [
                  { 
                    name: "Gulmarg Gondola Ride", 
                    time: "09:00 AM - 02:00 PM", 
                    price: 4500, 
                    locationUrl: "Gulmarg Gondola",
                    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400",
                    ticketUrl: "https://www.gulmarggondola.com/"
                  },
                  { 
                    name: "Skiing Lesson", 
                    time: "03:00 PM - 05:00 PM", 
                    price: 6000, 
                    locationUrl: "Gulmarg Ski Resort",
                    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400"
                  }
                ],
                notes: "The world's second highest cable car."
              }
            ]
          };
          localTrips.push(sampleTrip);
          saveToLocalStorage('js_trips', localTrips);
        }

        const localJournals = JSON.parse(localStorage.getItem('js_journals') || '[]');
        setTrips(localTrips);
        setJournals(localJournals);
      }
      setIsAuthReady(true);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Data Listeners
  useEffect(() => {
    if (!user) return;

    const tripsQuery = query(collection(db, 'trips'), where('userId', '==', user.uid));
    const journalsQuery = query(collection(db, 'journals'), where('userId', '==', user.uid));

    const unsubTrips = onSnapshot(tripsQuery, (snapshot) => {
      const tripsData = snapshot.docs.map(doc => doc.data() as Trip);
      setTrips(tripsData.sort((a, b) => b.createdAt - a.createdAt));
    });

    const unsubJournals = onSnapshot(journalsQuery, (snapshot) => {
      const journalsData = snapshot.docs.map(doc => doc.data() as JournalEntry);
      setJournals(journalsData.sort((a, b) => b.createdAt - a.createdAt));
    });

    return () => {
      unsubTrips();
      unsubJournals();
    };
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setActiveTab("explore");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const saveTrip = async (trip: Trip) => {
    if (user) {
      const tripWithUser = { ...trip, userId: user.uid };
      await setDoc(doc(db, 'trips', trip.id), tripWithUser);
    } else {
      const existingIndex = trips.findIndex(t => t.id === trip.id);
      let newTrips;
      if (existingIndex >= 0) {
        newTrips = [...trips];
        newTrips[existingIndex] = trip;
      } else {
        newTrips = [trip, ...trips];
      }
      setTrips(newTrips);
      saveToLocalStorage('js_trips', newTrips);
    }
  };

  const deleteTrip = async (tripId: string) => {
    if (user) {
      await deleteDoc(doc(db, 'trips', tripId));
    } else {
      const newTrips = trips.filter(t => t.id !== tripId);
      setTrips(newTrips);
      saveToLocalStorage('js_trips', newTrips);
    }
  };

  const saveJournal = async (entry: JournalEntry) => {
    if (user) {
      const entryWithUser = { ...entry, userId: user.uid };
      await setDoc(doc(db, 'journals', entry.id), entryWithUser);
    } else {
      const newJournals = [entry, ...journals];
      setJournals(newJournals);
      saveToLocalStorage('js_journals', newJournals);
    }
  };

  const deleteJournal = async (entryId: string) => {
    if (user) {
      await deleteDoc(doc(db, 'journals', entryId));
    } else {
      const newJournals = journals.filter(j => j.id !== entryId);
      setJournals(newJournals);
      saveToLocalStorage('js_journals', newJournals);
    }
  };

  if (!isAuthReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-12 h-12 text-brand-primary animate-spin" />
            <p className="text-brand-primary font-serif text-xl animate-pulse">Journey Scribe</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Navigation
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedTrip(null);
        }}
      />

      {!navigator.onLine && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 bg-brand-primary/20 backdrop-blur-md border border-brand-primary/30 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Offline Mode</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <AnimatePresence mode="wait">
          {activeTab === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onStartPlanning={() => setIsTripFormOpen(true)} />
              
              <HowItWorks />

              <Features />
              
              <Testimonials />
              
              <Pricing />

              <section className="py-24 space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl md:text-5xl font-serif">Trending Destinations</h2>
                  <p className="text-brand-cream/60 max-w-xl mx-auto font-light">
                    Explore the most captivating corners of the world, curated by our AI explorer.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: "Kyoto Serenity", destination: "Kyoto, Japan", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800" },
                    { title: "Amalfi Coastline", destination: "Positano, Italy", img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800" },
                    { title: "Kashmir Paradise", destination: "Kashmir, India", img: "https://images.unsplash.com/photo-1598305371124-42ad188d5817?auto=format&fit=crop&q=80&w=1200" },
                  ].map((dest, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className={`glass-card overflow-hidden h-96 relative group cursor-pointer ${dest.title === "Kashmir Paradise" ? "md:col-span-2" : ""}`}
                    >
                      <img 
                        src={dest.img} 
                        alt={dest.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
                      <div className="absolute bottom-8 left-8 space-y-2">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">{dest.destination}</p>
                        <h3 className="text-4xl font-serif text-gradient">{dest.title}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "trips" && (
            <motion.div
              key="trips"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 space-y-12"
            >
              {selectedTrip ? (
                <TripDetails
                  trip={selectedTrip}
                  onBack={() => setSelectedTrip(null)}
                  onAddJournal={() => setIsJournalFormOpen(true)}
                  onUpdateTrip={(updatedTrip) => {
                    saveTrip(updatedTrip);
                    setSelectedTrip(updatedTrip);
                  }}
                />
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                      <h1 className="text-5xl font-serif text-gradient">My Journeys</h1>
                      <p className="text-brand-cream/60 font-light">Your collection of past and future adventures.</p>
                    </div>
                    <button
                      onClick={() => setIsTripFormOpen(true)}
                      className="premium-button premium-button-primary flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Plan New Trip
                    </button>
                  </div>

                  {trips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {trips.map((trip) => (
                        <TripCard
                          key={trip.id}
                          trip={trip}
                          onClick={() => setSelectedTrip(trip)}
                          onDelete={() => deleteTrip(trip.id)}
                          onEdit={() => {
                            setEditingTrip(trip);
                            setIsTripFormOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card p-24 text-center space-y-6">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <Map className="w-10 h-10 text-brand-primary/40" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-serif">No trips planned yet</h3>
                        <p className="text-brand-cream/40 font-light">Start your first adventure with AI-powered planning.</p>
                      </div>
                      <button
                        onClick={() => setIsTripFormOpen(true)}
                        className="premium-button premium-button-secondary"
                      >
                        Create Your First Trip
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {activeTab === "journal" && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-5xl font-serif text-gradient">The Scribe</h1>
                  <p className="text-brand-cream/60 font-light">Your personal travel diary, preserved forever.</p>
                </div>
                {trips.length > 0 && (
                  <button
                    onClick={() => setIsJournalFormOpen(true)}
                    className="premium-button premium-button-primary flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    New Entry
                  </button>
                )}
              </div>

              {journals.length > 0 ? (
                <div className="grid grid-cols-1 gap-12">
                  {journals.map((entry) => (
                    <JournalEntryCard
                      key={entry.id}
                      entry={entry}
                      onDelete={() => deleteJournal(entry.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-24 text-center space-y-6">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-10 h-10 text-brand-primary/40" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif">Your scribe is empty</h3>
                    <p className="text-brand-cream/40 font-light">Capture your thoughts and memories from your trips.</p>
                  </div>
                  {trips.length > 0 ? (
                    <button
                      onClick={() => setIsJournalFormOpen(true)}
                      className="premium-button premium-button-secondary"
                    >
                      Write Your First Entry
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab("trips")}
                      className="premium-button premium-button-secondary"
                    >
                      Plan a Trip First
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isTripFormOpen && (
          <TripForm
            initialData={editingTrip || undefined}
            onClose={() => {
              setIsTripFormOpen(false);
              setEditingTrip(null);
            }}
            onSave={saveTrip}
          />
        )}
        {isJournalFormOpen && selectedTrip && (
          <JournalForm
            trip={selectedTrip}
            onClose={() => setIsJournalFormOpen(false)}
            onSave={saveJournal}
          />
        )}
        {isJournalFormOpen && !selectedTrip && trips.length > 0 && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-xl">
            <div className="glass-card w-full max-w-md p-8 space-y-6">
              <h2 className="text-2xl font-serif">Select a Trip</h2>
              <div className="space-y-2">
                {trips.map(trip => (
                  <button
                    key={trip.id}
                    onClick={() => {
                      setSelectedTrip(trip);
                      setIsJournalFormOpen(true);
                    }}
                    className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-colors"
                  >
                    <p className="font-medium">{trip.title}</p>
                    <p className="text-xs text-brand-cream/40">{trip.destination}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setIsJournalFormOpen(false)} className="w-full premium-button premium-button-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      <ChatAssistant />
      <InstallAppPrompt />

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/10 text-center space-y-12">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Compass className="w-8 h-8 text-brand-primary" />
            <span className="text-2xl font-serif font-bold text-gradient">Journey Scribe</span>
          </div>
          <p className="text-brand-cream/40 max-w-md mx-auto text-sm font-light">
            The world's most sophisticated AI travel companion. Plan, track, and preserve your adventures with ease.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-brand-cream/60 hover:text-brand-primary transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-brand-cream/60 hover:text-brand-primary transition-colors">Terms of Service</a>
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-brand-cream/60 hover:text-brand-primary transition-colors">Cookie Policy</a>
          <a href="#" className="text-xs font-bold uppercase tracking-widest text-brand-cream/60 hover:text-brand-primary transition-colors">Contact Us</a>
        </div>

        <div className="space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-cream/20">Get the mobile app</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://play.google.com/store/apps/details?id=com.journeyscribe" className="opacity-40 hover:opacity-100 transition-opacity">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10" />
            </a>
            <a href="https://apps.apple.com/app/journey-scribe/id123456789" className="opacity-40 hover:opacity-100 transition-opacity">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-10" />
            </a>
          </div>
        </div>

        <p className="text-[10px] text-brand-cream/20 font-medium uppercase tracking-[0.2em]">
          © 2026 Journey Scribe. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
