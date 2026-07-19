# Architecture v2: The Gamified Portfolio

The Harsh Maru portfolio is architected as a **progressive web application** disguised as a multi-era operating system. It follows a strictly controlled "Game Loop" pattern, where the user progresses through discrete levels, each representing a chronological leap in both technology and personal growth.

## 1. Core State Management (The Game Engine)

State is managed globally using **Zustand** (`usePortfolioStore.ts`). This acts as the central engine for the portfolio, tracking the user's progress and enforcing the chronological flow.

```typescript
interface PortfolioState {
  level: Level;                 // Current active level (0 to 5)
  unlockedLevels: Level[];      // Array of levels the user has unlocked
  setLevel: (l: Level) => void; // Transitions the view to a new level
  unlockLevel: (l: Level) => void; // Unlocks a level for direct access
  bootComplete: boolean;        // Tracks if the initial boot sequence has finished
}
```
**Why Zustand?**
- Prevents prop drilling across deeply nested OS window components.
- Allows seamless global transitions (e.g., triggering a "System Shutdown" from a window in Level 2 that updates the global state to transition to Level 3).

## 2. Component Hierarchy & Flow

The application flow is orchestrated by `App.tsx`, which conditionally renders the active level based on the global state.

```mermaid
graph TD
    App[App.tsx (Root Router)]
    App --> L0[Level 0: Terminal]
    App --> L1[Level 1: BIOS TUI]
    App --> L2[Level 2: Retro OS]
    App --> L3[Level 3: Win XP]
    App --> L4[Level 4: Modern Spatial]
    App --> L5[Level 5: Contact Void]
    
    L0 -. "cd 01_the_spark" .-> L1
    L1 -. "[ F10 ] Save & Exit" .-> L2
    L2 -. "Install_System_Update.exe" .-> L3
    L3 -. "System_Upgrade.exe" .-> L4
    L4 -. "Scroll to Bottom" .-> L5
```

## 3. Level Architectures

### Level 0: The Terminal (React + Typewriter)
- **Role:** The entry point. Establishes the hacker/developer persona.
- **Architecture:** Pure functional component utilizing `setTimeout` and `requestAnimationFrame` for pseudo-typing effects. Uses a strictly controlled DOM ref to simulate a command-line interface.

### Level 1: BIOS TUI (Keyboard-driven DOM)
- **Role:** The foundation/childhood era.
- **Architecture:** Implements a global `useEffect` keyboard listener to capture arrow keys and Enter. The UI is a pure HTML/CSS grid mimicking a VGA text-mode interface, bypassing standard mouse interactions to force a retro UX.

### Level 2: Retro OS (Framer Motion + Window Manager)
- **Role:** Early tech journey (Age 8 - 21) & CGPA tracking.
- **Architecture:** A custom micro-window manager.
  - `wins`: Local state object tracking `{ id, isOpen, zIndex, isMinimized, initialX, initialY }` for every window.
  - `DraggableWindow`: A wrapper component utilizing `framer-motion`'s `useDragControls`.
  - Implements a Poolsuite-style minimal bottom taskbar and a functional Recycle Bin.

### Level 3: Win XP (Complex Component Ecosystem)
- **Role:** University, hackathons, and certifications.
- **Architecture:** An evolution of Level 2's window manager.
  - Features deeper component trees within windows (e.g., Masonry grids for media, intricate Acrobat-style PDF viewer for freelance work).
  - Uses absolute positioning mapped to a constrained desktop viewport.

### Level 4: Modern Spatial (Scroll-Driven Storytelling)
- **Role:** Showcase of actual engineering projects (GestoDrive, AI Pin, CalCount, FitCheck, QuadStreamCV).
- **Architecture:** Departs from the OS metaphor into an Apple/Linear-style spatial layout.
  - Uses `framer-motion` `whileInView` triggers for scroll-based micro-animations.
  - Components are deeply modular (e.g., `<ProjectHero>`, `<CSSFlowchart>`).
  - Includes pure HTML/CSS generated diagrams (SDLC, Sequence, Activity) dynamically rendered based on internal state tabs.

### Level 5: Contact Void (Minimalist Physics)
- **Role:** The final call to action.
- **Architecture:** A localized physics/particle background with a centered, absolute-positioned glassmorphism card.

## 4. Asset Pipeline & Rendering Strategy

- **Videos (`.mp4`)**: Loaded locally from `/public/assets/`. Used heavily in Level 4 for high-impact visual proof of hardware projects.
- **Images (`.png`, `.jpeg`)**: Used as distinct window contents in Level 2.
- **CSS Rendering**: Wherever possible, diagrams (like FitCheck architecture) are rendered in pure CSS to maintain crisp scaling, lower payload, and enforce the overarching aesthetic.


window level takeaway
connection year
the build heading
timeline set - application
gdsc age
each age takeaway
image
summary of all - spinal chord