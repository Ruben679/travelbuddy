import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Plane, Train, Hotel, Sparkles, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-[#0A0A1F]" />
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Travel"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-6">
              The Future of Travel
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
              BEYOND THE <br />
              <span className="text-rose-500">ORDINARY.</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Experience travel booking reimagined. From high-speed rails to luxury sky suites, 
              TravelBuddy brings the world to your fingertips with AI-driven discovery.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                Start Exploring <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/surprise" className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                <Sparkles className="w-4 h-4 text-rose-400" />
                Surprise Me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Plane, title: "Sky Suites", desc: "Premium flight experiences with real-time seat selection and concierge service." },
            { icon: Train, title: "Rail Luxury", desc: "From sleeper cabins to first-class lounges, explore the world by rail." },
            { icon: Hotel, title: "Elite Stays", desc: "Curated collection of the world's most breathtaking hotels and resorts." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-colors group"
            >
              <feature.icon className="w-10 h-10 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/50 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
