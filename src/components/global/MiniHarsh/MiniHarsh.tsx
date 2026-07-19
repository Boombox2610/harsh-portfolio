import React, { useEffect, useRef, useCallback } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '../../../store/usePortfolioStore';
import type { Level, MiniHarshState } from '../../../store/usePortfolioStore';
import './MiniHarsh.css';

// ─── Fast Travel Levels ───────────────────────────────────────────────────────
const FAST_TRAVEL_LEVELS: { label: string; level: Level }[] = [
  { label: '[ 00_Terminal ]', level: 0 },
  { label: '[ 01_The_Spark ]', level: 1 },
  { label: '[ 02_The_Origin ]', level: 2 },
  { label: '[ 03_The_Catalyst ]', level: 3 },
  { label: '[ 04_The_Build ]', level: 4 },
  { label: '[ 05_Contact_Void ]', level: 5 },
];

// ─── CSS Sprite ───────────────────────────────────────────────────────────────
const Sprite: React.FC<{ state: MiniHarshState }> = ({ state }) => {
  return (
    <div className={`mh__sprite mh__sprite--${state.toLowerCase()}`}>
      {state === 'FOLLOW' && (
        <div className="mh__eyes">
          <div className="mh__eye" />
          <div className="mh__eye" />
        </div>
      )}
      {state === 'IDLE' && (
        <div className="mh__eyes mh__eyes--sleepy">
          <div className="mh__eye mh__eye--sleepy" />
          <div className="mh__eye mh__eye--sleepy" />
        </div>
      )}
      {state === 'ALERT' && (
        <>
          <div className="mh__alert-mark">!</div>
          <div className="mh__eyes">
            <div className="mh__eye mh__eye--wide" />
            <div className="mh__eye mh__eye--wide" />
          </div>
        </>
      )}
      {state === 'EXHAUSTED' && (
        <>
          <div className="mh__eyes">
            <div className="mh__eye mh__eye--x">x</div>
            <div className="mh__eye mh__eye--x">x</div>
          </div>
          <div className="mh__pant">z z</div>
        </>
      )}
    </div>
  );
};

// ─── Fast Travel Menu ─────────────────────────────────────────────────────────
const FastTravelMenu: React.FC = () => {
  const setLevel = usePortfolioStore((s) => s.setLevel);
  const setIsPauseMenuOpen = usePortfolioStore((s) => s.setIsPauseMenuOpen);

  const handleNavigate = (level: Level) => {
    setLevel(level);
    setIsPauseMenuOpen(false);
  };

  return (
    <motion.div
      className="mh__menu-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => setIsPauseMenuOpen(false)}
    >
      <motion.div
        className="mh__menu-card"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mh__menu-eyebrow">[ fast travel ]</div>
        <div className="mh__menu-title">Navigate to Era</div>
        <nav className="mh__menu-nav">
          {FAST_TRAVEL_LEVELS.map(({ label, level }) => (
            <button
              key={level}
              className="mh__menu-item"
              onClick={() => handleNavigate(level)}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          className="mh__menu-close"
          onClick={() => setIsPauseMenuOpen(false)}
        >
          [ close ]
        </button>
      </motion.div>
    </motion.div>
  );
};

// ─── Main MiniHarsh Companion ─────────────────────────────────────────────────
const MiniHarsh: React.FC = () => {
  const { 
    miniHarshState, setMiniHarshState, 
    isPauseMenuOpen, setIsPauseMenuOpen,
    setIsContactCardOpen 
  } = usePortfolioStore();

  // Spring physics — sprite trails the cursor
  const springConfig = { stiffness: 120, damping: 20, mass: 1 };
  const springX = useSpring(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    springConfig
  );
  const springY = useSpring(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    springConfig
  );

  // Refs to avoid stale closures
  const stateRef = useRef<MiniHarshState>('FOLLOW');
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPauseOpenRef = useRef(false);
  const idleMouseRef = useRef({ x: 0, y: 0 });

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
  }, []);

  // Sync refs with Zustand state
  useEffect(() => { 
    stateRef.current = miniHarshState; 
    if (miniHarshState === 'EXHAUSTED') {
      clearTimers();
    }
  }, [miniHarshState, clearTimers]);
  useEffect(() => { isPauseOpenRef.current = isPauseMenuOpen; }, [isPauseMenuOpen]);



  // Main mouse tracking state machine
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      const current = stateRef.current;

      // EXHAUSTED — completely locked, ignore all mouse events
      if (current === 'EXHAUSTED') return;
      // Pause menu open — don't track
      if (isPauseOpenRef.current) return;

      if (current === 'IDLE') {
        const dist = Math.hypot(clientX - idleMouseRef.current.x, clientY - idleMouseRef.current.y);
        if (dist < 60) return; // Allow small movements (e.g. to click the sprite) without waking it up

        // Mouse moved significantly while IDLE → trigger ALERT, then transition to FOLLOW after 0.8s
        clearTimers();
        setMiniHarshState('ALERT');
        alertTimerRef.current = setTimeout(() => {
          setMiniHarshState('FOLLOW');
        }, 800);
        return;
      }

      if (current === 'ALERT') {
        // Let the alert timer fire naturally — don't restart
        return;
      }

      // FOLLOW state: track cursor via spring
      springX.set(clientX + 20);
      springY.set(clientY + 20);

      // Reset idle countdown
      clearTimers();
      idleTimerRef.current = setTimeout(() => {
        setMiniHarshState('IDLE');
        idleMouseRef.current = { x: clientX, y: clientY };
      }, 1500);
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      clearTimers();
    };
  }, [clearTimers, setMiniHarshState, springX, springY]);

  const isClickable = miniHarshState === 'IDLE' || miniHarshState === 'EXHAUSTED';
  const isExhausted = miniHarshState === 'EXHAUSTED';

  const spriteStyle = {
    position: 'fixed' as const,
    x: springX,
    y: springY,
    translateX: '-50%',
    translateY: '-50%',
    zIndex: 8000,
    pointerEvents: isClickable ? ('auto' as const) : ('none' as const),
  };

  const handleClick = () => {
    if (isExhausted) {
      setIsContactCardOpen(true);
    } else if (miniHarshState === 'IDLE') {
      setIsPauseMenuOpen(!isPauseMenuOpen);
    }
  };

  return (
    <>
      {/* ── Sprite ─────────────────────────────────────────────────────────── */}
      <motion.div
        className={`mh__wrapper${isClickable ? ' mh__wrapper--clickable' : ''}`}
        style={spriteStyle}
        onClick={handleClick}
      >
        <Sprite state={miniHarshState} />

        {/* IDLE/EXHAUSTED tooltip hint */}
        <AnimatePresence>
          {isClickable && !isPauseMenuOpen && (
            <motion.div
              className="mh__idle-tooltip"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              click
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Fast Travel Menu ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isPauseMenuOpen && <FastTravelMenu />}
      </AnimatePresence>
    </>
  );
};

export default MiniHarsh;
