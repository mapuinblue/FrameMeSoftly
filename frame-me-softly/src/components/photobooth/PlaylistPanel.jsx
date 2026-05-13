import React from 'react';
import { motion } from 'framer-motion';
import {
  Music2,
  Heart
} from 'lucide-react';

const PLAYLIST = [
  {
    id: 1,
    title: 'I Wanna Be Yours',
    artist: 'Arctic Monkeys',
    mood: 'Intimate',
    duration: '3:03',
  },
  {
    id: 2,
    title: 'Sweet Dreams, TN',
    artist: 'The Last Shadow Puppets',
    mood: 'Dreamy',
    duration: '3:41',
  },
  {
    id: 3,
    title: 'If You Killed Somebody',
    artist: 'Abby Anderson',
    mood: 'Bittersweet',
    duration: '3:12',
  },
  {
    id: 4,
    title: 'Whatever You Like',
    artist: 'Dove Cameron',
    mood: 'Seductive',
    duration: '3:08',
  },
];

const MOOD_COLORS = {
  Intimate: '#b05468',
  Dreamy: '#9b72b0',
  Bittersweet: '#a07070',
  Seductive: '#b07040',
};

export default function PlaylistPanel() {
  return (
    <div className="w-full flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gold/20" />

        <Music2 size={12} className="text-gold/70" />

        <p className="font-playfair italic text-xs text-ivory/70">
          Our Soundtrack
        </p>

        <div className="flex-1 h-px bg-gold/20" />
      </div>

      {/* Playlist Container */}
      <div
        className="rounded-2xl overflow-hidden backdrop-blur-xl"
        style={{
          background: 'rgba(20, 6, 8, 0.78)',
          border: '1px solid rgba(120, 40, 55, 0.25)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
        }}
      >

        {/* Top label */}
        <div className="px-4 py-3 border-b border-white/5">
          <p
            className="font-montserrat tracking-[0.25em] text-[9px] text-ivory/35"
          >
            CURATED FOR ESTEBAN
          </p>
        </div>

        {/* Songs */}
        <div className="flex flex-col">

          {PLAYLIST.map((song, index) => (
            <motion.div
              key={song.id}
              whileHover={{
                backgroundColor: 'rgba(255,255,255,0.03)',
              }}
              className={`px-4 py-3 flex items-center gap-3 transition-all duration-300 ${
                index !== PLAYLIST.length - 1
                  ? 'border-b border-white/5'
                  : ''
              }`}
            >

              {/* Left number */}
              <div className="w-6 flex justify-center">
                <span className="text-[10px] text-ivory/30 font-montserrat tracking-widest">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Song info */}
              <div className="flex-1 min-w-0">

                <p className="font-playfair italic text-sm text-ivory truncate">
                  {song.title}
                </p>

                <p className="text-[9px] tracking-[0.12em] uppercase text-ivory/40 font-montserrat truncate">
                  {song.artist}
                </p>

              </div>

              {/* Mood */}
              <div
                className="px-2 py-1 rounded-full border"
                style={{
                  borderColor: `${MOOD_COLORS[song.mood]}55`,
                  background: `${MOOD_COLORS[song.mood]}15`,
                }}
              >
                <span
                  className="text-[8px] tracking-[0.14em] uppercase font-montserrat"
                  style={{
                    color: MOOD_COLORS[song.mood],
                  }}
                >
                  {song.mood}
                </span>
              </div>

              {/* Duration */}
              <div className="w-10 text-right">
                <span className="text-[8px] text-ivory/30 font-montserrat">
                  {song.duration}
                </span>
              </div>

            </motion.div>
          ))}

        </div>
      </div>

      {/* Bottom quote */}
      <div className="flex items-center justify-center gap-2 pt-1">

        <Heart
          size={10}
          className="text-wine-light/60"
          fill="currentColor"
        />

        <p className="font-cormorant italic text-xs text-ivory/35">
          every memory deserves a soundtrack
        </p>

      </div>

    </div>
  );
}