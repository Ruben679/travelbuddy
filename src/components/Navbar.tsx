import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Compass, User as UserIcon, LogOut, Ticket } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-xl border-b border-white/10 z-50 px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tighter">TRAVELBUDDY</span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Explore</Link>
            <Link to="/surprise" className="text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors">Surprise Me</Link>
            <Link to="/bookings" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
              <Ticket className="w-4 h-4" />
              My Bookings
            </Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/50">Hi, {user.name}</span>
              <button 
                onClick={() => { onLogout(); navigate('/'); }}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/70 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-white/90 transition-colors">
              Join TravelBuddy
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
