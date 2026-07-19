# Portfolio Architecture



## Tech Stack

- **Framework:** React + Vite (Fast builds, easy static deployment for zero hosting cost on Vercel/Netlify/GitHub Pages).

- **Language:** TypeScript (for robust type safety and autocompletion).

- **Styling:** Vanilla CSS (as per strict instructions, for maximum control and performance).

- **Animations & Physics:** Framer Motion (for fluid page wipes, draggable windows, elastic scroll effects, and spatial interactions).

- **State Management:** Zustand (lightweight and perfect for handling global state like the Mini-Harsh companion and active level tracking without context boilerplate).

- **Routing:** React Router v6 (for structural routing between levels if needed, though state-based conditional rendering will be primary for seamless transitions).



## Directory Roadmap



```

src/

├── assets/                  # Media files

│   ├── images/

│   ├── videos/

│   └── documents/

├── components/              # Modularized UI

│   ├── global/              # Persistent components

│   │   └── MiniHarsh/

│   ├── levels/              # The 6 Distinct Eras

│   │   ├── Level0_Terminal/

│   │   ├── Level1_Bios/

│   │   ├── Level2_RetroOS/

│   │   ├── Level3_WinXP/

│   │   ├── Level4_ModernSpatial/

│   │   └── Level5_ContactVoid/

│   ├── shared/              # Reusable UI elements

│   │   ├── DraggableWindow.tsx

│   │   ├── TerminalParser.tsx

│   │   └── AsciiFrame.tsx

├── store/                   # Zustand state

│   └── usePortfolioStore.ts

├── styles/                  # Vanilla CSS ecosystem

│   ├── global.css

│   ├── variables.css

│   └── animations.css

├── utils/                   # Helpers and hooks

│   ├── constants.ts

│   └── useMouseVelocity.ts

├── App.tsx

└── main.tsx

```



## State Management Architecture (Zustand)

```typescript

interface PortfolioState {

  currentLevel: number;

  setLevel: (level: number) => void;

  miniHarshState: 'FOLLOW' | 'IDLE' | 'EXHAUSTED' | 'ALERT';

  setMiniHarshState: (state: 'FOLLOW' | 'IDLE' | 'EXHAUSTED' | 'ALERT') => void;

  cursorVelocity: number;

  setCursorVelocity: (velocity: number) => void;

  // Extensible for future global states

}
```

Running:
