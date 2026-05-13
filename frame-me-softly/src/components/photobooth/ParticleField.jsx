import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 12 + 10,
  delay: Math.random() * 8,
  type: i % 3, // 0=dot, 1=heart, 2=sparkle
}));

export default function ParticleField({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: '110vh', x: `${p.x}vw`, opacity: 0 }}
              animate={{
                y: '-10vh',
                opacity: [0, 0.6, 0.4, 0],
                x: [`${p.x}vw`, `${p.x + (Math.random() - 0.5) * 8}vw`],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ position: 'absolute', bottom: 0, left: 0 }}
            >
              {p.type === 0 && (
                <div
                  style={{ width: p.size, height: p.size }}
                  className="rounded-full bg-wine-light/40"
                />
              )}
              {p.type === 1 && (
                <span style={{ fontSize: p.size + 6, opacity: 0.3 }} className="text-gold">
                  ♥
                </span>
              )}
              {p.type === 2 && (
                <span style={{ fontSize: p.size + 4, opacity: 0.25 }} className="text-gold-light">
                  ✦
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}