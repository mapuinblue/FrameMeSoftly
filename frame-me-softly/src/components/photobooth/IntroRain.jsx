import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import photo1 from '../../assets/photos/1000131680.webp'
import photo2 from '../../assets/photos/1000131757.webp'
import photo3 from '../../assets/photos/1000131848.webp'
import photo4 from '../../assets/photos/1000131895.webp'
import photo5 from '../../assets/photos/1000131987.webp'
import photo6 from '../../assets/photos/1000132044.webp'
import photo7 from '../../assets/photos/1000132114.webp'
import photo8 from '../../assets/photos/1000132115.webp'
import photo9 from '../../assets/photos/1000132130.webp'
import photo10 from '../../assets/photos/1000132152.webp'
import photo11 from '../../assets/photos/1000132159.webp'
import photo12 from '../../assets/photos/1000132175.webp'
import photo13 from '../../assets/photos/1000135047.webp'
import photo14 from '../../assets/photos/1000135928.webp'
import photo15 from '../../assets/photos/1000135932.webp'

const PHOTO_URLS = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
  photo9,
  photo10,
  photo11,
  photo12,
  photo13,
  photo14,
  photo15,
];

const POLAROIDS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  url: PHOTO_URLS[i % PHOTO_URLS.length],
  x: Math.random() * 90 + 5,
  rotation: (Math.random() - 0.5) * 30,
  width: Math.random() * 60 + 90,
  delay: Math.random() * 3,
  duration: Math.random() * 5 + 8,
  startY: -Math.random() * 30 - 10,
}));

export default function IntroRain({ onComplete }) {
  const [phase, setPhase] = useState('raining'); // raining | blurring | done
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 1200);
    const t2 = setTimeout(() => setPhase('blurring'), 3500);
    const t3 = setTimeout(() => onComplete(), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#0d0406] overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Falling polaroids */}
      <div className={`absolute inset-0 transition-all duration-1500 ${phase === 'blurring' ? 'blur-sm opacity-40 scale-105' : ''}`}>
        {POLAROIDS.map((p) => (
          <motion.div
            key={p.id}
            className="absolute polaroid rounded-sm"
            style={{
              left: `${p.x}%`,
              width: p.width,
              rotate: p.rotation,
              padding: '6px 6px 18px 6px',
            }}
            initial={{ y: `${p.startY}vh`, opacity: 0 }}
            animate={{ y: '110vh', opacity: [0, 0.9, 0.9, 0.6] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            <div className="w-full aspect-square bg-stone-800 overflow-hidden">
              <img
                src={p.url}
                alt=""
                className="w-full h-full object-cover opacity-80 grayscale sepia"
                style={{ filter: 'sepia(0.5) contrast(1.1) brightness(0.85)' }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 vignette pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 20%, rgba(13,4,6,0.7) 80%, rgba(13,4,6,0.95) 100%)'
      }} />

      {/* Center title */}
      <AnimatePresence>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mb-4 text-gold text-xl tracking-[0.4em] font-montserrat font-light"
            >
              ✦ ✦ ✦
            </motion.div>
            <h1 className="font-playfair text-5xl md:text-7xl text-ivory/90 mb-4 italic leading-tight">
              Our Memories
            </h1>
            <div className="ornament w-64 mx-auto mb-4">
              <span className="font-montserrat text-gold/80 text-xs tracking-widest">LOVE PHOTOBOOTH</span>
            </div>
            <p className="font-cormorant text-lg text-ivory/50 italic tracking-wider">
              A gift made with love
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}