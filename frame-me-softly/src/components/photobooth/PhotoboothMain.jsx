import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import CameraView from './CameraView';
import PhotoStrip from './PhotoStrip';
import FlashEffect from './FlashEffect';
import PlaylistPanel from './PlaylistPanel';
import { FILTERS } from './filters';
import { Volume2, VolumeX } from 'lucide-react';

export default function PhotoboothMain() {
  const [photos, setPhotos] = useState([null, null, null]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [flashActive, setFlashActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('vintage-warm');
  const [flashEnabled, setFlashEnabled] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const nextEmptySlot = photos.findIndex((p) => p === null);
  const isFull = nextEmptySlot === -1;

  const handleCapture = useCallback((takeFn) => {
    if (isCapturing || isFull) return;
    setIsCapturing(true);

    let count = 3;
    setCountdown(count);

    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown('✦');

        setTimeout(() => {
          if (flashEnabled) setFlashActive(true);
          setTimeout(() => {
            const dataUrl = takeFn();
            setFlashActive(false);
            setCountdown(null);
            setIsCapturing(false);
            if (dataUrl) {
              setPhotos((prev) => {
                const idx = prev.findIndex((p) => p === null);
                if (idx === -1) return prev;
                const next = [...prev];
                next[idx] = { dataUrl, filter: selectedFilter };
                return next;
              });
            }
          }, 300);
        }, 200);
      }
    }, 900);
  }, [isCapturing, isFull, flashEnabled, selectedFilter]);

  const handleDelete = (index) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  return (
    <div className="min-h-screen light-leak relative">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, hsl(350 40% 12% / 0.8) 0%, hsl(20 15% 5%) 100%)'
      }} />

      {/* Flash */}
      <FlashEffect active={flashActive} />

      {/* Countdown overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <motion.div
            key={countdown}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="font-playfair text-9xl text-ivory/90 drop-shadow-2xl"
            style={{ textShadow: '0 0 60px hsl(var(--wine-light))' }}
          >
            {countdown}
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 text-center pt-8 pb-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p className="font-montserrat text-gold/70 text-xs tracking-[0.4em] uppercase mb-2">Romantic Vintage</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-ivory/90 italic">
            Love Photobooth
          </h1>
          <div className="ornament w-56 mx-auto mt-3">
            <span className="text-gold/60 text-xs font-montserrat tracking-widest">est. {new Date().getFullYear()}</span>
          </div>
        </motion.div>
      </div>

      {/* Music toggle — top right, shared state */}
      <div className="fixed top-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMusicPlaying((p) => !p)}
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-wine/40 bg-background/60 backdrop-blur-md text-ivory/70 hover:text-gold hover:border-gold/40 transition-all duration-300"
        >
          {musicPlaying
            ? <Volume2 size={14} />
            : <VolumeX size={14} />
          }
          <span className="font-montserrat text-xs tracking-widest">
            {musicPlaying ? 'MUSIC ON' : 'MUSIC OFF'}
          </span>
        </motion.button>
      </div>

      {/* Main layout: [Camera + Playlist] | [Strip] */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-center gap-6 px-4 pb-10 max-w-5xl mx-auto">

        {/* Left column: Camera on top, Playlist below */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col gap-5 w-full lg:w-auto flex-1"
        >
          <CameraView
            onCapture={handleCapture}
            isCapturing={isCapturing}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            flashEnabled={flashEnabled}
            setFlashEnabled={setFlashEnabled}
            isFull={isFull}
            photosCount={photos.filter(Boolean).length}
          />

          {/* Separator */}
          <div className="ornament">
            <span className="text-gold/50 text-xs font-montserrat tracking-widest">SOUNDTRACK</span>
          </div>

          <PlaylistPanel
            playing={musicPlaying}
            onToggle={() => setMusicPlaying((p) => !p)}
          />
        </motion.div>

        {/* Right column: Photo strip */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="flex justify-center lg:sticky lg:top-6"
        >
          <PhotoStrip
            photos={photos}
            filters={FILTERS}
            onDelete={handleDelete}
          />
        </motion.div>

      </div>
    </div>
  );
}