import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function FlashEffect({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.7, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, times: [0, 0.1, 0.3, 1] }}
          className="fixed inset-0 z-[200] pointer-events-none bg-white"
        />
      )}
    </AnimatePresence>
  );
}