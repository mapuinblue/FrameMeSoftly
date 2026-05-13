import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

// Ambient romantic audio via Web Audio API (generated tone)
function createAmbientAudio(ctx) {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const reverb = ctx.createConvolver();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(220, ctx.currentTime);
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(330, ctx.currentTime);

  gainNode.gain.setValueAtTime(0.04, ctx.currentTime);

  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc1.start();
  osc2.start();

  return { osc1, osc2, gainNode, stop: () => { osc1.stop(); osc2.stop(); } };
}

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const contextRef = useRef(null);

  const toggle = () => {
    if (!playing) {
      if (!contextRef.current) {
        contextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      audioRef.current = createAmbientAudio(contextRef.current);
      setPlaying(true);
    } else {
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current = null;
      }
      setPlaying(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 rounded-full border border-wine/40 bg-background/60 backdrop-blur-md text-ivory/70 hover:text-gold hover:border-gold/40 transition-all duration-300"
    >
      {playing ? <Volume2 size={14} /> : <VolumeX size={14} />}
      <span className="font-montserrat text-xs tracking-widest">
        {playing ? 'MUSIC ON' : 'MUSIC OFF'}
      </span>
    </motion.button>
  );
}