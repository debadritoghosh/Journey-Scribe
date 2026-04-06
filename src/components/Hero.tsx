import { motion } from "motion/react";
import { ArrowRight, Sparkles, MapPin, Smartphone, Apple } from "lucide-react";

interface HeroProps {
  onStartPlanning: () => void;
}

export default function Hero({ onStartPlanning }: HeroProps) {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background with cinematic blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-dark/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000"
          alt="Travel background"
          className="w-full h-full object-cover scale-110 blur-[2px]"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 backdrop-blur-md text-brand-primary text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Professional AI Travel Consultant
          </div>

          <h1 className="text-5xl md:text-8xl font-serif font-light leading-[1.1] tracking-tight text-brand-text">
            Your Journey, <br />
            <span className="italic font-normal text-gradient">Perfectly Crafted.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-brand-muted font-light leading-relaxed">
            Experience the future of travel with our professional AI consultant. We design high-value, efficient itineraries tailored to your unique interests.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartPlanning}
              className="premium-button premium-button-primary flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Start Planning
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="premium-button premium-button-secondary flex items-center gap-2 w-full sm:w-auto justify-center">
              <MapPin className="w-4 h-4" />
              Explore Destinations
            </button>
          </div>

          {/* App Download Section */}
          <div className="pt-12 space-y-6">
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-cream/40">The Complete AI Experience</p>
              <div className="h-px w-12 bg-brand-primary/30" />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={() => {
                  const event = new Event('beforeinstallprompt');
                  window.dispatchEvent(event);
                }}
                className="flex items-center gap-3 px-6 py-3 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 rounded-2xl transition-all group scale-105"
              >
                <Smartphone className="w-6 h-6 text-brand-primary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-[8px] uppercase tracking-widest text-brand-cream/40 leading-none">Install Free</p>
                  <p className="text-sm font-bold text-brand-cream">Mobile Web App</p>
                </div>
              </button>

              <div className="flex gap-4 opacity-40 hover:opacity-100 transition-opacity">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.journeyscribe" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                >
                  <Smartphone className="w-5 h-5 text-brand-cream group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="text-[8px] uppercase tracking-widest text-brand-cream/40 leading-none">Get it on</p>
                    <p className="text-sm font-bold text-brand-cream">Google Play</p>
                  </div>
                </a>
                <a 
                  href="https://apps.apple.com/app/journey-scribe/id123456789" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                >
                  <Apple className="w-5 h-5 text-brand-cream group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="text-[8px] uppercase tracking-widest text-brand-cream/40 leading-none">Download on the</p>
                    <p className="text-sm font-bold text-brand-cream">App Store</p>
                  </div>
                </a>
              </div>
            </div>
            <p className="text-[10px] text-brand-cream/30 font-light italic">No app store fees. No storage limits. Just pure AI travel planning.</p>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent z-10" />
    </div>
  );
}
