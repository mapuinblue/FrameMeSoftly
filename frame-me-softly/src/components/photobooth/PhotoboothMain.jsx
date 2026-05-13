import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import CameraView from './CameraView';
import PhotoStrip from './PhotoStrip';
import FlashEffect from './FlashEffect';
import PlaylistPanel from './PlaylistPanel';

import { FILTERS } from './filters';

import {
  Volume2,
  VolumeX
} from 'lucide-react';

// MUSIC IMPORTS
import song1 from '../../assets/music/Arctic Monkeys - I Wanna Be Yours - (192 Kbps).mp3';
import song2 from '../../assets/music/The Last Shadow Puppets - Sweet Dreams, TN - (128 Kbps).mp3';
import song3 from '../../assets/music/Abby Anderson - If You Killed Somebody - (192 Kbps).mp3';
import song4 from '../../assets/music/Dove Cameron - Whatever You Like (Official Visualizer) - (128 Kbps).mp3';

const PLAYLIST = [
  {
    title: 'I Wanna Be Yours',
    artist: 'Arctic Monkeys',
    src: song1,
    mood: 'Intimate',
  },
  {
    title: 'Sweet Dreams, TN',
    artist: 'The Last Shadow Puppets',
    src: song2,
    mood: 'Dreamy',
  },
  {
    title: 'If You Killed Somebody',
    artist: 'Abby Anderson',
    src: song3,
    mood: 'Tender',
  },
  {
    title: 'Whatever You Like',
    artist: 'Dove Cameron',
    src: song4,
    mood: 'Sultry',
  },
];

export default function PhotoboothMain() {

  // PHOTO STATES
  const [photos, setPhotos] = useState([null, null, null]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [flashActive, setFlashActive] = useState(false);

  // FILTERS
  const [selectedFilter, setSelectedFilter] = useState('vintage-warm');
  const [flashEnabled, setFlashEnabled] = useState(true);

  // MUSIC STATES
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const audioRef = useRef(new Audio());

  // AUDIO SETUP
  useEffect(() => {
    audioRef.current.src = PLAYLIST[currentTrack].src;
    audioRef.current.volume = 0.45;

    if (musicPlaying) {
      audioRef.current.play();
    }
  }, [currentTrack]);

  // AUTONEXT
  useEffect(() => {
    audioRef.current.onended = () => {
      nextTrack();
    };
  }, [currentTrack]);

  // PLAY / PAUSE
  useEffect(() => {
    if (musicPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [musicPlaying]);

  const toggleMusic = async () => {
    if (!musicPlaying) {
      await audioRef.current.play();
      setMusicPlaying(true);
    } else {
      audioRef.current.pause();
      setMusicPlaying(false);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) =>
      (prev - 1 + PLAYLIST.length) % PLAYLIST.length
    );
  };

  // CAMERA
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

                next[idx] = {
                  dataUrl,
                  filter: selectedFilter
                };

                return next;
              });
            }

          }, 300);

        }, 200);

      }

    }, 900);

  }, [
    isCapturing,
    isFull,
    flashEnabled,
    selectedFilter
  ]);

  const handleDelete = (index) => {

    setPhotos((prev) => {

      const next = [...prev];

      next[index] = null;

      return next;
    });
  };

  return (

    <div className="min-h-screen light-leak relative">

      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, hsl(350 40% 12% / 0.8) 0%, hsl(20 15% 5%) 100%)'
        }}
      />

      {/* Flash */}
      <FlashEffect active={flashActive} />

      {/* Countdown */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">

          <motion.div
            key={countdown}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="font-playfair text-9xl text-ivory/90 drop-shadow-2xl"
            style={{
              textShadow:
                '0 0 60px hsl(var(--wine-light))'
            }}
          >
            {countdown}
          </motion.div>

        </div>
      )}

      {/* HEADER */}
      <div className="relative z-10 text-center pt-8 pb-6 px-4">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8
          }}
        >

          <p className="font-montserrat text-gold/70 text-xs tracking-[0.4em] uppercase mb-2">
            Romantic Vintage
          </p>

          <h1 className="font-playfair text-4xl md:text-5xl text-ivory/90 italic">
            Love Photobooth
          </h1>

        </motion.div>

      </div>

      {/* MUSIC BUTTON */}
      <div className="fixed top-6 right-6 z-50">

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMusic}
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

      {/* MAIN */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-center gap-6 px-4 pb-10 max-w-5xl mx-auto">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.9
          }}
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

          <PlaylistPanel
            playlist={PLAYLIST}
            currentTrack={currentTrack}
            setCurrentTrack={setCurrentTrack}
            playing={musicPlaying}
            onToggle={toggleMusic}
            onNext={nextTrack}
            onPrev={prevTrack}
          />

        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.7,
            duration: 0.9
          }}
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