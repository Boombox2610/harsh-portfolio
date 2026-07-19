System Role & Objective:
You are an elite Frontend Architect and UI/UX Visionary. We are building a deeply interactive, narrative-driven portfolio website for a Creative, Computer Engineering & AI/ML developer. The application acts as a timeline of UI evolution, transitioning the user through 6 distinct eras of computing (from a WSL Terminal up to a hyper-modern Spatial Web experience).

Your Autonomy (Tech Stack & UI/UX):
I want to leverage your absolute maximum architectural capabilities. I will provide the conceptual narrative and the thematic requirements. You will dictate the optimal tech stack, component structure, libraries, and exact UI execution to make this highly performant, fully accessible, and visually stunning, while requiring low to no hosting or maintenance costs.

Note on Aesthetics & Rules:
1. Global Baseline: Deep dark mode ( #050505 to #0A0A0A). It must feel minimalist, proportional, and cinematic.
2. Strict Visual Constraint: You are strictly forbidden from utilizing any musical elements, audio-player UI metaphors, or music notes anywhere in the interface, even inside event folders or audio-adjacent components. The design must rely entirely on structural layout, custom typography, and crisp visual geometry. Auditorial elements will be added later on.

The Documentation Protocol (Long-Term Memory):
To ensure we do not lose context or waste tokens as this project scales, you must establish and maintain a "docs/" directory containing highly detailed markdown (.md) files (e.g., architecture.md, state_management.md, ui_system.md). These files will serve as your long-term memory. You must update them as we make decisions or add components.

Architecture & Asset Directives:
1. Component Isolation: You must strictly modularize the application. Create a dedicated "src/components/levels/" directory. Each level must be a standalone, self-contained component to prevent single-file bloat.
2. Asset Management: For all requested media (whatCode_freelance.pdf, drone flight videos, hardware photos, architecture diagrams), assume they will live inside the "/public/assets/" directory. Use semantic placeholder HTML divs with clear text labels (e.g., "[PLACEHOLDER: AI Pin Architecture SVG]") until the actual files are placed. Do not load external placeholder images from third-party URLs.

Mobile Strategy:
The spatial and draggable OS experiences are built for desktop viewports. On viewport widths below 768px, automatically and gracefully degrade the complex UI into a clean, vertical, scrollable "read-only" stack. Preserve the deep dark theme, metrics, and typography, but disable the draggable window instances and complex parallax/elastic mechanics for mobile devices. 

-------------------------------------------------------------------
THE NARRATIVE ROADMAP (THE 6 LEVELS)
-------------------------------------------------------------------

Level 0 (Terminal): 
A raw, interactive command-line emulator built to mirror a classic WSL or Ubuntu Linux terminal environment.
• Theme/Colors: Background example: #0C0C0C, Text #E0E0E0, User Prompt #4E9A06, Directories #3465A4 (or whichever terminal theme looks the most premium). Blinking block cursor █.
• Interactive Logic: Support a robust terminal parser executing the following terminal commands:
  - pwd: Outputs "/home/hmaru/portfolio"
  - whoami: Outputs "Harsh Maru - Architecting Intelligence & Design"
  - top: Simulates a brief live CPU/memory task manager printout.
  - ls: Outputs "01_The_Spark  02_The_Origin  03_The_Catalyst  04_The_Build  05_Contact"
  - help: Prints available commands (pwd, top, ls, cd, whoami, clear, rm).
  - sudo rm -rf /: Easter egg. Triggers a red, descending text matrix stream for 3 seconds before resetting.
  - cd [dir]: The level transition trigger.
• Transition: Typing "cd 01_The_Spark" outputs "INITIATING TUI PROTOCOL. EXECUTE? [Y/n]". Pressing 'Y' unmounts the component with a sudden CRT monitor screen flicker.

Level 1 - THE SPARK (BIOS TUI):
A 90s ASCII hardware diagnostic screen showing systemic roots and a core AI/ML philosophy.
• Theme/Colors: Background #0000AA (Classic BIOS Blue), Text #AAAAAA, Active/Highlight #00AAAA or #FFFF55. Font: Retro DOS VGA font layout.
• UI Specifics: Use CSS text borders to render ASCII-style double-line frames (═, ║, ╔, ╗). Support keyboard arrow-key navigation for a left menu tracking milestones.Support both arrow-key navigation (up/down) and click-to-select for switching content, with a distinct highlight style for the active section.
• Content:
  - Hardware Diagnostics Readout: Simulates a hardware check listing core stats:
    * USER_NAME: Harsh Maru
    * ARCHITECTURE: B.Tech Integrated Computer Engineering (NMIMS MPSTME)
    * UPTIME: 20 Years
    * BASE_LOCATION: Mumbai, IND
    * PRIMARY_SKILLS: System Architecture, Computer Vision, Machine Learning, Artificial Intelligence, GenAI, Scikit-Learn, HCI, Microservices, Kubernetes, LLMs, Fine Tuning, QLoRA, Supabase, PostgreSQL, FastAPI, RabbitMQ, Redis, CQRS, Docker, IBM Watson, Power BI, ArcGIS, Android Studio, Ubuntu, ROS, GCP, ArduPilot, Mission Planner, Drone Piloting, Arduino, IoT, Robotics Automation, Adobe Creative Suite, Figma.
    * SECONDARY_SKILLS: Team Leadership, Project Planning, Public Speaking, Teamwork, Collaboration, Event Logistics, Event Management, Design Team, Creative Content Creation.
    * HOBBIES: Guitar_Audio_Processing, Pilot drones, Music, Gym
  - The Philosophy (The Kernel): Placed beneath the stats as the "Core Operating Principle": "My journey in AI/ML is driven by a single philosophy: shifting the standards from making humans adapt to technology, to engineering smart systems that adapt to human needs. Machine learning is the ultimate tool for creative problem-solving."
  - Early Boot Logs: A rapid scrolling list of early "firsts": "[OK] Loading Flip Book Animations... [OK] Initializing Paint 3D... [OK] Compiling first Scratch game... [OK] Executing Java/Python basics... [OK] Refining Adobe Suite... [OK] Deploying MicroServices..."
• Transition: A flashing bottom action bar: "[F10] EXECUTE GUI.EXE". Pressing F10 triggers an ASCII warning modal: "Overriding text interface. Proceed? (Y/N)". Confirming triggers a screen wipe directly into Level 2.

Level 2 - THE ORIGIN (Retro OS):
A classic 90s/early 2000s draggable window desktop environment following a clean, dark Poolsuite.net aesthetic. The loading sequence features a single window at the center with a blocky, mechanical progress bar.
• Theme/Colors: Background #008080 (Teal modern-edited into a deep charcoal variation), Windows #C0C0C0 (Silver), Title bars #000080 (Navy Blue). All elements must utilize crisp 3D bevel box-shadows and be draggable. 
• Design Constraint: Mimic the vintage window layouts of Poolsuite (e.g., retro event calendars, guestbooks), but you are strictly forbidden from including any "Mixtape" or audio-player interfaces.
• Interface Content: Clicking icons opens distinct, styled, draggable window frames. Every window must include a dithered, grainy, 8-bit style placeholder image or ASCII graphic to keep content rich and visual:
  - Age 8: Drawing and art craft. [Visual: Dithered, low-res MS Paint style graphic]
  - Age 10: Flip book animations. [Visual: Grainy, pixelated sequence of sketches]
  - Age 11: Paint 3D (image editing), Roblox games, Scratch games. [Visual: Pixelated 90s block-game graphic]
  - Age 14: Discovering Java and Python. [Visual: Retro terminal ASCII art]
  - Age 17: Mastering Adobe Illustrator and building Python projects. [Visual: 90s-style rendering progress bar graphic]
  - Age 15 - 21 (MPSTME NMIMS University): A scrolling file viewer window displaying academic consistency by semester: Sem 1 (3.71), Sem 2 (3.72), Sem 3 (3.46), Sem 4 (3.55), Sem 5 (3.57), Sem 6 (3.55), Sem 7 (3.54), Sem 8 (3.48), Sem 9 (3.49), Sem 10 (3.52). Bottom note: "2 sems left."
• Transition: A distinct desktop installer icon named "Install_System_Update.exe". Confirming its execution triggers a sleek "Shutting down..." screen overlay fading to black.

Level 3 - THE CATALYST (Win XP):
A midnight, dark-themed Windows XP Luna OS environment focused on leadership, scaling, and communities.
• Theme/Colors: Desktop wallpaper is a moody, stylized night-time rolling hills edit. Taskbar is #1C1C1C (Charcoal) with a blue Start button (or customized to look optimally premium).
• UI Specifics: Includes a bottom taskbar with a live system clock. Double-clicking desktop icons launches custom draggable windows built to mimic classic XP software apps (e.g., Windows Photo Viewer, Windows Media Player) with active title bars and close buttons.
• Desktop Interactions & Elements:
  - Recycle Bin Easter Egg: A pixelated Recycle Bin is positioned in the top right corner. Users can drag and drop any desktop icon or shortcut into it. Dropping an asset trips a classic XP warning alert window containing a quirky one-liner: "You can delete it from here, but not from my brain."
  - year2_GDSC_subhead.exe: Details entering the club early, leveraging editing software skill advantages, using creativity, and realizing that combining design with tech builds lasting communities, with events such as Freshers Foobar 2023, Google Cloud Study Jams 2023, MPSTME OnTrack app promotions, and the flagship 2-day hackathon "Hyphen" (securing Tier-1 sponsors like Godrej, Nippon, Unstop, Luma, LetsUpgrade).
  - year2_IEEE_subhead.exe: Details managing specialized departments and coordinating early student events.
  - year3_GDG_SuperCore.exe: Opens a multi-tab software frame.
    * Tab 1 (Logistics): A strict grid tracking operational scale (managing an active creative/tech team of 150 along with co-chiefs) and community milestones.
    * Tab 2 (Super Core Events): Showcases promotional materials and descriptions for FreshersFoobar 2.0, Flutter & Figma workshop, Decrypt workshop, and Hyphen 2.0.
    * Tab 3 (Media Gallery): A smooth masonry grid layout representing event spaces. Clicking an item launches a "Windows Picture and Fax Viewer" sub-modal.
  - Certifications_and_Awards.zip: A structured grid detailing technical credentials and hackathon sweeps:
    * Awards: NMIMS Polarizer 2024 (1st Place - QuadStreamCV), TechSafar TechSkript'25 (1st Place - GestoDrive), Tech Hackathon on Disability Inclusion by NMIMS Mirae Asset 2026 (3rd Place - GestoChair), Google Developer Group Hyphen Ideathon (Distinction), Paper presented and published as main author at the IEEE ICECER Madagascar 2025 conference.
    * Badges & Certs: Google Skill Badges (GenAI & Vertex AI Prompt Engineering), IBM Docker Essentials, IBM Watson AI Libraries (Python/Flask), Stanford/DeepLearning.AI (Supervised ML Program), Kaggle ML Explainability, HackerRank REST API (Intermediate), Coursera Power BI, and SamikaSystems Coretech Drone System 5-Day Certification.
  - GDG_cloudMum: Documenting event logistics, operations, and digital creatives management for Google Developer Group Cloud Mumbai - Cloud Community Days.
  - whatCode_freelance.pdf: Opens a vintage, retro-styled Adobe Acrobat Reader framework showing professional logo and branding assets. Highlights freelance collaboration with the Chief Strategist, Product Lead, and UI/UX engineering developers.
  - Wallpaper Anchor: The quote, "The real club was the friends we made along the way," must be faintly etched directly into the desktop wallpaper asset, serving as a permanent thematic background element.
• Transition Mechanism: A prominent icon named "System_Upgrade.exe" sits on the desktop. Double-clicking it opens an installation wizard window that acts as the prompt trigger. Upon opening, an authentic XP system tray balloon notification pops up saying: "System Architecture Outdated. [Deploy NextGen Framework? Yes / No]". Clicking 'Yes' triggers a Framer Motion explosion effect where the entire desktop shatters and falls off the screen.

Level 4 - THE BUILD (Modern Build):
A hyper-modern, high-end luxury spatial web design heavily inspired by the visual layout, typography, elasticity, and motion kinetics of the Max Kalinsky website (kalinsky.design).
• UI Style & Philosophy: Minimalist, clean grid layouts with generous whitespace, drawing sharp focus onto complex technical system deep dives. Stark, bold structural typography. Micro-interactions include completely fluid page-wipe transitions, and a custom interactive cursor that morphs shape or blending modes depending on hover targets. Elements must react to scroll speed with absolute parallax elasticity and tactile physics weight.
• Case Study Deep-Dive Navigation Blueprint:
  - When a user hovers over a project card, the cursor expands. Clicking the card initiates a seamless full-screen crossfade or expanding frame animation directly into that project's standalone case study layout.
  - Case Study Scroll Flow: The top of the case study loads a bold title overlay over a muted, ambient background tracking layout. As the user scrolls downwards, structural grid containers fade into view, housing deep architectural diagrams, technical specifications, and visual assets.
  - Bottom Linear Link: Reaching the terminal bottom of a case study project reveals a prominent, full-screen next-up card: "Next Project: [Project Name]". Continuing to scroll or dragging upwards past this threshold cleanly wipes the layout into the next successive case study.
• Core Case Studies (System-Level Architectures - Expandable Grid):
  - Gesto-Drive (Gaming by Hand): Human-Computer Interaction system utilizing OpenCV and MediaPipe. Translates real-time hand coordinates into physical game controls with a max accuracy of 94% and an ultra-low latency of 22–29ms. Published and presented as primary author at the IEEE ICECER 2025 conference in Madagascar. Showcased via a smooth, looped video simulation container. Credits co-creators Raj Kothari and Bhavya Sanghrajka.
  - Gesto-Chair: A low-cost, multi-modal, non-invasive wheelchair retrofit platform using Arduino architecture. Integrates a 5-in-1 human interface (voice control + wearable gesture glove) to combat muscle fatigue for under 14,000rs. Secured 3rd place at the Tech Hackathon on Disability Inclusion. Uses an interactive before/after split slider layout.
  - AI Pin (Wearable Voice Assistant): Read project file architecture.jpg for structural logic. Powered by an ESP32-S3 handling edge processing and local buffer streaming over WebSockets. Scaled via an asynchronous 7-queue Docker Compose microservices infrastructure processing Silero VAD, GPU Faster-Whisper, and a triple-redundant LLM fallback loop (Groq/Gemini/OpenRouter) down to a 1.2-second latency and 99.97% intent uptime. Includes an interactive SVG architecture diagram where hovering nodes traces active data pathways.
  - CalCount (Calorie Tracker Project): Read project file architecture.md for structural logic. Leverages an ESP32-S3 network node scale polling an HX711 ADC linked to local YOLOv8 object detection runtime and a Gemini API fallback. Implements a Command Query Responsibility Segregation (CQRS) engine isolating heavy writes (PostgreSQL) from ultra-fast query reads (Redis cache) to keep mobile latency under 10ms. Implements an automatic Circuit Breaker pattern mapping 4 operational states (Closed, Failure Trigger, Open Safety Mode after 5 failures, and a 60-second Half-Open check).
  - FitCheck: An Android app utilizing Android Studio, Flask, and Gemini API to generate mood-driven personal fashion outfit visualization.
  - ESP32 E-Ink Display UPI: IoT-to-cloud device using secure JSON-based HTTP over PHP to dynamically render secure UPI codes on e-ink displays.
  - QuadStreamCV: Custom built and tuned quadcopter drone processing live pose-detection inference via ROS-Foxy and Ubuntu22.
  - Jio Platforms Ltd: Summer Internship work optimizing core platform connectivity infrastructures using YOLO visual models and QLORA quantization scaling.
  - Calorie Tracker Project: Full stack application architecture and deployment framework.
  - Future Vision Statement: Display this bold text block: "I see Andrew Ng as my professional idol. I want to build and optimize advanced model architectures completely from scratch and develop the production-ready frameworks required to scale deep learning algorithms to millions of concurrent users."
• Transition: A massive, centered modern footer button reading "INITIALIZE_CONNECTION". Clicking it launches a blurred glassmorphism confirmation screen. Confirming forces a deep camera zoom straight down the Z-axis, transitioning into pure black.

Level 5 - THE NEXT NODE (Contact Void):
An absolute, dark minimalist void highlighting the core project mascot.
• Interactive Logic: A frame loop continuously tracks mouse cursor velocity (dx/dt). The user must frantically move their mouse around the screen for 2 full seconds to exhaust the sprite. Once velocity conditions are met, Mini-Harsh switches to a panting/exhausted state animation and locks position. As the user's mouse hovers near it, the sprite shifts to an animation with starry eyes, eagerly waiting to be clicked.
• Content: Clicking the exhausted sprite causes a crisp, ultra-clean contact card overlay modal to fade in containing: "Ready to build the future?", direct mailto link, LinkedIn link, GitHub link, and an explicit "Download CV" PDF button asset.

GLOBAL COMPANION ELEMENT: "Mini-Harsh" (The 16-Bit Facially Expressive Sprite)
A persistent, stylized 16-bit pixelated helper sprite mounted at the global level.
• States: 
  1. FOLLOW: Triggers a smooth running animation trailing behind the cursor with a spring damping delay.
  2. IDLE/REST: If the cursor sits completely stationary for 1.5 seconds, the sprite stops tracking positions and sits down, allowing the user to move their mouse onto it and click it.
  3. EXHAUSTED: Handled exclusively in Level 5 via velocity thresholds.
  4. ALERT: Handles the sudden state jump from rest to active tracking.
• Interaction (Fast Travel): Clicking Mini-Harsh while in an active or idle state drops a global blur overlay "Pause Menu" exposing links to all 6 levels, allowing immediate jumping across the structural levels.

-------------------------------------------------------------------
INITIAL COMMAND EXECUTION PROTOCOL
-------------------------------------------------------------------
Do not generate any React components or write styling rules yet. Your first task is to initialize the workspace directory system. 
1. Create a dedicated "docs/" directory.
2. Inside "docs/", write "architecture.md" and "ui_system.md" laying out your precise component file directory roadmap, selected state management implementation (e.g., Zustand), and routing architecture.
3. Respond ONLY with a confirmation summarizing your chosen tech stack layout and file paths. Wait for my direct input before executing code generation.