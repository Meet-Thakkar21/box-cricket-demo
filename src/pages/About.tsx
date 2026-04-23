import { motion } from 'framer-motion';
import { Shield, Users, Trophy } from 'lucide-react';

export const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/stumps.png" 
            alt="Cricket Stumps at Night" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-extrabold text-white tracking-tight mb-4"
          >
            OUR <span className="text-sports-green">STORY</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Built by cricketers, for cricketers. We provide the best indoor turf experience in the city.
          </motion.p>
        </div>
      </section>

      {/* The Arena Section */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                World-Class <span className="text-sports-orange">Facilities</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Our arena features premium artificial turf imported directly to ensure true bounce and maximum safety. With professional LED floodlights, you can play your best game day or night.
              </p>
              <ul className="space-y-4 mt-8">
                {[
                  { icon: <Shield className="text-sports-green w-6 h-6" />, text: "Shock-absorbent premium turf" },
                  { icon: <Trophy className="text-sports-orange w-6 h-6" />, text: "Tournament standard pitches" },
                  { icon: <Users className="text-sports-yellow w-6 h-6" />, text: "Spacious dugouts for teams" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <div className="p-2 bg-dark-800 rounded-lg border border-dark-700">
                      {item.icon}
                    </div>
                    <span className="text-gray-300 font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-2xl overflow-hidden glass-card p-2"
            >
              <img 
                src="/arena.png" 
                alt="Box Cricket Arena" 
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section using original images */}
      <section className="py-20 bg-dark-800 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Glimpse of the <span className="text-sports-green">Action</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl overflow-hidden border border-sports-green/20 shadow-sports-green/10 shadow-xl"
            >
              <img src="/turf.webp" alt="Turf View 1" className="w-full h-[300px] object-cover" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl overflow-hidden border border-sports-orange/20 shadow-sports-orange/10 shadow-xl"
            >
              <img src="/turf2.webp" alt="Turf View 2" className="w-full h-[300px] object-cover" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
