import { motion } from "motion/react";
import { Compass, LogIn, User, Map, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

interface NavigationProps {
  user: any;
  onSignIn: () => void;
  onSignOut: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ user, onSignIn, onSignOut, activeTab, setActiveTab }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'trips', label: 'My Trips', icon: Map },
    { id: 'journal', label: 'Journal', icon: BookOpen },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-brand-primary" />
            <span className="text-xl font-serif font-bold tracking-tight text-gradient">Journey Scribe</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  activeTab === item.id ? "text-brand-primary" : "text-brand-cream/60 hover:text-brand-cream"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  <User className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs font-medium">{user.displayName || user.email}</span>
                </div>
                <button 
                  onClick={onSignOut}
                  className="text-xs font-medium text-brand-cream/60 hover:text-brand-cream"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-brand-dark rounded-full text-sm font-medium hover:bg-brand-primary/90 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-brand-cream/60 hover:text-brand-cream"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-brand-dark border-b border-white/10 px-4 pt-2 pb-6 space-y-4"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 w-full p-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === item.id ? "bg-brand-primary/10 text-brand-primary" : "text-brand-cream/60 hover:text-brand-cream"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-white/10">
            {user ? (
              <button
                onClick={onSignOut}
                className="flex items-center gap-3 w-full p-2 text-sm font-medium text-brand-cream/60"
              >
                <LogIn className="w-5 h-5" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center gap-3 w-full p-2 bg-brand-primary text-brand-dark rounded-lg text-sm font-medium"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
