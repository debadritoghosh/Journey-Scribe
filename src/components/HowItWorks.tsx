import { motion } from "motion/react";
import { Search, Sparkles, Map, BookOpen } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Define Your Vision",
    description: "Tell our AI where you want to go, your budget, and what you love—from hidden cafes to mountain peaks."
  },
  {
    icon: Sparkles,
    title: "AI Generation",
    description: "Our 'Efficiency Architect' simulates thousands of routes to create your perfect, stress-free itinerary."
  },
  {
    icon: Map,
    title: "Explore & Adapt",
    description: "Follow your plan in real-time. If plans change or delays happen, the AI adapts your journey instantly."
  },
  {
    icon: BookOpen,
    title: "Preserve Memories",
    description: "Capture every moment in your cinematic journal, preserved forever with AI-enhanced imagery."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif">The Journey Scribe Experience</h2>
        <p className="text-brand-cream/60 max-w-xl mx-auto font-light">
          Four simple steps to transform your travel from ordinary to extraordinary.
        </p>
      </div>

      <div className="relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent -translate-y-1/2 z-0" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-brand-dark border border-brand-primary/30 flex items-center justify-center text-brand-primary shadow-lg shadow-brand-primary/10 relative">
                <step.icon className="w-7 h-7" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-primary text-brand-dark text-[10px] font-bold flex items-center justify-center">
                  0{i + 1}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif">{step.title}</h3>
                <p className="text-sm text-brand-cream/60 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
