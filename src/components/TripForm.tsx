import { useState } from "react";
import { motion } from "motion/react";
import { X, Sparkles, Loader2, Calendar as CalendarIcon, Check } from "lucide-react";
import { generateItinerary, generateTravelImage } from "../services/gemini";
import { Trip } from "../types";
import { cn } from "../lib/utils";
import { runTripSimulation } from "../lib/simulation";

interface TripFormProps {
  onClose: () => void;
  onSave: (trip: Trip) => void;
  initialData?: Trip;
}

const INTEREST_OPTIONS = [
  "Food", "History", "Nature", "Art", "Adventure", "Shopping", "Nightlife", "Relaxation", "Culture", "Photography"
];

export default function TripForm({ onClose, onSave, initialData }: TripFormProps) {
  const [destination, setDestination] = useState(initialData?.destination || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [days, setDays] = useState(initialData?.itinerary?.length || 3);
  const [startDate, setStartDate] = useState(
    initialData?.startDate 
      ? new Date(initialData.startDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() => {
    if (!initialData?.description) return [];
    // Try to extract interests from description: "A 5-day journey exploring ... with a focus on Food, Art."
    const match = initialData.description.match(/focus on (.*)\./);
    if (match && match[1]) {
      return match[1].split(", ").filter(i => INTEREST_OPTIONS.includes(i));
    }
    return [];
  });
  const [budgetLevel, setBudgetLevel] = useState<'Economy' | 'Standard' | 'Luxury'>(initialData?.budgetLevel as any || 'Standard');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setStatus("Initializing Professional AI Consultant...");

    try {
      let imageUrl = initialData?.imageUrl || "";
      if (!initialData || destination !== initialData.destination) {
        setStatus("Generating authentic imagery...");
        imageUrl = await generateTravelImage(destination);
      }
      
      setStatus("Crafting your professional itinerary...");
      const tripData = await generateItinerary(destination, days, selectedInterests, budgetLevel);
      
      if (!tripData || !tripData.itinerary) {
        throw new Error("AI failed to generate a valid itinerary.");
      }

      const { itinerary, totalEstimatedPrice, budgetBreakdown, bookingUrl, uniqueInsights, weatherForecast, aiAnalysis } = tripData;

      const start = new Date(startDate);
      const end = new Date(startDate);
      end.setDate(start.getDate() + days);

      const tempTrip: Partial<Trip> = {
        destination,
        itinerary,
      };

      setStatus("Optimizing travel routes...");
      const { stressScore } = runTripSimulation(tempTrip as Trip);

      const newTrip: Trip = {
        id: initialData?.id || Math.random().toString(36).substring(7),
        title: title || `Adventure in ${destination}`,
        destination,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        description: `A ${days}-day ${budgetLevel.toLowerCase()} journey exploring ${destination} with a focus on ${selectedInterests.join(", ")}.`,
        imageUrl,
        itinerary,
        budgetLevel,
        totalEstimatedPrice,
        budgetBreakdown,
        bookingUrl,
        uniqueInsights,
        weatherForecast,
        stressScore,
        aiAnalysis: aiAnalysis || "Our professional AI analysis confirms this itinerary is optimized for a seamless travel experience.",
        createdAt: initialData?.createdAt || Date.now(),
      };

      onSave(newTrip);
      onClose();
    } catch (error: any) {
      console.error("Error creating/updating trip:", error);
      alert(error.message || "Failed to save trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-2xl my-8"
      >
        <div className="p-6 border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <h2 className="text-2xl font-serif text-brand-text">Plan Your Next Journey</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-surface/50 rounded-full transition-colors text-brand-muted">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">Destination</label>
              <input
                required
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kyoto, Japan"
                className="w-full bg-brand-surface/50 border border-brand-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors text-brand-text placeholder:text-brand-muted/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">Start Date</label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-brand-surface/50 border border-brand-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors appearance-none text-brand-text"
                />
                <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">Duration (Days)</label>
              <input
                required
                type="number"
                min="1"
                max="14"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full bg-brand-surface/50 border border-brand-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors text-brand-text"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">Trip Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Zen Retreat"
                className="w-full bg-brand-surface/50 border border-brand-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors text-brand-text placeholder:text-brand-muted/50"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    "px-3 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5",
                    selectedInterests.includes(interest)
                      ? "bg-brand-primary/20 border-brand-primary text-brand-primary"
                      : "bg-brand-surface/50 border-brand-border text-brand-muted hover:bg-brand-surface/80"
                  )}
                >
                  {selectedInterests.includes(interest) && <Check className="w-3 h-3" />}
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-muted">Budget Level</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['Economy', 'Standard', 'Luxury'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setBudgetLevel(level)}
                  className={cn(
                    "px-4 py-3 rounded-xl border text-sm font-medium transition-all text-center",
                    budgetLevel === level 
                      ? "bg-brand-primary/20 border-brand-primary text-brand-primary" 
                      : "bg-brand-surface/50 border-brand-border text-brand-muted hover:bg-brand-surface/80"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              disabled={isLoading || selectedInterests.length === 0}
              type="submit"
              className="premium-button premium-button-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {status}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Professional Itinerary
                </>
              )}
            </button>
            {selectedInterests.length === 0 && !isLoading && (
              <p className="text-[10px] text-center mt-2 text-brand-muted">Select at least one interest to continue</p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
