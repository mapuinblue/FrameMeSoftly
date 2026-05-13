import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample couple-style placeholder images from Unsplash
const PHOTO_URLS = [
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=80',
  'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=300&q=80',
  'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=300&q=80',
  'https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=300&q=80',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&q=80',
  'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=300&q=80',
  'https://images.unsplash.com/photo-1583939411023-14783179e581?w=300&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&q=80',
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&q=80',
  'https://images.unsplash.com/photo-1597586124394-fbd6ef244026?w=300&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&q=80',
  'https://images.unsplash.com/photo-1578778266369-b7d6e83e4e9f?w=300&q=80',
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