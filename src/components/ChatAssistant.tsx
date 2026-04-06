import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, X, Sparkles, Loader2, User } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { cn } from "../lib/utils";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your AI Travel Assistant. Where would you like to go today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const chat = ai.chats.create({
        model: "gemini-3.1-flash-lite-preview",
        config: {
          systemInstruction: "You are a helpful and inspiring travel assistant for Journey Scribe. Help users plan trips, suggest destinations, and answer travel-related questions. Keep your responses concise and engaging.",
        },
      });

      const streamResponse = await chat.sendMessageStream({ message: userMessage });
      
      // Add an empty model message that we'll update with the stream
      setMessages(prev => [...prev, { role: 'model', text: "" }]);
      
      let fullText = "";
      for await (const chunk of streamResponse) {
        const chunkText = chunk.text || "";
        fullText += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', text: fullText };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-brand-primary text-brand-dark rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-8 z-50 w-full max-w-[380px] h-[500px] glass-card flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-surface/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-primary" />
                <span className="font-serif font-medium text-brand-text">Professional AI Consultant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-brand-surface/80 rounded-full transition-colors text-brand-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    msg.role === 'user' ? "bg-brand-primary/20" : "bg-brand-surface border border-brand-border"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-brand-primary" /> : <Sparkles className="w-4 h-4 text-brand-primary" />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' ? "bg-brand-primary text-brand-dark rounded-tr-none" : "bg-brand-surface text-brand-text rounded-tl-none border border-brand-border"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-brand-primary animate-spin" />
                  </div>
                  <div className="bg-brand-surface p-3 rounded-2xl rounded-tl-none border border-brand-border">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-brand-primary/40 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-brand-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-brand-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-brand-border bg-brand-surface/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full bg-brand-surface border border-brand-border rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-brand-primary transition-colors text-brand-text placeholder:text-brand-muted/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 top-1.5 p-1.5 bg-brand-primary text-brand-dark rounded-full disabled:opacity-50 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
