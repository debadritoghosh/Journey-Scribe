import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Elena Rodriguez",
    role: "Digital Nomad",
    content: "Journey Scribe transformed how I travel. The AI itinerary was so precise, it felt like I had a local guide in my pocket at all times.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Marcus Chen",
    role: "Adventure Photographer",
    content: "The 'Photography Spots' insights are a game-changer. I found hidden viewpoints in Kyoto that I never would have discovered on my own.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Sarah Jenkins",
    role: "Family Traveler",
    content: "The stress score feature is brilliant. It helped us plan a pace that worked for our kids without missing the must-see attractions.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif">Loved by Explorers</h2>
        <p className="text-brand-cream/60 max-w-xl mx-auto font-light">
          Join thousands of travelers who are redefining their journeys with AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 space-y-6 relative"
          >
            <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-primary/10" />
            
            <div className="flex gap-1 text-brand-primary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>

            <p className="text-brand-cream/80 leading-relaxed italic font-light">
              "{testimonial.content}"
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary/20"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-serif text-brand-cream">{testimonial.name}</h4>
                <p className="text-[10px] uppercase tracking-widest text-brand-cream/40">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
