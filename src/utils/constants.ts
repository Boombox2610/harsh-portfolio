/**
 * Application-wide constants.
 * Add level metadata and shared configuration here as the project scales.
 */

export const LEVEL_NAMES: Record<number, string> = {
  0: 'Terminal',
  1: 'The Spark',
  2: 'The Origin',
  3: 'The Catalyst',
  4: 'The Build',
  5: 'The Next Node',
};

export const TOTAL_LEVELS = 6;

/** Mobile breakpoint (px) below which complex UI degrades to read-only scroll */
export const MOBILE_BREAKPOINT = 768;

/** Idle timeout in ms before Mini-Harsh switches from FOLLOW → IDLE */
export const MINI_HARSH_IDLE_TIMEOUT_MS = 1500;

/** Level 5: required velocity-over-time duration before EXHAUSTED state */
export const MINI_HARSH_EXHAUST_DURATION_MS = 2000;
