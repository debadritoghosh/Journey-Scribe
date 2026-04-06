import { motion, AnimatePresence } from "motion/react";
import { Compass, LogIn, User, Map, BookOpen, Menu, X, Sun, Moon, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

interface NavigationProps {
  user: any;
  onSignIn: () => void;
  onSignOut: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Navigation({ user, onSignIn, onSignOut, activeTab, setActiveTab, theme, toggleTheme }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'trips', label: 'My Trips', icon: Map },
    { id: 'journal', label: 'The Scribe', icon: BookOpen },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-xl border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setActiveTab('explore')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-serif font-bold text-gradient">Journey Scribe</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-all relative py-2",
                  activeTab === item.id ? "text-brand-primary" : "text-brand-muted hover:text-brand-text"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-brand-surface/50 rounded-xl transition-colors text-brand-muted hover:text-brand-text"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-3 py-1.5 bg-brand-surface/50 border border-brand-border rounded-full">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ""} className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 bg-brand-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-brand-primary">{user.displayName?.[0]}</span>
                    </div>
                  )}
                  <span className="text-xs font-medium text-brand-text">{user.displayName?.split(' ')[0] || user.email?.split('@')[0]}</span>
                </div>
                <button 
                  onClick={onSignOut}
                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all text-brand-muted"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="premium-button premium-button-primary !py-2 !px-6 text-sm flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-brand-surface/50 rounded-xl transition-colors text-brand-muted hover:text-brand-text"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-brand-muted hover:text-brand-text"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-dark border-b border-brand-border overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full p-4 rounded-2xl transition-all",
                    activeTab === item.id ? "bg-brand-primary/10 text-brand-primary" : "text-brand-muted hover:bg-brand-surface/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              <div className="pt-4 border-t border-brand-border">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 bg-brand-primary/20 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-brand-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-brand-text">{user.displayName || user.email}</p>
                        <p className="text-xs text-brand-muted">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={onSignOut}
                      className="flex items-center gap-3 w-full p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onSignIn}
                    className="w-full premium-button premium-button-primary flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In with Google
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
