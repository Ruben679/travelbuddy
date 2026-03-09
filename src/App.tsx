import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import SurpriseMe from './pages/SurpriseMe';
import MyBookings from './pages/MyBookings';
import Navbar from './components/Navbar';
import { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('voya_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('voya_user');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A1F] text-white font-sans selection:bg-indigo-500/30">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={setUser} />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage onLogin={setUser} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/surprise" element={user ? <SurpriseMe user={user} /> : <Navigate to="/login" />} />
            <Route path="/bookings" element={user ? <MyBookings user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
