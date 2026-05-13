import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Heart } from 'lucide-react';
import html2canvas from 'html2canvas';
import PhotoSlot from './PhotoSlot';

export default function PhotoStrip({ photos, filters, onDelete }) {
  const stripRef = useRef(null);
  const isFull = photos.every(Boolean);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownload = async () => {
    if (!stripRef.current) return;
    const canvas = await html2canvas(stripRef.current, {
      scale: 2,
      backgroundColor: '#f9f5ec',
      useCORS: true,
      allowTaint: true,
    });
    const link = document.createElement('a');
    link.download = `our-memories-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Strip container */}
      <div
        ref={stripRef}
        className="relative flex flex-col items-center rounded-sm overflow-hidden"
        style={{
          background: '#f9f5ec',
          padding: '16px 12px 24px',
          width: 220,
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 2px 12px rgba(0,0,0,0.3)',
          border: '1px solid rgba(120,20,30,0.15)',
        }}
      >
        {/* Top decoration */}
        <div className="w-full text-center mb-4 pb-3" style={{ borderBottom: '1px solid rgba(120,20,30,0.2)' }}>
          <div className="flex justify-center items-center gap-1 mb-1">
            <div style={{ width: 20, height: 1, background: 'hsl(var(--wine) / 0.5)' }} />
            <span style={{ color: 'hsl(var(--wine))', fontSize: 10 }}>♥</span>
            <div style={{ width: 20, height: 1, background: 'hsl(var(--wine) / 0.5)' }} />
          </div>
          <p className="font-playfair italic" style={{ fontSize: 14, color: 'hsl(var(--wine))', letterSpacing: '0.05em' }}>
            Love Photobooth
          </p>
          <p style={{ fontSize: 8, color: '#7a5c60', letterSpacing: '0.2em', marginTop: 2, fontFamily: 'Montserrat, sans-serif' }}>
            OUR MEMORIES
          </p>
        </div>

        {/* Photo slots */}
        <div className="flex flex-col gap-3 w-full">
          {photos.map((photo, i) => (
            <PhotoSlot
              key={i}
              index={i}
              photo={photo}
              filters={filters}
              onDelete={onDelete}
            />
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="w-full text-center mt-4 pt-3" style={{ borderTop: '1px solid rgba(120,20,30,0.2)' }}>
          <p style={{ fontSize: 7, color: '#7a5c60', letterSpacing: '0.15em', fontFamily: 'Montserrat, sans-serif' }}>
            {today}
          </p>
          <p className="font-playfair italic" style={{ fontSize: 9, color: '#8b3a4a', marginTop: 2 }}>
            "Forever & Always"
          </p>
          <div style={{ marginTop: 4, color: 'hsl(var(--wine))', fontSize: 8, letterSpacing: '0.3em' }}>
            ✦ ✦ ✦
          </div>
        </div>

        {/* Sprocket holes (decorative) */}
        <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-around py-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-background/70" style={{ border: '1px solid rgba(120,20,30,0.2)' }} />
          ))}
        </div>
        <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-around py-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-background/70" style={{ border: '1px solid rgba(120,20,30,0.2)' }} />
          ))}
        </div>
      </div>

      {/* Download button */}
      <AnimatePresence>
        {isFull && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleDownload}
              className="btn-elegant flex items-center gap-2 px-6 py-3 rounded-xl font-playfair italic text-base"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--wine-dark)), hsl(var(--wine)), hsl(var(--wine-light)))',
                color: 'hsl(var(--ivory))',
                boxShadow: '0 4px 30px hsl(var(--wine) / 0.4), 0 0 60px hsl(var(--wine) / 0.15)',
              }}
            >
              <Download size={16} />
              Download Our Memories
            </motion.button>
            <p className="font-cormorant italic text-muted-foreground text-sm flex items-center gap-1">
              <Heart size={10} className="text-wine-light" />
              Your strip is ready, my love
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}