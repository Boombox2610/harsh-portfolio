import { create } from 'zustand';

export type Level = 0 | 1 | 2 | 3 | 4 | 5;
export type MiniHarshState = 'FOLLOW' | 'IDLE' | 'EXHAUSTED' | 'ALERT';

interface PortfolioState {
  // ─── Level Navigation ────────────────────────────────────────────────────────
  currentLevel: Level;
  setLevel: (level: Level) => void;

  // ─── Mini-Harsh Companion ────────────────────────────────────────────────────
  miniHarshState: MiniHarshState;
  setMiniHarshState: (state: MiniHarshState) => void;

  // ─── Cursor Velocity (px/frame) ──────────────────────────────────────────────
  cursorVelocity: number;
  setCursorVelocity: (velocity: number) => void;

  // ─── Pause Menu (Fast Travel) ────────────────────────────────────────────────
  isPauseMenuOpen: boolean;
  setIsPauseMenuOpen: (open: boolean) => void;

  // ─── Contact Void Card ───────────────────────────────────────────────────────
  isContactCardOpen: boolean;
  setIsContactCardOpen: (open: boolean) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  // Default entry point is Level 0 (Terminal)
  currentLevel: 0,
  setLevel: (level) => set({ currentLevel: level }),

  miniHarshState: 'FOLLOW',
  setMiniHarshState: (state) => set({ miniHarshState: state }),

  cursorVelocity: 0,
  setCursorVelocity: (velocity) => set({ cursorVelocity: velocity }),

  isPauseMenuOpen: false,
  setIsPauseMenuOpen: (open) => set({ isPauseMenuOpen: open }),

  isContactCardOpen: false,
  setIsContactCardOpen: (open) => set({ isContactCardOpen: open }),
}));
