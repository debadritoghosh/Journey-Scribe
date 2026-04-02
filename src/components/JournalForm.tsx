import { useState } from "react";
import { motion } from "motion/react";
import { X, Sparkles, Loader2, Save } from "lucide-react";
import { generateTravelImage, generateJournalPrompt } from "../services/gemini";
import { Trip, JournalEntry } from "../types";

interface JournalFormProps {
  trip: Trip;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
}

export default function JournalForm({ trip, onClose, onSave }: JournalFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [prompt, setPrompt] = useState("");

  const handleGeneratePrompt = async () => {
    setIsLoading(true);
    setStatus("Generating reflective prompt...");
    try {
      const newPrompt = await generateJournalPrompt(trip);
      setPrompt(newPrompt);
    } catch (error) {
      console.error("Error generating prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsLoading(true);
    setStatus("Generating cinematic memory...");
    try {
      const imageUrl = await generateTravelImage(`${trip.destination} ${title}`);
      return imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("Saving your memory...");

    try {
      const imageUrl = await handleGenerateImage();

      const newEntry: JournalEntry = {
        id: Math.random().toString(36).substring(7),
        tripId: trip.id,
        date: new Date().toISOString(),
        title: title || `A day in ${trip.destination}`,
        content: content,
        imageUrl: imageUrl || undefined,
        userId: trip.userId || "guest",
        createdAt: Date.now(),
      };

      onSave(newEntry);
      onClose();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      alert("Failed to save entry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-3xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <h2 className="text-2xl font-serif">Scribe Your Journey</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-cream/40">Entry Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunset at the Temple"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
            <button
              onClick={handleGeneratePrompt}
              disabled={isLoading}
              className="mt-6 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-brand-primary hover:bg-brand-primary/10 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Prompt
            </button>
          </div>

          {prompt && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-sm italic text-brand-primary"
            >
              "{prompt}"
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-cream/40">Your Story</label>
            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts, feelings, and discoveries..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors resize-none"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="premium-button premium-button-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {status}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Entry
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
