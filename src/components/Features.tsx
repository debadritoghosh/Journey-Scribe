import { motion } from "motion/react";
import { Sparkles, Zap, ShieldCheck, PieChart, RefreshCw, Smartphone } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Crafted Itineraries",
    description: "Get personalized, minute-by-minute travel plans optimized for your interests and budget level."
  },
  {
    icon: Zap,
    title: "Efficiency Architect",
    description: "Our proprietary AI minimizes dead time and optimizes transit routes with 'snack paths' between spots."
  },
  {
    icon: RefreshCw,
    title: "Dynamic Adaptation",
    description: "Experience a delay? Report it, and our AI instantly refines your remaining plan to keep you on track."
  },
  {
    icon: PieChart,
    title: "Intelligent Budgeting",
    description: "Detailed cost breakdowns including activities, local transport, food, and even shopping budgets."
  },
  {
    icon: ShieldCheck,
    title: "Verified Insights",
    description: "Every itinerary is verified via 1,000 Monte Carlo simulations for maximum reliability and low stress."
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Sync",
    description: "Access your journeys and journals seamlessly across web, Android, and iOS devices."
  }
];

export default function Features() {
  return (
    <section className="py-24 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif">Engineered for Discovery</h2>
        <p className="text-brand-cream/60 max-w-xl mx-auto font-light">
          Journey Scribe combines advanced AI with deep travel insights to create the world's most sophisticated travel companion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 space-y-4 hover:border-brand-primary/30 transition-colors group"
          >
            <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif">{feature.title}</h3>
            <p className="text-sm text-brand-cream/60 leading-relaxed font-light">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
