import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Zap, Shield, Clock, Users, Trophy } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Zap className="w-8 h-8 text-sports-green" />, title: 'Instant Booking', desc: 'Book your slot in seconds with our seamless process.' },
    { icon: <Clock className="w-8 h-8 text-sports-orange" />, title: '24/7 Availability', desc: 'Play anytime. We are open from early morning to late night.' },
    { icon: <Shield className="w-8 h-8 text-sports-yellow" />, title: 'Secure Payments', desc: '100% safe and secure online transaction process.' },
    { icon: <Users className="w-8 h-8 text-light-text" />, title: 'Pro Equipment', desc: 'Top-tier turf and professional cricket equipment provided.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-light-900">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center pt-20 pb-32 overflow-hidden min-h-[90vh]">
        <div className="absolute inset-0 z-0 bg-white">
          <img 
            src="/equipment.png" 
            alt="Cricket Equipment" 
            className="w-full h-full object-cover opacity-50 scale-105 transform origin-center" 
          />
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-light-text tracking-tight mb-6">
              DOMINATE THE <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sports-green to-sports-lightGreen">
                CRICKET TURF
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-light-muted mb-10 font-medium">
              Book premium box cricket arenas with state-of-the-art pitches. Gather your squad and unleash the champion within.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-sports-green hover:bg-sports-green/90 text-white font-bold border-none shadow-md" onClick={() => navigate('/book')}>
                Book a Slot Now
              </Button>
              <Button variant="outline" size="lg" className="border-sports-green text-sports-green hover:bg-sports-green/10 bg-white shadow-sm" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-light-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-display font-bold text-light-text mb-6"
            >
              Why Choose <span className="text-sports-green">Us?</span>
            </motion.h2>
            <div className="w-24 h-1.5 bg-sports-green mx-auto rounded-full shadow-sm"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300 border-t-4 border-t-sports-green bg-white shadow-sm hover:shadow-md"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-light-600 flex items-center justify-center mb-6 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-light-text mb-3 font-display">{feature.title}</h3>
                <p className="text-light-muted leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Gallery / Action Section */}
      <section className="py-20 relative overflow-hidden bg-gray-50 border-t border-light-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-light-text mb-6">
                Ready for <span className="text-sports-orange">Action?</span>
              </h2>
              <p className="text-xl text-light-muted mb-8">
                Our turf is designed to give you the perfect balance of bounce and pace. Whether you're playing a casual game or a competitive tournament, our facilities are unmatched.
              </p>
              <Button size="lg" className="bg-sports-orange hover:bg-sports-orange/90 text-white font-bold border-none shadow-md" onClick={() => navigate('/about')}>
                Learn More About Us
              </Button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 w-full"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-light-600 group bg-white">
                <img src="/turf.webp" alt="Cricket Action" className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-8 h-8 text-sports-yellow" />
                    <span className="text-2xl font-display font-bold text-white">Premium Quality</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
