import { motion } from "motion/react";
import { Calendar, Trash2, Edit2, Share2 } from "lucide-react";
import { JournalEntry } from "../types";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

interface JournalEntryCardProps {
  entry: JournalEntry;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function JournalEntryCard({ entry, onDelete, onEdit }: JournalEntryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden group"
    >
      <div className="relative h-64 overflow-hidden bg-brand-dark/40">
        <img
          src={entry.imageUrl || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800`}
          alt={entry.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
      </div>

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-primary uppercase tracking-widest">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(entry.date), "MMMM d, yyyy")}</span>
            </div>
            <h3 className="text-3xl font-serif font-light leading-tight text-gradient">
              {entry.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 bg-white/5 hover:bg-white/10 text-brand-cream/60 rounded-full transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button className="p-2 bg-white/5 hover:bg-white/10 text-brand-cream/60 rounded-full transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="prose prose-invert prose-brand max-w-none">
          <div className="text-brand-cream/80 leading-relaxed font-light text-lg">
            <ReactMarkdown>{entry.content}</ReactMarkdown>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-[10px] font-bold text-brand-primary">
              JS
            </div>
            <span className="text-xs font-medium text-brand-cream/40 italic">Captured by Journey Scribe</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
