import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { Sparkles, Loader2, Plane, Hotel, MapPin, DollarSign, PartyPopper, Ghost, Heart } from 'lucide-react';
import { getSurpriseRecommendation } from '../lib/gemini';
import { cn } from '../lib/utils';

interface SurpriseMeProps {
  user: User;
}

export default function SurpriseMe({ user }: SurpriseMeProps) {
  const [mood, setMood] = useState('');
  const [budget, setBudget] = useState(50000);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const moods = [
    { id: 'adventure', icon: Ghost, label: 'Adventure', color: 'text-orange-400' },
    { id: 'peace', icon: Heart, label: 'Peace', color: 'text-blue-400' },
    { id: 'party', icon: PartyPopper, label: 'Party', color: 'text-pink-400' },
  ];

  const handleSurprise = async () => {
    if (!mood) return;
    setLoading(true);
    try {
      const result = await getSurpriseRecommendation(mood, budget);
      setRecommendation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSurprise = async () => {
    if (!recommendation) return;
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          type: 'package',
          details: {
            ...recommendation,
            date: new Date().toISOString().split('T')[0],
            price: budget
          }
        }),
      });
      if (res.ok) {
        alert('Surprise Package Booked! Check your bookings.');
      } else {
        alert('Failed to book surprise package. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6"
        >
          <Sparkles className="w-8 h-8 text-indigo-500" />
        </motion.div>
        <h1 className="text-6xl font-bold tracking-tighter mb-4">Surprise Me</h1>
        <p className="text-white/50 text-xl max-w-2xl mx-auto">
          Let our AI engine craft the perfect Indian escape based on your current vibe and budget.
        </p>
      </header>

      {!recommendation ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-[40px] p-12 backdrop-blur-2xl"
        >
          <div className="space-y-12">
            {/* Mood Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6 block">What's your mood right now?</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {moods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={cn(
                      "p-8 rounded-3xl border transition-all flex flex-col items-center gap-4 group",
                      mood === m.id 
                        ? "bg-white border-white text-black" 
                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                    )}
                  >
                    <m.icon className={cn("w-10 h-10 transition-transform group-hover:scale-110", mood === m.id ? "text-black" : m.color)} />
                    <span className="font-bold">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Selection */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Your Budget</label>
                <span className="text-3xl font-bold text-rose-400">₹{budget}</span>
              </div>
              <input 
                type="range" 
                min="5000" 
                max="200000" 
                step="5000"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between mt-4 text-xs text-white/30 font-bold">
                <span>₹5,000</span>
                <span>₹2,00,000</span>
              </div>
            </div>

            <button
              onClick={handleSurprise}
              disabled={!mood || loading}
              className="w-full py-6 bg-indigo-500 text-white rounded-3xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-indigo-400 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-6 h-6" /> Generate My Escape</>}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
            <div className="relative h-80">
              <img 
                src={`https://images.unsplash.com/photo-1524492707947-2f85a643f9af?auto=format&fit=crop&q=80&w=1000`} 
                className="w-full h-full object-cover"
                alt="Destination"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-10">
                <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-widest text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  Recommended Destination
                </div>
                <h2 className="text-6xl font-bold tracking-tighter">{recommendation.destination}</h2>
              </div>
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Why you'll love it</h3>
                  <p className="text-white/60 leading-relaxed text-lg">{recommendation.description}</p>
                </div>
                <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    Top Activity
                  </h4>
                  <p className="text-white/80">{recommendation.activity}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Plane className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Flight</p>
                    <p className="font-bold">{recommendation.flight.airline}</p>
                    <p className="text-sm text-white/60">{recommendation.flight.duration} • ₹{recommendation.flight.price}</p>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <Hotel className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Stay</p>
                    <p className="font-bold">{recommendation.hotel.name}</p>
                    <p className="text-sm text-white/60">{recommendation.hotel.rating} Stars • ₹{recommendation.hotel.pricePerNight}/night</p>
                  </div>
                </div>

                <button 
                  onClick={handleBookSurprise}
                  className="w-full py-5 bg-white text-black rounded-3xl font-bold hover:bg-indigo-500 hover:text-white transition-colors"
                >
                  Book This Package
                </button>
                <button 
                  onClick={() => setRecommendation(null)}
                  className="w-full py-5 text-white/50 hover:text-white transition-colors text-sm font-bold"
                >
                  Try Another Surprise
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
