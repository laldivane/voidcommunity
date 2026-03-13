"use client";

import { motion } from 'framer-motion';
import { Ghost, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PARTICLE_COUNT = 20;
const STATIC_PARTICLES = [...Array(PARTICLE_COUNT)].map((_, i) => ({
  id: i,
  width: (Math.random() * 4 + 1) + 'px',
  height: (Math.random() * 4 + 1) + 'px',
  top: (Math.random() * 100) + '%',
  left: (Math.random() * 100) + '%',
  duration: (Math.random() * 3 + 2) + 's',
  delay: (Math.random() * 2) + 's'
}));

export default function ComingSoonPage({ feature }: { feature: string }) {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden h-full bg-void-bg text-moonlit">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-crimson/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md"
      >
        <div className="w-24 h-24 bg-void-800 rounded-3xl flex items-center justify-center mb-8 mx-auto glow-crimson border border-crimson/20 relative group">
          <Ghost size={48} className="text-crimson/40 group-hover:text-crimson transition-colors duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-crimson/10 rounded-3xl shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <h1 className="text-4xl font-bold font-display text-moonlit mb-4 tracking-tight">
          {feature} <span className="text-crimson">is emerging...</span>
        </h1>
        
        <p className="text-moonlit/40 italic mb-10 leading-relaxed">
          "The void is currently manifesting this reality. Be patient, soul, for the shadows take time to take form."
        </p>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mx-auto text-sm font-bold uppercase tracking-widest text-crimson hover:text-ember transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to the Light
        </button>
      </motion.div>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
         {STATIC_PARTICLES.map((p) => (
           <div 
            key={p.id}
            className="absolute rounded-full bg-crimson/20"
            style={{
              width: p.width,
              height: p.height,
              top: p.top,
              left: p.left,
              animation: `smoke-drift ${p.duration} ease-in-out infinite`,
              animationDelay: p.delay
            }}
           />
         ))}
      </div>
    </div>
  );
}
