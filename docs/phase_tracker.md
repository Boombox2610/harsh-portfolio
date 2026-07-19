# Project Phase Tracker

> Ground truth: `portfolio_idea.md` → Design canon: `docs/ui_system.md` → Architecture: `docs/architecture.md`

---

## Phase Status

| Phase | Level | Description | Status |
|-------|-------|-------------|--------|
| Phase 1 | — | App initialization, Vite scaffold, Zustand store, CSS system, 6 level shells | ✅ Complete |
| Phase 2 | Level 0 | Terminal Emulator (WSL/Ubuntu CLI, command parser, matrix easter egg, CRT transition) | ✅ Complete |
| Phase 3 | Level 1 | BIOS TUI (ASCII double-line frames, interactive Left/Right layout with arrow-key navigation, F10 transition) | ✅ Complete (Jul 7, 2026) |
| Phase 4 | Level 2 | Retro OS Desktop (draggable windows, dithered 8-bit placeholders, installer transition) | ✅ Complete (Jul 7, 2026) |
| Phase 5 | Level 3 | Win XP Environment (taskbar, draggable windows, recycle bin easter egg, XP balloon, shattering transition) | ✅ Complete (Jul 7, 2026) |
| Phase 6 | Level 4 | Modern Spatial Web (case studies, morphing cursor, elastic parallax, glassmorphism confirmation) | ✅ Complete (Jul 7, 2026) |
| Phase 7 | Level 5 | Contact Void (mouse velocity exhaust mechanic, sprite interaction, contact card overlay) | ✅ Complete (Jul 7, 2026) |
| Phase 8 | Global | Mini-Harsh companion (FOLLOW/IDLE/EXHAUSTED/ALERT states, fast-travel pause menu) | ✅ Complete (Jul 7, 2026) |

---

## Phase 2 — Level 0 Terminal Emulator Checklist

- [x] Create `docs/phase_tracker.md`
- [x] Inspect and align `docs/architecture.md` and `docs/ui_system.md` against ground truth
- [x] Implement full command parser (`pwd`, `whoami`, `top`, `ls`, `help`, `clear`, `sudo rm -rf /`, `cd 01_The_Spark`)
- [x] Multi-level `cd` routing: `cd 02_The_Origin` → Level 2, stubs 03/04/05 with locked messages
- [x] `pendingLevel` state so `triggerCrtTransition()` targets correct level dynamically
- [x] `top` — live CPU/memory simulation using `setInterval`, exits on `q`/`Q`/`Escape` via document-level listener
- [x] `sudo rm -rf /` — matrix rain easter egg (3-second green/red descending stream, then reset)
- [x] `cd 01_The_Spark` — prompt confirmation flow → `Y` triggers CRT flicker → Zustand `setLevel(1)`
- [x] Blinking block cursor `█` (CSS `step-end` animation)
- [x] Auto-scroll output to bottom on new output
- [x] `tsc --noEmit` passes with zero errors
- [x] Browser verified: all commands tested, CRT transition confirmed ✅

---

## Level Completion Log

| Level | Completed | Notes |
|-------|-----------|-------|
| Level 0 — Terminal | ✅ 2026-07-06 | Full parser, matrix easter egg, CRT transition to Level 1 |
| Level 1 — BIOS TUI | ✅ 2026-07-07 | Interactive left/right menus, hardware stats, F10 transition |
| Level 2 — Retro OS | ✅ 2026-07-07 | Poolsuite×Win98 full refactor: salmon pink desktop, draggable icons (Framer Motion), dragControls-locked windows, bottom taskbar with clock, top menubar, Recycle Bin with drag-drop detection + witty alerts, Enter-only F10 modal, `cd 02_The_Origin` routing. Integrated actual dithered/scanline photo assets (Age 8 to 17) matching the Poolsuite visual aesthetic. |
| Level 3 — Win XP | ✅ 2026-07-07 | Authentic XP Luna: Bliss wallpaper fallback, vibrant blue titlebars, beige interiors, green Start button. Tabbed GDG window, Acrobat PDF window, Certifications grid. Unstable element shatter transition (Framer Motion volatile scatter + CSS glitch). `cd 03_The_Catalyst` routed. |
| Level 4 — Modern Spatial | ✅ 2026-07-07 | Kalinsky-inspired dark spatial web. Bracket cursor (dynamic padding constraints, mix-blend-mode difference). 4-corner spatial navigation (massive hover typography reveals). Single-column Works stack with cinematic 0.8s cross-fade project transitions. Glassmorphism confirm dialog restyled to pure minimal aesthetic. Flawless light/dark polarity variables. `cd 04_The_Build` routed. |
| Global — MiniHarsh | ✅ 2026-07-07 | 4-state CSS sprite (FOLLOW green/IDLE blue/ALERT yellow/EXHAUSTED red). useSpring trailing physics (stiffness 120, damping 20). IDLE after 1.5s idle, ALERT 0.8s holdback before re-tracking. EXHAUSTED bottom-lock. Kalinsky-style fast-travel pause menu with 6 level shortcuts. Dev hotkey 'E' for exhausted test. |
