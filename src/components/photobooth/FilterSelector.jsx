import React from 'react';
import { motion } from 'framer-motion';

export default function FilterSelector({ selected, onSelect, filters }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-montserrat text-xs tracking-[0.25em] text-muted-foreground uppercase">Filter</p>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(filters).map(([key, f]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(key)}
            className={`px-2.5 py-1 rounded-full text-xs font-montserrat tracking-wide transition-all duration-300
              ${selected === key
                ? 'bg-wine text-ivory border border-wine-light/50 shadow-lg'
                : 'border border-border text-muted-foreground hover:border-wine/40 hover:text-ivory/70'
              }`}
          >
            {f.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}