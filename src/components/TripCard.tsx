import { motion } from "motion/react";
import { MapPin, Calendar, ArrowRight, Trash2, Edit2, Share2, Cloud, Zap, IndianRupee, Ticket } from "lucide-react";
import { Trip } from "../types";
import { format } from "date-fns";
import { cn } from "../lib/utils";

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function TripCard({ trip, onClick, onDelete, onEdit }: TripCardProps) {
  const hasTickets = trip.itinerary?.some(day => day.activities.some(act => act.ticketUrl));
  const hasMapLinks = trip.itinerary?.some(day => day.activities.some(act => act.locationUrl));

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `My Journey: ${trip.title}`,
      text: `Check out my ${trip.itinerary?.length}-day trip to ${trip.destination}! Planned with Journey Scribe.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert("Trip details copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden group cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-brand-dark/40 flex-shrink-0">
        <img
          src={trip.imageUrl || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800`}
          alt={trip.destination}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-2 py-1 bg-brand-primary/20 backdrop-blur-md rounded-md border border-brand-primary/30">
              <MapPin className="w-3 h-3 text-brand-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">{trip.destination}</span>
            </div>
            {trip.weatherForecast && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 backdrop-blur-md rounded-md border border-white/10 text-brand-cream/80">
                <Cloud className="w-3 h-3" />
                <span className="text-[10px] font-bold">{trip.weatherForecast.temp}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-white/10 hover:bg-brand-primary/20 text-brand-cream hover:text-brand-primary rounded-full backdrop-blur-md transition-all"
              title="Share Trip"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 bg-brand-primary/20 hover:bg-brand-primary/40 text-brand-primary rounded-full backdrop-blur-md transition-colors"
                title="Edit Trip"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full backdrop-blur-md transition-colors"
                title="Delete Trip"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Icons */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {hasMapLinks && (
            <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-md border border-white/10 text-brand-cream/60" title="Map locations included">
              <MapPin className="w-3 h-3" />
            </div>
          )}
          {hasTickets && (
            <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-md border border-white/10 text-brand-cream/60" title="Tickets available">
              <Ticket className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4 flex flex-col flex-grow">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-serif font-medium leading-tight group-hover:text-brand-primary transition-colors line-clamp-1">
              {trip.title}
            </h3>
            {trip.stressScore !== undefined && (
              <div 
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border transition-all",
                  trip.stressScore < 30 ? "bg-green-500/10 border-green-500/30 text-green-400" :
                  trip.stressScore < 60 ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
                  "bg-red-500/10 border-red-500/30 text-red-400"
                )}
                title={`Stress Score: ${trip.stressScore}%`}
              >
                <Zap className="w-2.5 h-2.5" />
                <span>{trip.stressScore}%</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-cream/50 font-medium">
            <Calendar className="w-3 h-3" />
            <span>{format(new Date(trip.startDate), "MMM d")} - {format(new Date(trip.endDate), "MMM d, yyyy")}</span>
          </div>
        </div>

        <p className="text-sm text-brand-cream/60 line-clamp-2 leading-relaxed flex-grow">
          {trip.description}
        </p>

        <div className="pt-4 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-brand-primary">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="text-sm font-bold">{trip.totalEstimatedPrice?.toLocaleString() || 0}</span>
              <span className="text-[10px] text-brand-cream/40 font-medium uppercase tracking-widest ml-1">({trip.budgetLevel})</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-cream/40">
              {trip.itinerary?.length || 0} Days
            </span>
          </div>
          
          <div className="flex items-center justify-end gap-1 text-xs font-semibold text-brand-primary group-hover:gap-2 transition-all">
            View Details
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
