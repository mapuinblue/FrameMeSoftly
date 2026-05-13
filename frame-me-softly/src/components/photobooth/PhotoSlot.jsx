import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function PhotoSlot({ index, photo, filters, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      style={{
        width: '100%',
        aspectRatio: '4/3',
        background: photo ? 'transparent' : 'rgba(120,20,30,0.06)',
        border: photo ? 'none' : '1px dashed rgba(120,20,30,0.25)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence mode="wait">
        {photo ? (
          <motion.div
            key={`photo-${index}`}
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full h-full"
          >
            <img
              src={photo.dataUrl}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ filter: filters[photo.filter]?.css || 'none' }}
            />

            {/* Filter overlay */}
            {filters[photo.filter]?.overlay && (
              <div
                className="absolute inset-0 mix-blend-multiply"
                style={{ background: filters[photo.filter].overlay }}
              />
            )}

            {/* Vintage vignette */}
            <div className="absolute inset-0" style={{
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)',
            }} />

            {/* Delete button */}
            <AnimatePresence>
              {hovered && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => onDelete(index)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center z-20"
                  style={{
                    background: 'rgba(120,20,30,0.85)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <X size={10} color="white" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Filter label badge */}
            <div className="absolute bottom-1 left-1.5">
              <span style={{
                fontSize: 6,
                fontFamily: 'Montserrat, sans-serif',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                {filters[photo.filter]?.label}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`empty-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-center gap-1 breathe"
          >
            <span style={{ fontSize: 16, color: 'rgba(120,20,30,0.3)' }}>♥</span>
            <p style={{
              fontSize: 8,
              color: 'rgba(120,20,30,0.4)',
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              Photo {index + 1}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}