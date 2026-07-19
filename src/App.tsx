import React, { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolioStore } from './store/usePortfolioStore';
import MiniHarsh from './components/global/MiniHarsh';
import InitScreen from './components/levels/InitScreen/InitScreen';
import './styles/global.css';

// ── Lazy-load each level to keep the initial bundle minimal ─────────────────
const Level0_Terminal     = lazy(() => import('./components/levels/Level0_Terminal'));
const Level1_Bios         = lazy(() => import('./components/levels/Level1_Bios'));
const Level2_RetroOS      = lazy(() => import('./components/levels/Level2_RetroOS'));
const Level3_WinXP        = lazy(() => import('./components/levels/Level3_WinXP'));
const Level4_ModernSpatial = lazy(() => import('./components/levels/Level4_ModernSpatial'));
const Level5_ContactVoid  = lazy(() => import('./components/levels/Level5_ContactVoid'));

/**
 * Maps a level number to its corresponding lazy-loaded component.
 */
const LEVEL_MAP: Record<number, React.ReactNode> = {
  0: <Level0_Terminal />,
  1: <Level1_Bios />,
  2: <Level2_RetroOS />,
  3: <Level3_WinXP />,
  4: <Level4_ModernSpatial />,
  5: <Level5_ContactVoid />,
};

/**
 * Fallback displayed while a level chunk is loading.
 */
const LevelFallback: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100dvh',
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Courier New', monospace",
      color: '#4E9A06',
      fontSize: '0.875rem',
      letterSpacing: '0.1em',
    }}
  >
    LOADING...
  </div>
);

/**
 * App — Root shell
 *
 * Responsibilities:
 *  1. Read `currentLevel` from Zustand and conditionally render the active level.
 *  2. Wrap transitions in Framer Motion AnimatePresence for seamless swaps.
 *  3. Mount the persistent MiniHarsh companion above all level content.
 */
const App: React.FC = () => {
  const currentLevel = usePortfolioStore((s) => s.currentLevel);
  const hasSelectedMode = usePortfolioStore((s) => s.hasSelectedMode);

  if (!hasSelectedMode) {
    return <InitScreen />;
  }

  return (
    <>
      {/* ── Active Level ───────────────────────────────────────────────────── */}
      <Suspense fallback={<LevelFallback />}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLevel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          >
            {LEVEL_MAP[currentLevel] ?? <LevelFallback />}
          </motion.div>
        </AnimatePresence>
      </Suspense>

      {/* ── Global Persistent Companion ────────────────────────────────────── */}
      <MiniHarsh />
    </>
  );
};

export default App;
