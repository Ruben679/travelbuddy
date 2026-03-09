import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Booking } from '../types';
import { Ticket, Plane, Train, Hotel, Map, Calendar, MapPin, Clock, Hash, QrCode, X, Download, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface MyBookingsProps {
  user: User;
}

export default function MyBookings({ user }: MyBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  useEffect(() => {
    fetch(`/api/bookings/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      });
  }, [user.id]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-16">
        <h1 className="text-6xl font-bold tracking-tighter mb-4">My Bookings</h1>
        <p className="text-white/50 text-xl">Your digital passes and travel history.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-24 bg-white/5 border border-white/10 rounded-[40px]">
          <Ticket className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-2">No bookings yet</h2>
          <p className="text-white/40 mb-8">Your next adventure is waiting to be booked.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {bookings.map((booking, i) => (
            <TicketCard key={booking.id} booking={booking} index={i} user={user} onViewTicket={() => setSelectedTicket(booking)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedTicket && (
          <VirtualTicket 
            key="virtual-ticket"
            booking={selectedTicket} 
            user={user} 
            onClose={() => setSelectedTicket(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const TicketCard: React.FC<{ booking: Booking; index: number; user: User; onViewTicket: () => void }> = ({ booking, index, user, onViewTicket }) => {
  const details = booking.details;
  const isFlight = booking.type === 'flight';
  const isTrain = booking.type === 'train';
  const isHotel = booking.type === 'hotel';
  const isPackage = booking.type === 'package';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-[32px] overflow-hidden group hover:border-indigo-500/30 transition-colors"
    >
      {/* Left Section: Info */}
      <div className="flex-1 p-8 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isFlight ? "bg-blue-500/10 text-blue-400" :
            isTrain ? "bg-rose-500/10 text-rose-400" :
            isHotel ? "bg-purple-500/10 text-purple-400" :
            "bg-indigo-500/10 text-indigo-400"
          )}>
            {isFlight && <Plane className="w-5 h-5" />}
            {isTrain && <Train className="w-5 h-5" />}
            {isHotel && <Hotel className="w-5 h-5" />}
            {isPackage && <Map className="w-5 h-5" />}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">
            {booking.type} PASS
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">From / Location</p>
            <p className="text-xl font-bold">{details.from || details.location || details.destination}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">To / Name</p>
            <p className="text-xl font-bold">{details.to || details.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Date</p>
            <p className="text-xl font-bold">{details.date || details.checkIn || details.bookingDate?.split('T')[0]}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Class / Type</p>
            <p className="text-rose-400 font-bold">{details.class || details.roomType || 'Standard'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{isTrain ? 'Berth' : 'Seat'} / Pass ID</p>
            <p className="font-mono text-lg">{details.seatNo || details.berthPreference || details.passId || 'TB-772'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Meal / Status</p>
            <p className="font-bold">{details.meal || (details.mealNeeded ? `${details.mealType} Meal` : 'No Meal') || 'Confirmed'}</p>
          </div>
        </div>
      </div>

      {/* Right Section: QR Code / Stub */}
      <div className="w-full md:w-64 bg-white/[0.02] border-t md:border-t-0 md:border-l border-white/10 p-8 flex flex-col items-center justify-center gap-6 relative">
        {/* Perforation circles */}
        <div className="hidden md:block absolute -left-3 top-0 bottom-0 flex flex-col justify-around py-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-[#050505] rounded-full -ml-3 border border-white/10" />
          ))}
        </div>

        <div className="p-4 bg-white rounded-2xl">
          <QrCode className="w-24 h-24 text-black" />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Booking ID</p>
          <p className="font-mono text-sm">#TB-{booking.id.toString().padStart(5, '0')}</p>
        </div>
        <button 
          onClick={onViewTicket}
          className="w-full py-3 bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors hover:bg-indigo-400 shadow-lg shadow-indigo-500/20"
        >
          View Virtual Ticket
        </button>
      </div>
    </motion.div>
  );
}

const VirtualTicket: React.FC<{ booking: Booking; user: User; onClose: () => void }> = ({ booking, user, onClose }) => {
  const details = booking.details;
  const isFlight = booking.type === 'flight';
  const isTrain = booking.type === 'train';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-[#111] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className={cn(
          "p-10 text-white",
          isFlight ? "bg-blue-600" : isTrain ? "bg-rose-600" : "bg-indigo-600"
        )}>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-bold tracking-tighter uppercase">{booking.type} TICKET</h2>
              <p className="text-sm font-bold opacity-70">TRAVELBUDDY PREMIUM TRAVELS</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Booking ID</p>
              <p className="text-xl font-mono font-bold">#TB-{booking.id.toString().padStart(5, '0')}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-5xl font-bold tracking-tighter">{details.from?.substring(0,3).toUpperCase() || 'DEL'}</p>
              <p className="text-xs font-bold opacity-70 mt-1">{details.from || 'Delhi'}</p>
            </div>
            <div className="flex-1 px-8 flex flex-col items-center gap-2">
              <div className="w-full h-[2px] bg-white/20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-full">
                  {isFlight ? <Plane className="w-4 h-4 text-indigo-600" /> : <Train className="w-4 h-4 text-rose-600" />}
                </div>
              </div>
              <p className="text-xs font-bold opacity-70">{details.duration || '2h 15m'}</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold tracking-tighter">{details.to?.substring(0,3).toUpperCase() || 'BOM'}</p>
              <p className="text-xs font-bold opacity-70 mt-1">{details.to || 'Mumbai'}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-10 space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Passenger</p>
              <p className="font-bold">{details.passengers?.[0]?.name || user.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Date</p>
              <p className="font-bold">{details.date || details.bookingDate?.split('T')[0]}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Time</p>
              <p className="font-bold">{details.departure || details.time || '10:30 AM'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Class</p>
              <p className="font-bold text-rose-400">{details.class || 'Economy'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{isFlight ? 'Seat' : 'Berth'}</p>
              <p className="font-bold">{details.seatNo || details.berthPreference || '12A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Meal</p>
              <p className="font-bold">{details.meal || (details.mealNeeded ? `${details.mealType} Meal` : 'No Meal')}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{isFlight ? 'Airline' : 'Train'}</p>
              <p className="font-bold">{details.airline || details.trainName || 'TravelBuddy Express'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{isFlight ? 'Flight' : 'Train'} No</p>
              <p className="font-bold">{details.trainNumber || 'TB-123'}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white rounded-2xl">
                <QrCode className="w-20 h-20 text-black" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Gate / Platform</p>
                <p className="text-2xl font-bold">G-12 / P-4</p>
                <p className="text-xs text-white/40 mt-1">Boarding starts 45m before</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 bg-white/5 border-t border-white/10 flex justify-between items-center">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">TravelBuddy Premium Travel Experience • 2024</p>
          <div className="flex gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white/10 rounded-full" />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
