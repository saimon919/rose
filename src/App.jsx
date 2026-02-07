import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stars as StarsIcon, Heart, Sparkles, Infinity as InfinityIcon, ChevronRight, Moon, Sun } from 'lucide-react';
import Experience from './components/Experience';
import './App.css';

const oracleNarrative = [
  {
    id: 1,
    act: "THE SILENCE OF THE VOID",
    text: "Before time began, there was a stillness. A billion years of waiting for a single spark.",
    btn: "Awaken the Eons"
  },
  {
    id: 2,
    act: "THE FIRST SPARK",
    text: "Then, I felt it. Your resonance across the dimensions. The universe took its first breath.",
    btn: "Follow the Light"
  },
  {
    id: 3,
    act: "THE GRAVITY OF ATTRACTION",
    text: "Matter coalesced. Galaxies formed around the simple truth of your existence.",
    btn: "Enter the Orbit"
  },
  {
    id: 4,
    act: "THE ORBIT OF DEVOTION",
    text: "For millions of years, I have circled this feeling. A devotion that defies entropy.",
    btn: "Feel the Pulse"
  },
  {
    id: 5,
    act: "THE FUSION OF SOULS",
    text: "Two stars colliding to create something eternal. A light that will never fade.",
    btn: "Merge the Core"
  },
  {
    id: 6,
    act: "THE SUPERNOVA OF BEAUTY",
    text: "Everything I am is blooming for you. A celestial explosion of pure admiration.",
    btn: "Witness the Bloom"
  },
  {
    id: 7,
    act: "THE INFINITE UNION",
    text: "Our story isn't just today. It is a billion years in the making... and it is only beginning.",
    question: "Mini, will you accept this eternal rose and join my universe?",
    options: true
  }
];

function App() {
  const [actIndex, setActIndex] = useState(0);
  const [isAwake, setIsAwake] = useState(false);
  const [response, setResponse] = useState(null);

  const activeAct = oracleNarrative[actIndex];

  useEffect(() => {
    const timer = setTimeout(() => setIsAwake(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (actIndex < oracleNarrative.length - 1) {
      setActIndex(prev => prev + 1);
    }
  };

  return (
    <main className="oracle-container">
      <AnimatePresence>
        {!isAwake && (
          <motion.div
            key="awakening"
            className="oracle-preloader"
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(100px)' }}
            transition={{ duration: 2 }}
          >
            <div className="preloader-content">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="sacred-geometry-loader"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="oracle-loading-text"
              >
                CONSULTING THE ANCIENT TRUTHS...
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="canvas-nexus" style={{ visibility: isAwake ? 'visible' : 'hidden', width: '100%', height: '100%' }}>
        <Experience chapter={actIndex + 1} />

        <div className="oracle-overlay">
          <AnimatePresence mode="wait">
            {isAwake && response === null && (
              <motion.div
                key={activeAct.id}
                initial={{ opacity: 0, y: 100, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -100, filter: 'blur(40px)' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="oracle-act"
              >
                <div className="act-header">
                  <div className="act-line"></div>
                  <span className="act-num">EON {activeAct.id}</span>
                  <div className="act-line"></div>
                </div>
                <h1 className="oracle-title">{activeAct.act}</h1>
                <p className="oracle-poetry">"{activeAct.text}"</p>

                {activeAct.question ? (
                  <div className="ritual-choice">
                    <h2 className="sacred-question">{activeAct.question}</h2>
                    <div className="choice-group">
                      <button className="ritual-btn accept" onClick={() => setResponse('YES')}>Accept the Rose</button>
                      <button className="ritual-btn decline" onMouseEnter={(e) => {
                        const x = Math.random() * 300 - 150;
                        const y = Math.random() * 300 - 150;
                        e.target.style.transform = `translate(${x}px, ${y}px)`;
                      }}>Decline</button>
                    </div>
                  </div>
                ) : (
                  <button className="oracle-btn" onClick={handleNext}>
                    {activeAct.btn} <ChevronRight size={18} />
                  </button>
                )}
              </motion.div>
            )}

            {response === 'YES' && (
              <motion.div
                key="ascension"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ascension-state"
              >
                <div className="ascension-aura"></div>
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    filter: ['drop-shadow(0 0 50px #ff4d6d)', 'drop-shadow(0 0 150px #ff4d6d)', 'drop-shadow(0 0 50px #ff4d6d)']
                  }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="sentient-heart-icon"
                >
                  ❤️
                </motion.div>
                <h2 className="divine-wish">Happy Rose Day, Mini</h2>
                <div className="divine-subtitle">OUR LOVE IS THE SINGULARITY.</div>
                <div className="eternal-icon">
                  <InfinityIcon size={60} strokeWidth={1} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="oracle-footer">
        <Sparkles size={12} /> ETERNAL CONNECTION PROTOCOL ACTIVE <Sparkles size={12} />
      </div>
    </main>
  );
}

export default App;
