import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './BracketCursor.css';

const BracketCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 40, h: 20 });
  const [visible, setVisible] = useState(false);
  const rafId = useRef(0);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
        if (!visible) setVisible(true);

        // Check if hovering an interactive element
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target) {
          const interactive = target.closest('[data-cursor-expand]');
          if (interactive) {
            const expandType = interactive.getAttribute('data-cursor-expand');
            const padding = expandType === 'small' ? 4 : 12;
            const rect = interactive.getBoundingClientRect();
            setSize({ w: rect.width + padding, h: rect.height + padding });
            setPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            return;
          }
        }
        setSize({ w: 40, h: 20 });
      });
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <motion.div
      className="bracket-cursor"
      animate={{
        x: pos.x - size.w / 2,
        y: pos.y - size.h / 2,
        width: size.w,
        height: size.h,
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.4 }}
    >
      <div className="bracket-cursor-corner bracket-cursor-corner--tl" />
      <div className="bracket-cursor-corner bracket-cursor-corner--tr" />
      <div className="bracket-cursor-corner bracket-cursor-corner--bl" />
      <div className="bracket-cursor-corner bracket-cursor-corner--br" />
    </motion.div>
  );
};

export default BracketCursor;
