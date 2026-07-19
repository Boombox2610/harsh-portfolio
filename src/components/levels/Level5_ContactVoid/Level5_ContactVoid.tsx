import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '../../../store/usePortfolioStore';
import './Level5_ContactVoid.css';

const Level5_ContactVoid: React.FC = () => {
  const setMiniHarshState = usePortfolioStore((s) => s.setMiniHarshState);
  const isContactCardOpen = usePortfolioStore((s) => s.isContactCardOpen);
  const setIsContactCardOpen = usePortfolioStore((s) => s.setIsContactCardOpen);
  const setCursorVelocity = usePortfolioStore((s) => s.setCursorVelocity);
  
  const lastMousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);
  const currentPos = useRef({ x: 0, y: 0 });
  const movementHistory = useRef<{ time: number; dist: number }[]>([]);

  useEffect(() => {
    // Basic mouse tracking for velocity
    const handleMouseMove = (e: MouseEvent) => {
      currentPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        currentPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    const trackVelocity = () => {
      const now = performance.now();
      const dx = currentPos.current.x - lastMousePos.current.x;
      const dy = currentPos.current.y - lastMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      movementHistory.current.push({ time: now, dist });
      
      // Remove elements older than 2 seconds
      while (movementHistory.current.length > 0 && now - movementHistory.current[0].time > 2000) {
        movementHistory.current.shift();
      }
      
      const totalDist = movementHistory.current.reduce((acc, curr) => acc + curr.dist, 0);
      
      setCursorVelocity(dist);
      
      const currentState = usePortfolioStore.getState().miniHarshState;
      if (currentState !== 'EXHAUSTED') {
        // Require 4000 pixels of total movement within 2 seconds
        if (totalDist > 4000) {
          setMiniHarshState('EXHAUSTED');
          movementHistory.current = []; // Clear history so it doesn't re-trigger instantly if the user closes it
        }
      }
      
      lastMousePos.current = { x: currentPos.current.x, y: currentPos.current.y };
      rafId.current = requestAnimationFrame(trackVelocity);
    };
    
    rafId.current = requestAnimationFrame(trackVelocity);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [setCursorVelocity, setMiniHarshState]);


  return (
    <div className="l5">
      <AnimatePresence mode="wait">
        {!isContactCardOpen ? (
          <motion.div 
            key="hint"
            className="l5__hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
          >
            [ Want to connect? Catch me if you can. ]
          </motion.div>
        ) : (
          <motion.div
            key="card"
            className="l5__card-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="l5__card">
              <button 
                className="l5__card-close" 
                onClick={() => {
                  setIsContactCardOpen(false);
                  setMiniHarshState('FOLLOW');
                }} 
                data-cursor-expand="true"
              >
                [ close ]
              </button>
              <h1 className="l5__card-title">Ready to build the future?</h1>
              <div className="l5__card-links">
                <a href="mailto:harshmaru2610@gmail.com" className="l5__link" data-cursor-expand="true">[ Email ]</a>
                <a href="https://www.linkedin.com/in/harsh-maru2610/" target="_blank" rel="noopener noreferrer" className="l5__link" data-cursor-expand="true">[ LinkedIn ]</a>
                <a href="https://github.com/Boombox2610" target="_blank" rel="noopener noreferrer" className="l5__link" data-cursor-expand="true">[ GitHub ]</a>
              </div>
              <a href="/assets/Harsh_Maru_CV.pdf" target="_blank" rel="noopener noreferrer" className="l5__link-primary" data-cursor-expand="true">[ Download CV ]</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Level5_ContactVoid;
