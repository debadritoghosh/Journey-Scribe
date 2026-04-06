import { motion } from "motion/react";
import { Check, Zap, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

const plans = [
  {
    name: "Explorer",
    price: "Free",
    description: "Perfect for casual travelers and weekend getaways.",
    features: [
      "AI-Generated Itineraries",
      "Basic Trip Journaling",
      "Local Storage Sync",
      "Standard Budgeting"
    ],
    buttonText: "Start for Free",
    premium: false
  },
  {
    name: "Vagabond Pro",
    price: "₹499",
    period: "/month",
    description: "For the serious traveler who wants it all.",
    features: [
      "Everything in Explorer",
      "Unlimited Cloud Sync",
      "Professional AI Analysis",
      "Dynamic Plan Adaptation",
      "Premium Photography Spots",
      "Priority AI Support"
    ],
    buttonText: "Go Pro",
    premium: true
  },
  {
    name: "Elite",
    price: "₹1,299",
    period: "/month",
    description: "The ultimate travel experience with concierge AI.",
    features: [
      "Everything in Pro",
      "Real-time Flight Tracking",
      "Automatic Hotel Price Alerts",
      "VIP Local Secret Access",
      "Dedicated Travel Concierge"
    ],
    buttonText: "Contact Sales",
    premium: false
  }
];

export default function Pricing() {
  return (
    <section className="py-24 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif text-brand-text">Simple, Transparent Pricing</h2>
        <p className="text-brand-muted max-w-xl mx-auto font-light">
          Choose the plan that fits your travel style. No hidden fees, just pure discovery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "glass-card p-8 space-y-8 relative overflow-hidden flex flex-col",
              plan.premium && "border-brand-primary/50 bg-brand-primary/5 scale-105 z-10"
            )}
          >
            {plan.premium && (
              <div className="absolute top-0 right-0 bg-brand-primary text-brand-dark text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-bl-xl">
                Most Popular
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-brand-text">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-brand-text">{plan.price}</span>
                {plan.period && <span className="text-sm text-brand-muted">{plan.period}</span>}
              </div>
              <p className="text-sm text-brand-muted font-light leading-relaxed">
                {plan.description}
              </p>
            </div>

            <ul className="space-y-4 flex-grow">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-brand-muted">
                  <Check className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className={cn(
              "w-full py-4 rounded-xl font-bold text-sm transition-all",
              plan.premium 
                ? "bg-brand-primary text-brand-dark hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20" 
                : "bg-brand-surface text-brand-text hover:bg-brand-surface/80 border border-brand-border"
            )}>
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
