# UI System & Guidelines



## Core Aesthetics & Rules

- **Global Theme:** Deep Dark Mode.

- **Background Range:** `#050505` to `#0A0A0A`.

- **Typography:** Custom, crisp, modern structural typography.

- **Strict Visual Constraint:** Absolutely no musical elements, audio-player UI metaphors, or music notes anywhere in the interface. Focus strictly on structural layout, custom typography, and visual geometry.



## Level-Specific UI Guidelines



### Level 0 (Terminal)

- **Colors:** Background `#0C0C0C`, Text `#E0E0E0`, Prompts `#4E9A06`, Directories `#3465A4`.

- **Elements:** Blinking block cursor `█`. Classic CLI aesthetic.

- **Interactions:** Robust CLI parser. Easter egg for `sudo rm -rf /`.



### Level 1 (The Spark - BIOS TUI)

- **Colors:** Background `#0000AA` (BIOS Blue), Text `#AAAAAA`, Highlight `#00AAAA` or `#FFFF55`.

- **Typography:** Retro DOS VGA font layout.

- **Elements:** CSS text borders (`═`, `║`, `╔`, `╗`).



### Level 2 (The Origin - Retro OS)

- **Colors:** Background `#008080` (Teal), Windows `#C0C0C0` (Silver), Title bars `#000080` (Navy).

- **Elements:** 3D bevel box-shadows, draggable windows.

- **Media:** Dithered, grainy, 8-bit style placeholders or ASCII graphics.



### Level 3 (The Catalyst - Win XP)

- **Colors:** Midnight stylized night-time rolling hills background, Taskbar `#1C1C1C`.

- **Elements:** Classic XP software app mimicry (active title bars, close buttons).

- **Interactions:** Functional recycle bin, draggable desktop icons.



### Level 4 (The Build - Modern Spatial Web)

- **Style:** Hyper-modern, luxury spatial web design. Minimalist, clean grids, generous whitespace.

- **Typography:** Stark, bold structural text.

- **Motion:** Fluid page-wipe transitions, custom interactive morphing cursor, scroll-linked parallax elasticity, tactile physics weight.



### Level 5 (The Next Node - Contact Void)

- **Style:** Absolute dark minimalist void. Focus on the core project mascot (Mini-Harsh).



## Mobile Degradation Strategy

- **Trigger:** Viewports `< 768px`.

- **Strategy:** Degrade complex UI into a clean, vertical, scrollable "read-only" stack.

- Preserve the deep dark theme, typography, and metrics.

- Disable draggable window instances and complex parallax/elastic mechanics.



## Asset Management Placeholder Logic

Use semantic placeholder HTML divs with clear text labels (e.g., `[PLACEHOLDER: AI Pin Architecture SVG]`) for missing media in the `/public/assets/` directory. No third-party URL placeholders.