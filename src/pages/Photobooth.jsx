import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroRain from '../components/photobooth/IntroRain';
import PhotoboothMain from '../components/photobooth/PhotoboothMain';
import GrainOverlay from '../components/photobooth/GrainOverlay';
import ParticleField from '../components/photobooth/ParticleField';

export default function Photobooth() {
  const [introComplete, setIntroComplete] = useState(false);
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    if (introComplete) {
      const t = setTimeout(() => setShowMain(true), 300);
      return () => clearTimeout(t);
    }
  }, [introComplete]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <GrainOverlay />
      <ParticleField active={showMain} />

      <AnimatePresence mode="wait">
        {!introComplete && (
          <IntroRain key="intro" onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMain && (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10"
          >
            <PhotoboothMain />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}