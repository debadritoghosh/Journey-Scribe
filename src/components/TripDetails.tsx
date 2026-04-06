import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, ArrowLeft, Sparkles, Plus, Clock, ExternalLink, Train, Ticket, Camera, Info, ShieldCheck, Cloud, Thermometer, AlertTriangle, Zap, PieChart, RefreshCw, AlertCircle } from "lucide-react";
import { Trip } from "../types";
import { format, isAfter, isBefore, differenceInDays } from "date-fns";
import { cn } from "../lib/utils";
import { useState } from "react";
import { adaptItinerary } from "../services/gemini";

interface TripDetailsProps {
  trip: Trip;
  onBack: () => void;
  onAddJournal: () => void;
  onUpdateTrip: (trip: Trip) => void;
}

export default function TripDetails({ trip, onBack, onAddJournal, onUpdateTrip }: TripDetailsProps) {
  const [isAdapting, setIsAdapting] = useState(false);
  const [delayText, setDelayText] = useState("");
  const [showDelayInput, setShowDelayInput] = useState(false);

  const calculateProgress = () => {
    const now = new Date();
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    if (isBefore(now, start)) return 0;
    if (isAfter(now, end)) return 100;

    const totalDays = differenceInDays(end, start) || 1;
    const daysPassed = differenceInDays(now, start);
    return Math.min(Math.round((daysPassed / totalDays) * 100), 100);
  };

  const progress = calculateProgress();

  const handleAdaptPlan = async () => {
    if (!delayText.trim()) return;

    setIsAdapting(true);
    try {
      const adaptedData = await adaptItinerary(trip, delayText);
      const updatedTrip: Trip = {
        ...trip,
        ...adaptedData,
        description: `${trip.description}\n\n[Plan adapted due to: ${delayText}]`
      };
      onUpdateTrip(updatedTrip);
      setShowDelayInput(false);
      setDelayText("");
    } catch (error) {
      console.error("Failed to adapt plan:", error);
      alert("Failed to adapt plan. Please try again.");
    } finally {
      setIsAdapting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12 pb-24"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-brand-primary uppercase tracking-widest hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Trips
        </button>

        {/* Progress Tracker */}
        <div className="hidden md:flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-cream/40">Trip Progress</span>
            <span className="text-xs font-bold text-brand-primary">{progress}% Complete</span>
          </div>
          <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-brand-primary"
            />
          </div>
        </div>
      </div>

      <div className="relative h-[40vh] md:h-[50vh] rounded-3xl overflow-hidden bg-brand-dark/40">
        <img
          src={trip.imageUrl || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1920`}
          alt={trip.destination}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1920`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary/20 backdrop-blur-md rounded-full border border-brand-primary/30 w-fit">
              <MapPin className="w-4 h-4 text-brand-primary" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-primary">{trip.destination}</span>
            </div>
            <h1 className="text-3xl md:text-6xl font-serif font-light text-gradient leading-tight">
              {trip.title}
            </h1>
            <div className="flex items-center gap-4 text-brand-cream/60 font-medium text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(trip.startDate), "MMMM d")} - {format(new Date(trip.endDate), "MMMM d, yyyy")}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => setShowDelayInput(!showDelayInput)}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              Report Delay
            </button>
            <button
              onClick={onAddJournal}
              className="premium-button premium-button-primary flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <Plus className="w-5 h-5" />
              Add Journal Entry
            </button>
          </div>
        </div>
      </div>

      {/* Delay Adaptation Input */}
      <AnimatePresence>
        {showDelayInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 border-red-500/20 bg-red-500/5 space-y-4">
              <div className="flex items-center gap-2 text-red-400">
                <RefreshCw className={cn("w-5 h-5", isAdapting && "animate-spin")} />
                <h3 className="text-lg font-serif">Plan Adaptation</h3>
              </div>
              <p className="text-sm text-brand-muted">Describe the delay (e.g., "Flight delayed by 4 hours", "Missed the morning train"). Our AI will refine your remaining itinerary.</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={delayText}
                  onChange={(e) => setDelayText(e.target.value)}
                  placeholder="Describe your delay..."
                  className="flex-grow bg-brand-dark/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-brand-primary outline-none"
                />
                <button
                  onClick={handleAdaptPlan}
                  disabled={isAdapting || !delayText.trim()}
                  className="px-6 py-2 bg-brand-primary text-brand-dark rounded-xl font-bold text-sm disabled:opacity-50 transition-all"
                >
                  {isAdapting ? "Adapting..." : "Refine Plan"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* AI Analysis & Stress Score */}
          {(trip.stressScore !== undefined || trip.aiAnalysis) && (
            <section className="glass-card p-6 md:p-8 border-l-4 border-brand-primary space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-primary">
                  <Zap className="w-6 h-6" />
                  <h2 className="text-2xl font-serif">Professional AI Analysis</h2>
                </div>
                {trip.stressScore !== undefined && (
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Itinerary Stress Score</p>
                    <p className={cn(
                      "text-3xl font-serif",
                      trip.stressScore < 30 ? "text-green-400" : trip.stressScore < 60 ? "text-yellow-400" : "text-red-400"
                    )}>
                      {trip.stressScore}%
                    </p>
                  </div>
                )}
              </div>
              <p className="text-brand-text leading-relaxed italic">
                "{trip.aiAnalysis}"
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted">
                <ShieldCheck className="w-3 h-3" />
                Verified via Professional Travel Simulations
              </div>
            </section>
          )}

          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              <h2 className="text-3xl font-serif">AI-Crafted Itinerary</h2>
            </div>
            <div className="space-y-8">
              {trip.itinerary?.map((item) => (
                <div key={item.day} className="relative pl-8 md:pl-12 pb-8 border-l border-white/10 last:border-0 last:pb-0">
                  <div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-[10px] font-bold text-brand-dark">
                    {item.day}
                  </div>
                  <div className="glass-card p-6 space-y-4">
                    <h3 className="text-xl font-serif text-brand-primary">Day {item.day}</h3>
                    <div className="space-y-6">
                      {item.activities.map((activity, idx) => (
                        <div key={idx} className="space-y-4">
                          <div className="flex flex-col md:flex-row gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                            <div className="relative w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-brand-dark/40 group">
                              <img 
                                src={activity.imageUrl || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400`} 
                                alt={activity.name} 
                                className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400`;
                                }}
                              />
                              <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2 backdrop-blur-[2px]">
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest text-center leading-tight">
                                  {activity.name}
                                </span>
                              </div>
                            </div>
                            <div className="flex-grow space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <h4 className="text-brand-cream font-medium text-lg leading-tight">
                                    {typeof activity === 'string' ? activity : activity.name}
                                  </h4>
                                  <div className="flex flex-wrap gap-4">
                                    {activity.time && (
                                      <div className="flex items-center gap-1.5 text-xs text-brand-cream/40">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{activity.time}</span>
                                      </div>
                                    )}
                                    {activity.price !== undefined && (
                                      <div className="flex items-center gap-1.5 text-xs text-brand-primary font-medium">
                                        <span className="text-brand-cream/40">Est.</span>
                                        <span>₹{activity.price}</span>
                                      </div>
                                    )}
                                    {activity.riskLevel !== undefined && (
                                      <div className={cn(
                                        "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest",
                                        activity.riskLevel > 0.4 ? "text-red-400" : "text-green-400"
                                      )}>
                                        <AlertTriangle className="w-3 h-3" />
                                        <span>{activity.riskLevel > 0.4 ? "High Delay Risk" : "Stable Path"}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {typeof activity !== 'string' && activity.locationUrl && (
                                    <a
                                      href={activity.locationUrl.startsWith('http') ? activity.locationUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.locationUrl)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 bg-white/5 hover:bg-brand-primary/20 rounded-xl transition-colors text-brand-primary"
                                      title="View on Google Maps"
                                    >
                                      <MapPin className="w-4 h-4" />
                                    </a>
                                  )}
                                  {typeof activity !== 'string' && activity.ticketUrl && (
                                    <a
                                      href={activity.ticketUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 bg-brand-primary/10 hover:bg-brand-primary/30 rounded-xl transition-colors text-brand-primary"
                                      title="Book Tickets Online"
                                    >
                                      <Ticket className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {activity.transitNote && (
                            <div className="ml-4 md:ml-40 flex items-center gap-2 text-xs text-brand-muted bg-brand-surface/50 p-3 rounded-xl border border-brand-border">
                              <Zap className="w-3 h-3 text-brand-primary" />
                              <span className="font-medium text-brand-primary uppercase tracking-widest text-[10px]">Transit Note:</span>
                              <span className="italic">{activity.transitNote}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {item.notes && (
                      <div className="pt-4 border-t border-white/5 text-sm italic text-brand-cream/40">
                        {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Budget Breakdown */}
          {trip.budgetBreakdown && (
            <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-2 text-brand-primary">
                <PieChart className="w-5 h-5" />
                <h3 className="text-xl font-serif">Budget Breakdown</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Activities", value: trip.budgetBreakdown.activities, color: "bg-brand-primary" },
                  { label: "Transport", value: trip.budgetBreakdown.transport, color: "bg-blue-400" },
                  { label: "Food", value: trip.budgetBreakdown.food, color: "bg-orange-400" },
                  { label: "Shopping", value: trip.budgetBreakdown.shopping, color: "bg-purple-400" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-cream/60">{item.label}</span>
                      <span className="text-brand-cream font-bold">₹{item.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / (trip.totalEstimatedPrice || 1)) * 100}%` }}
                        className={cn("h-full", item.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm text-brand-cream/40">Total Estimated</span>
                <span className="text-xl font-bold text-brand-primary">₹{trip.totalEstimatedPrice?.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Weather Forecast */}
          {trip.weatherForecast && (
            <div className="glass-card p-8 space-y-6 bg-gradient-to-br from-brand-primary/10 to-transparent border-brand-primary/20">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-cream/40">Expected Weather</p>
                  <h3 className="text-2xl font-serif">{trip.weatherForecast.condition}</h3>
                </div>
                <div className="flex items-center gap-2 text-brand-primary">
                  <Cloud className="w-8 h-8" />
                  <span className="text-3xl font-serif">{trip.weatherForecast.temp}</span>
                </div>
              </div>
              <p className="text-sm text-brand-cream/60 leading-relaxed">
                {trip.weatherForecast.description}
              </p>
            </div>
          )}

          <div className="glass-card p-8 space-y-6">
            <h3 className="text-xl font-serif">Trip Overview</h3>
            <p className="text-brand-cream/60 leading-relaxed font-light">
              {trip.description}
            </p>
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-brand-cream/40">Status</span>
                <span className="text-brand-primary font-medium uppercase tracking-widest text-[10px]">
                  {isBefore(new Date(), new Date(trip.startDate)) ? "Upcoming" : 
                   isAfter(new Date(), new Date(trip.endDate)) ? "Completed" : "In Progress"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-cream/40">Est. Total Price</span>
                <span className="text-brand-primary font-bold">₹{trip.totalEstimatedPrice?.toLocaleString() || 0}</span>
              </div>
            </div>

            {trip.bookingUrl && (
              <a
                href={trip.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full premium-button premium-button-secondary flex items-center justify-center gap-2"
              >
                <Train className="w-5 h-5" />
                Book Transport
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
            )}
          </div>

          {trip.uniqueInsights && (
            <div className="space-y-6">
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2 text-brand-primary">
                  <Camera className="w-5 h-5" />
                  <h4 className="font-serif text-lg">Photography Spots</h4>
                </div>
                <ul className="space-y-2">
                  {trip.uniqueInsights.photographySpots.map((spot, i) => (
                    <li key={i} className="text-sm text-brand-cream/60 flex gap-2">
                      <span className="text-brand-primary">•</span> {spot}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6 space-y-4 border-l-2 border-brand-primary">
                <div className="flex items-center gap-2 text-brand-primary">
                  <ShieldCheck className="w-5 h-5" />
                  <h4 className="font-serif text-lg">Cultural Etiquette</h4>
                </div>
                <ul className="space-y-2">
                  {trip.uniqueInsights.culturalEtiquette.map((tip, i) => (
                    <li key={i} className="text-sm text-brand-cream/60 flex gap-2">
                      <span className="text-brand-primary">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6 space-y-4 bg-brand-primary/5">
                <div className="flex items-center gap-2 text-brand-primary">
                  <Info className="w-5 h-5" />
                  <h4 className="font-serif text-lg">Local Secrets</h4>
                </div>
                <ul className="space-y-2">
                  {trip.uniqueInsights.localSecrets.map((secret, i) => (
                    <li key={i} className="text-sm text-brand-cream/60 flex gap-2">
                      <span className="text-brand-primary">•</span> {secret}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
