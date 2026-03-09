import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, TravelType, FlightDetails, Passenger } from '../types';
import { Plane, Train, Hotel, Map, Search, Calendar, MapPin, Users, CreditCard, CheckCircle2, ArrowRight, ChevronRight, User as UserIcon, Utensils, Armchair, Smartphone } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
  user: User;
}

type BookingStep = 'search' | 'select-flight' | 'passengers' | 'seat-meal' | 'payment' | 'success';

const INDIAN_AIRLINES = [
  { id: 'indigo', name: 'IndiGo', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/af/IndiGo_Airlines_logo.svg/1200px-IndiGo_Airlines_logo.svg.png', basePrice: 4500 },
  { id: 'vistara', name: 'Vistara', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Vistara_logo.svg/1200px-Vistara_logo.svg.png', basePrice: 6200 },
  { id: 'airindia', name: 'Air India', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/Air_India_Logo.svg/1200px-Air_India_Logo.svg.png', basePrice: 5800 },
  { id: 'spicejet', name: 'SpiceJet', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/SpiceJet_logo.svg/1200px-SpiceJet_logo.svg.png', basePrice: 4200 },
];

const INDIAN_TRAINS = [
  { id: 'rajdhani', name: 'Rajdhani Express', number: '12431', basePrice: 2800 },
  { id: 'shatabdi', name: 'Shatabdi Express', number: '12002', basePrice: 1500 },
  { id: 'duronto', name: 'Duronto Express', number: '12213', basePrice: 2200 },
  { id: 'garibrath', name: 'Garib Rath', number: '12909', basePrice: 950 },
  { id: 'mumbai', name: 'Mumbai Express', number: '12134', basePrice: 1800 },
];

export default function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TravelType>('flight');
  const [step, setStep] = useState<BookingStep>('search');
  const [selectedFlight, setSelectedFlight] = useState<FlightDetails | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<any>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([{ name: '', age: 0, gender: 'Male' }]);
  const [selectedSeat, setSelectedSeat] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [berthPreference, setBerthPreference] = useState<string>('');
  const [mealNeeded, setMealNeeded] = useState<boolean>(false);
  const [mealType, setMealType] = useState<'Veg' | 'Non-Veg'>('Veg');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [searchParams, setSearchParams] = useState({ from: '', to: '', date: '', class: 'Economy' });

  const tabs = [
    { id: 'flight', icon: Plane, label: 'Flights' },
    { id: 'train', icon: Train, label: 'Trains' },
    { id: 'hotel', icon: Hotel, label: 'Hotels' },
    { id: 'package', icon: Map, label: 'Packages' },
  ];

  const handleSearch = () => {
    setStep(activeTab === 'flight' ? 'select-flight' : 'select-flight'); // Reusing the step name for simplicity
  };

  const handleSelectFlight = (flight: FlightDetails) => {
    setSelectedFlight(flight);
    setStep('passengers');
  };

  const handleSelectTrain = (train: any) => {
    setSelectedTrain(train);
    setStep('passengers');
  };

  const handleAddPassenger = () => {
    setPassengers([...passengers, { name: '', age: 0, gender: 'Male' }]);
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const calculateTotalPrice = () => {
    let base = activeTab === 'flight' ? (selectedFlight?.price || 0) : (selectedTrain?.price || 0);
    if (activeTab === 'train' && mealNeeded) {
      base += 250; // Meal charge
    }
    return (base * passengers.length) + 750; // Base * passengers + taxes
  };

  const handleFinalBook = async () => {
    try {
      let details: any = {
        passengers,
        paymentMethod,
        bookingDate: new Date().toISOString()
      };

      if (activeTab === 'flight') {
        details = { ...details, ...selectedFlight, seatNo: selectedSeat, meal: selectedMeal };
      } else if (activeTab === 'train') {
        details = { ...details, ...selectedTrain, berthPreference, mealNeeded, mealType: mealNeeded ? mealType : undefined };
      } else if (activeTab === 'hotel') {
        details = { ...details, ...selectedHotel };
      } else if (activeTab === 'package') {
        details = { ...details, ...selectedPackage };
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          type: activeTab,
          details
        }),
      });

      if (res.ok) {
        setStep('success');
      } else {
        alert('Failed to confirm booking. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <header className="mb-8 md:mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2 md:mb-4">Namaste, {user.name.split(' ')[0]}!</h1>
        <p className="text-white/50 text-base md:text-lg">Where would you like to travel in India today?</p>
      </header>

      {step === 'search' && (
        <>
          {/* Tabs */}
          <div className="flex gap-1 md:gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-full md:w-fit mb-8 md:mb-12 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TravelType)}
                className={cn(
                  "flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-white text-black shadow-xl" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[40px] p-6 md:p-10 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <SearchField 
                icon={MapPin} 
                label="From" 
                placeholder={activeTab === 'flight' ? "Delhi (DEL)" : "New Delhi (NDLS)"} 
                value={searchParams.from}
                onChange={(val: string) => setSearchParams({...searchParams, from: val})}
              />
              <SearchField 
                icon={MapPin} 
                label="To" 
                placeholder={activeTab === 'flight' ? "Mumbai (BOM)" : "Mumbai Central (MMCT)"} 
                value={searchParams.to}
                onChange={(val: string) => setSearchParams({...searchParams, to: val})}
              />
              <SearchField 
                icon={Calendar} 
                label="Date" 
                placeholder="Select Date" 
                type="date" 
                value={searchParams.date}
                onChange={(val: string) => setSearchParams({...searchParams, date: val})}
              />
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-4">Class</label>
                <select 
                  value={searchParams.class}
                  onChange={(e) => setSearchParams({...searchParams, class: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-2xl py-4 px-4 focus:outline-none focus:border-indigo-500/50 appearance-none text-white"
                >
                  {activeTab === 'flight' && (
                    <>
                      <option value="Economy" className="bg-[#0A0A1F]">Economy</option>
                      <option value="Premium Economy" className="bg-[#0A0A1F]">Premium Economy</option>
                      <option value="Business" className="bg-[#0A0A1F]">Business</option>
                    </>
                  )}
                  {activeTab === 'train' && (
                    <>
                      <option value="Sleeper" className="bg-[#0A0A1F]">Sleeper</option>
                      <option value="3rd AC" className="bg-[#0A0A1F]">3rd AC</option>
                      <option value="2nd AC" className="bg-[#0A0A1F]">2nd AC</option>
                      <option value="1st AC" className="bg-[#0A0A1F]">1st AC</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8 md:pt-10">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 text-white/50">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{passengers.length} Passenger(s)</span>
                </div>
              </div>

              <button 
                onClick={handleSearch}
                className="w-full md:w-auto px-10 py-4 bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/20"
              >
                Search {activeTab}s <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {step === 'select-flight' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Select {activeTab === 'flight' ? 'Flight' : 'Train'}</h2>
            <button onClick={() => setStep('search')} className="text-sm text-white/50 hover:text-white">Change Search</button>
          </div>
          <div className="grid gap-4">
            {activeTab === 'flight' ? INDIAN_AIRLINES.map((airline) => (
              <div 
                key={airline.id}
                className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-500/30 transition-colors group cursor-pointer"
                onClick={() => handleSelectFlight({
                  id: Math.random().toString(36).substr(2, 9),
                  airline: airline.name,
                  logo: airline.logo,
                  from: searchParams.from || 'Delhi',
                  to: searchParams.to || 'Mumbai',
                  departure: '10:30 AM',
                  arrival: '12:45 PM',
                  duration: '2h 15m',
                  price: airline.basePrice,
                  class: 'Economy'
                })}
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 bg-white rounded-2xl p-2 flex items-center justify-center">
                    <img src={airline.logo} alt={airline.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{airline.name}</h3>
                    <p className="text-white/40 text-sm">Non-stop • 2h 15m</p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full md:w-auto md:gap-12">
                  <div className="text-center">
                    <p className="text-lg font-bold">10:30 AM</p>
                    <p className="text-white/40 text-xs">{searchParams.from?.substring(0,3).toUpperCase() || 'DEL'}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-16 md:w-24 h-[1px] bg-white/20 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">12:45 PM</p>
                    <p className="text-white/40 text-xs">{searchParams.to?.substring(0,3).toUpperCase() || 'BOM'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full md:w-auto md:gap-8">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-rose-400">₹{airline.basePrice}</p>
                    <p className="text-white/40 text-xs">per adult</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-full group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )) : INDIAN_TRAINS.map((train) => (
              <div 
                key={train.id}
                className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-500/30 transition-colors group cursor-pointer"
                onClick={() => handleSelectTrain({
                  id: Math.random().toString(36).substr(2, 9),
                  trainName: searchParams.to?.toLowerCase().includes('mumbai') ? 'Mumbai Express' : train.name,
                  trainNumber: train.number,
                  from: searchParams.from || 'NDLS',
                  to: searchParams.to || 'MMCT',
                  departure: '08:00 PM',
                  arrival: '10:00 AM',
                  duration: '14h 00m',
                  price: train.basePrice,
                  class: '3rd AC'
                })}
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                    <Train className="w-8 h-8 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{searchParams.to?.toLowerCase().includes('mumbai') ? 'Mumbai Express' : train.name}</h3>
                    <p className="text-white/40 text-sm">#{train.number} • Daily</p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full md:w-auto md:gap-12">
                  <div className="text-center">
                    <p className="text-lg font-bold">08:00 PM</p>
                    <p className="text-white/40 text-xs">{searchParams.from || 'NDLS'}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-16 md:w-24 h-[1px] bg-white/20 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">10:00 AM</p>
                    <p className="text-white/40 text-xs">{searchParams.to || 'MMCT'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full md:w-auto md:gap-8">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-rose-400">₹{train.basePrice}</p>
                    <p className="text-white/40 text-xs">per adult</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-full group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {step === 'passengers' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Passenger Details</h2>
          <div className="space-y-6">
            {passengers.map((p, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-6">
                <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                  <UserIcon className="w-4 h-4" /> Passenger {i + 1}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 ml-4">Full Name</label>
                    <input 
                      type="text"
                      value={p.name}
                      onChange={(e) => handlePassengerChange(i, 'name', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-indigo-500/50"
                      placeholder="As per ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 ml-4">Age</label>
                    <input 
                      type="number"
                      value={p.age || ''}
                      onChange={(e) => handlePassengerChange(i, 'age', parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-indigo-500/50"
                      placeholder="Age"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={handleAddPassenger} className="text-rose-400 font-bold text-sm hover:text-rose-300">+ Add Another Passenger</button>
            <button 
              onClick={() => setStep('seat-meal')}
              className="w-full py-5 bg-indigo-500 text-white rounded-3xl font-bold mt-8 shadow-lg shadow-indigo-500/20"
            >
              Continue to {activeTab === 'flight' ? 'Seat & Meals' : 'Berth & Meals'}
            </button>
          </div>
        </motion.div>
      )}

      {step === 'seat-meal' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Customize Your Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[32px]">
              <div className="flex items-center gap-3 mb-8">
                <Armchair className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-bold">{activeTab === 'flight' ? 'Select Seat' : 'Berth Preference'}</h3>
              </div>
              {activeTab === 'flight' ? (
                <div className="grid grid-cols-4 gap-3">
                  {['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '3D'].map(seat => (
                    <button
                      key={seat}
                      onClick={() => setSelectedSeat(seat)}
                      className={cn(
                        "py-3 rounded-xl text-xs font-bold transition-all",
                        selectedSeat === seat ? "bg-indigo-500 text-white" : "bg-white/5 hover:bg-white/10 text-white/60"
                      )}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'].map(berth => (
                    <button
                      key={berth}
                      onClick={() => setBerthPreference(berth)}
                      className={cn(
                        "py-4 rounded-xl text-xs font-bold transition-all border",
                        berthPreference === berth ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/60"
                      )}
                    >
                      {berth}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-[32px]">
              <div className="flex items-center gap-3 mb-8">
                <Utensils className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-bold">Meal Service</h3>
              </div>
              {activeTab === 'flight' ? (
                <div className="space-y-3">
                  {['Veg Thali', 'Non-Veg Thali', 'Continental', 'Fruit Platter'].map(meal => (
                    <button
                      key={meal}
                      onClick={() => setSelectedMeal(meal)}
                      className={cn(
                        "w-full py-4 px-6 rounded-2xl text-left font-bold transition-all border",
                        selectedMeal === meal ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/60"
                      )}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="font-bold">Add Meals? (+₹250)</span>
                    <button 
                      onClick={() => setMealNeeded(!mealNeeded)}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-colors",
                        mealNeeded ? "bg-indigo-500" : "bg-white/20"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                        mealNeeded ? "left-7" : "left-1"
                      )} />
                    </button>
                  </div>
                  {mealNeeded && (
                    <div className="grid grid-cols-2 gap-3">
                      {['Veg', 'Non-Veg'].map(type => (
                        <button
                          key={type}
                          onClick={() => setMealType(type as 'Veg' | 'Non-Veg')}
                          className={cn(
                            "py-4 rounded-xl text-xs font-bold transition-all border",
                            mealType === type ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/60"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => setStep('payment')}
            className="w-full py-5 bg-indigo-500 text-white rounded-3xl font-bold mt-12 shadow-lg shadow-indigo-500/20"
          >
            Continue to Payment
          </button>
        </motion.div>
      )}

      {step === 'payment' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-8">Payment</h2>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-8">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setPaymentMethod('upi')}
                className={cn(
                  "p-6 rounded-3xl border flex items-center gap-4 transition-all",
                  paymentMethod === 'upi' ? "bg-white border-white text-black" : "bg-white/5 border-white/10 text-white/60"
                )}
              >
                <Smartphone className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-bold">UPI Payment</p>
                  <p className="text-xs opacity-60">GPay, PhonePe, Paytm</p>
                </div>
              </button>
              <button 
                onClick={() => setPaymentMethod('card')}
                className={cn(
                  "p-6 rounded-3xl border flex items-center gap-4 transition-all",
                  paymentMethod === 'card' ? "bg-white border-white text-black" : "bg-white/5 border-white/10 text-white/60"
                )}
              >
                <CreditCard className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-bold">Credit / Debit Card</p>
                  <p className="text-xs opacity-60">Visa, Mastercard, RuPay</p>
                </div>
              </button>
            </div>

            <div className="border-t border-white/10 pt-8">
              <div className="flex justify-between mb-2">
                <span className="text-white/40">Base Fare (x{passengers.length})</span>
                <span>₹{((activeTab === 'flight' ? selectedFlight?.price : selectedTrain?.price) || 0) * passengers.length}</span>
              </div>
              {activeTab === 'train' && mealNeeded && (
                <div className="flex justify-between mb-2">
                  <span className="text-white/40">Meals (x{passengers.length})</span>
                  <span>₹{250 * passengers.length}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span className="text-white/40">Taxes & Fees</span>
                <span>₹750</span>
              </div>
              <div className="flex justify-between text-xl font-bold mt-4">
                <span>Total Amount</span>
                <span className="text-rose-400">₹{calculateTotalPrice()}</span>
              </div>
            </div>

            <button 
              onClick={handleFinalBook}
              className="w-full py-5 bg-indigo-500 text-white rounded-3xl font-bold shadow-lg shadow-indigo-500/20"
            >
              Pay & Confirm Booking
            </button>
          </div>
        </motion.div>
      )}

      {step === 'success' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24">
          <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl font-bold tracking-tighter mb-4">Booking Confirmed!</h2>
          <p className="text-white/50 text-xl mb-12">Your e-ticket has been generated and sent to your email.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => {
              setStep('search');
              setSelectedFlight(null);
              setSelectedTrain(null);
              setSelectedHotel(null);
              setSelectedPackage(null);
              setPassengers([{ name: '', age: 0, gender: 'Male' }]);
              setSelectedSeat('');
              setSelectedMeal('');
              setBerthPreference('');
              setMealNeeded(false);
              setSearchParams({ from: '', to: '', date: '', class: 'Economy' });
            }} className="px-10 py-4 bg-white text-black rounded-2xl font-bold">Book Another</button>
            <button onClick={() => navigate('/bookings')} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold">View My Tickets</button>
          </div>
        </motion.div>
      )}

      {/* Recommendations - Only show on search step */}
      {step === 'search' && (
        <section className="mt-24">
          <h2 className="text-3xl font-bold mb-8">Trending in India</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: 'https://images.unsplash.com/photo-1548013146-72479768bada', city: 'Agra', country: 'Uttar Pradesh', price: '₹4,500' },
              { img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8', city: 'Goa', country: 'Beach Paradise', price: '₹6,200' },
              { img: 'https://images.unsplash.com/photo-1524492707947-2f85a643f9af', city: 'Jaipur', country: 'Rajasthan', price: '₹5,100' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group relative h-96 rounded-[40px] overflow-hidden cursor-pointer"
              >
                <img src={item.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.city} referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-2">{item.country}</p>
                  <h3 className="text-3xl font-bold mb-4">{item.city}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-white/60 text-sm">Starting from</span>
                    <span className="text-xl font-bold">{item.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SearchField({ icon: Icon, label, placeholder, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-4">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-colors text-white"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
