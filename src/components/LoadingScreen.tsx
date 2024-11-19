import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "A penny saved is a penny earned. - Benjamin Franklin",
  "The art is not in making money, but in keeping it. - Proverb",
  "Money is a terrible master but an excellent servant. - P.T. Barnum",
  "Never spend your money before you have earned it. - Thomas Jefferson",
  "The habit of saving is itself an education. - John Poole"
];

export default function LoadingScreen() {
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white z-50 flex items-center justify-center"
      >
        <div className="text-center p-8 max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-xl font-medium text-gray-600 mb-4">{quote}</p>
          </motion.div>
          
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
            />
            
            <div className="w-full bg-gray-200 rounded-full h-2 mt-8">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 text-gray-500"
          >
            Loading your financial dashboard... {progress}%
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}