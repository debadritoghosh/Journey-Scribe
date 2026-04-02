import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone, X, Download } from "lucide-react";

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the prompt
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[100]"
        >
          <div className="glass-card p-6 flex items-center gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-brand-primary/10 transition-colors" />
            
            <div className="w-12 h-12 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary relative">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="flex-grow space-y-1 relative">
              <h4 className="font-serif text-brand-cream">Install Journey Scribe</h4>
              <p className="text-xs text-brand-cream/60 font-light">Add to your home screen for a full app experience.</p>
            </div>

            <div className="flex flex-col gap-2 relative">
              <button
                onClick={handleInstall}
                className="p-2 bg-brand-primary text-brand-dark rounded-lg hover:bg-brand-primary/90 transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 bg-white/5 text-brand-cream/40 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
