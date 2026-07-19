# UI System v3: The Time-Traveling Interface

The Harsh Maru portfolio UI System is not a single cohesive theme, but rather a **chronological progression of design systems**. It starts from an immersive spatial entry sequence, falls back to raw retro text interfaces, and evolves into a state-of-the-art modern spatial web experience.

## 1. Global Interactions

While each level has its own aesthetic, certain interactions are maintained globally to provide a cohesive experience across the shifting visual paradigms.

- **The Bracket Cursor (`<BracketCursor />`)**: A custom global cursor that replaces the standard pointer on desktop. It tracks the mouse position and dynamically morphs and expands when hovering over interactive elements marked with the `data-cursor-expand="true"` attribute.
- **Micro-interactions**: Hover states uniformly use harsh, high-contrast inversions (e.g., black-on-white turning to white-on-black) to signify actionability without relying on drop shadows in the earlier levels.

## 2. Level-Specific Design Languages

### Init Screen: The Spatial Hub (V3 Addition)
- **Color Palette**: `bg: #050505` (Deep Void), `cards: rgba(20,20,20, 0.95)`.
- **Aesthetic**: Modeled after the "Active Theory" spatial aesthetic. 
- **The Glassmorphism Caveat**: We strictly abandon `backdrop-filter: blur()` and CSS `opacity < 1` for the cards. Applying these filters forces the browser to flatten rendering contexts, which completely destroys `transform-style: preserve-3d` intersection sorting. 
- **2.5D Depth**: Instead of relying on CSS `translateZ` for depth sorting, the system dynamically calculates a strict floating Z-Index based on the user's scroll position, wrapping it in `Math.round()` to explicitly control the stacking contexts. 
- **Parallax Spine**: A vertical structure of glowing neon rings (`.init-screen__spine-container`) that twist and glide in direct proportion to horizontal scroll gestures, creating a localized gravity well.

### Level 0: The Terminal
- **Color Palette**: `bg: #000000`, `text: #E5E5E5`, `accent: #00FF00` (success) / `#FF3333` (error).
- **Typography**: Strictly `Space Mono` or `Courier New`.
- **Aesthetic**: CLI realism. No borders, no shadows. Just text and a blinking cursor (`_`).

### Level 1: BIOS TUI
- **Color Palette**: `bg: #0000AA` (Classic BIOS Blue), `text: #AAAAAA` (Unselected), `text-active: #FFFFFF`, `accent: #55FFFF` (Cyan highlights).
- **Typography**: Monospace, forced uppercase for headers.
- **Layout**: CSS Grid utilized to emulate a character-cell terminal. Hard borders built from ASCII/Unicode characters (`│`, `─`, `┌`).
- **Interaction**: Keyboard only. Mouse interactions are heavily discouraged visually (no cursor changes).

### Level 2: Retro OS (The 'Poolsuite' Era)
- **Color Palette**: 
  - Desktop Background: `#F5D0C5` (Soft vintage pink).
  - Window Chrome: `#E8E8E8` to `#D0D0D0` gradients.
  - Active Titlebar: `#0A246A` to `#3A6EA5` (Classic Win98 Blue).
  - Window Body: `#F5F0E8` (Parchment cream).
- **Typography**: `Arial`, `Tahoma`, `Times New Roman`, `Georgia`.
- **Aesthetic**: Skeuomorphic. Thick, multi-layered borders (`inset` box-shadows) to create 3D bevels. Drop shadows (`rgba(0,0,0,0.25)`) anchor the windows to the flat background.

### Level 3: Win XP (The 'Bliss' Era)
- **Color Palette**: 
  - Desktop Background: Custom `WindowsBlissWallpaper.jpg`.
  - Window Chrome: `#0033CC` (Bright XP Blue) with rounded top corners.
  - Controls: Red close button, silver minimize buttons.
- **Typography**: `Tahoma`, `Trebuchet MS`.
- **Aesthetic**: Late skeuomorphism. The borders are softer, titlebars have distinct gradient shine effects, and the content inside the windows begins to use more modern layouts (e.g., Grid-based Masonry galleries).

### Level 4: Modern Spatial (The Zenith)
- **Color Palette**: `bg: #0A0A0A` (Deep Void), `text: #FAFAFA`, `accent: #FFFFFF` and subtle `#333333` borders.
- **Typography**: `Inter`, `Helvetica Neue`, `Space Mono` (for data/diagrams).
- **Layout**: Centered, highly constrained maximum widths (e.g., `800px` reading width) set against a massive black void. 
- **Aesthetic**: "Show, Don't Tell". Heavy reliance on auto-playing inline `<video>` elements, clean grid-based stat blocks, and pure CSS flowcharts built with 1px borders and dashed lines. Smooth Framer Motion transitions govern scroll behavior.

### Level 5: Contact Void (Minimalist Physics)
- **Role**: The final call to action.
- **Aesthetic**: A localized physics/particle background with a centered, absolute-positioned glassmorphism card.

## 3. The CSS Diagram System (Level 4 Specific)
To avoid muddying the DOM with heavy images for complex architectures, Level 4 utilizes a robust pure CSS node system (`.l4__diagram`, `.l4__diagram-node`, `--input`, `--output`, `--db`). Connectors are drawn with CSS pseudo-elements or absolute positioned borders.

## 4. Scalability & CSS Architecture
All styles are scoped at the component directory level (`Level1_BIOS.css`, `Level2_RetroOS.css`, etc.) using a BEM-like naming convention (e.g., `.l2__window`, `.l4__case-hero-title`). This prevents style leakage across levels without relying on heavy CSS-in-JS libraries.
