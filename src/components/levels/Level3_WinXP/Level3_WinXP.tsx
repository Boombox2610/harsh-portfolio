import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { usePortfolioStore, type Level } from '../../../store/usePortfolioStore';
import './Level3_WinXP.css';
import WindowDropdown from '../../shared/WindowDropdown';
import Screensaver from '../../shared/Screensaver';

// ─── SVG Icon Library ─────────────────────────────────────────────────────────

const XpFolder: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="2" y="12" width="36" height="24" rx="2" fill="#F4C842" stroke="#C89A00" strokeWidth="1.5" />
    <rect x="2" y="10" width="16" height="6" rx="2" fill="#F4C842" stroke="#C89A00" strokeWidth="1.5" />
    <rect x="4" y="14" width="32" height="20" rx="1" fill="#FAD95E" />
    <line x1="4" y1="20" x2="36" y2="20" stroke="#C89A00" strokeWidth="0.5" opacity="0.5" />
    <line x1="4" y1="26" x2="36" y2="26" stroke="#C89A00" strokeWidth="0.5" opacity="0.5" />
  </svg>
);

const XpExe: React.FC<{ color?: string; size?: number }> = ({ color = '#316AC5', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="4" y="4" width="32" height="32" rx="4" fill={color} stroke="#001880" strokeWidth="1.5" />
    <text x="20" y="24" textAnchor="middle" fontFamily="Tahoma" fontSize="12" fontWeight="bold" fill="#FFFFFF">.exe</text>
    <circle cx="20" cy="14" r="5" fill="rgba(255,255,255,0.2)" />
    <path d="M16 14 L20 10 L24 14 L20 18 Z" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

const XpZip: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="6" y="2" width="22" height="28" rx="2" fill="#F5F0E8" stroke="#888" strokeWidth="1.5" />
    <polygon points="28,2 34,2 34,10 28,10" fill="#C8C4B8" stroke="#888" strokeWidth="1" />
    <line x1="28" y1="2" x2="28" y2="10" stroke="#888" strokeWidth="1" />
    <line x1="28" y1="10" x2="34" y2="10" stroke="#888" strokeWidth="1" />
    <rect x="14" y="4" width="6" height="24" rx="1" fill="#4A90D0" opacity="0.4" />
    {[8, 12, 16, 20, 24].map(y => (
      <line key={y} x1="14" y1={y} x2="20" y2={y} stroke="#2060B0" strokeWidth="1" />
    ))}
    <text x="7" y="38" fontFamily="Tahoma" fontSize="8" fill="#316AC5">.zip</text>
  </svg>
);

const XpPdf: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="4" y="2" width="28" height="36" rx="2" fill="#FFFFFF" stroke="#CC0000" strokeWidth="1.5" />
    <rect x="4" y="2" width="28" height="10" rx="2" fill="#CC0000" />
    <text x="18" y="11" textAnchor="middle" fontFamily="Arial" fontSize="8" fontWeight="bold" fill="#FFFFFF">PDF</text>
    <line x1="8" y1="18" x2="28" y2="18" stroke="#DDD" strokeWidth="1" />
    <line x1="8" y1="22" x2="28" y2="22" stroke="#DDD" strokeWidth="1" />
    <line x1="8" y1="26" x2="24" y2="26" stroke="#DDD" strokeWidth="1" />
    <line x1="8" y1="30" x2="26" y2="30" stroke="#DDD" strokeWidth="1" />
    <text x="3" y="40" fontFamily="Tahoma" fontSize="8" fill="#CC0000">.pdf</text>
  </svg>
);

const XpTrash: React.FC<{ full?: boolean; size?: number }> = ({ full = false, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="8" y="14" width="24" height="22" fill="#B0C8E8" stroke="#4472C4" strokeWidth="1.5" />
    <rect x="6" y="10" width="28" height="5" fill="#90B0D8" stroke="#4472C4" strokeWidth="1.5" />
    <rect x="15" y="5" width="10" height="6" rx="1" fill="none" stroke="#4472C4" strokeWidth="1.5" />
    {!full && <>
      <line x1="14" y1="20" x2="14" y2="32" stroke="#4472C4" strokeWidth="1" />
      <line x1="20" y1="20" x2="20" y2="32" stroke="#4472C4" strokeWidth="1" />
      <line x1="26" y1="20" x2="26" y2="32" stroke="#4472C4" strokeWidth="1" />
    </>}
    {full && <>
      <ellipse cx="16" cy="18" rx="4" ry="3" fill="#F5F0E8" stroke="#888" strokeWidth="1" transform="rotate(-15,16,18)" />
      <ellipse cx="24" cy="17" rx="3" ry="2.5" fill="#F5F0E8" stroke="#888" strokeWidth="1" transform="rotate(10,24,17)" />
    </>}
  </svg>
);

const XpSystem: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="2" y="6" width="36" height="26" rx="3" fill="#2A2A3A" stroke="#5050AA" strokeWidth="1.5" />
    <rect x="4" y="8" width="32" height="18" rx="1" fill="#090920" />
    {/* terminal text */}
    <text x="6" y="18" fontFamily="Courier New" fontSize="6" fill="#00FF88">SYSTEM v4.0</text>
    <text x="6" y="24" fontFamily="Courier New" fontSize="6" fill="#AAAAFF">loading...</text>
    <rect x="10" y="32" width="20" height="2" rx="1" fill="#444" />
    <rect x="16" y="34" width="8" height="4" rx="1" fill="#666" />
    <rect x="6" y="38" width="28" height="2" rx="1" fill="#555" />
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────
type WinId = 'gdsc' | 'ieee' | 'gdg' | 'certs' | 'cloudmum' | 'whatcode' | 'installer';

interface WinState {
  id: WinId;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized?: boolean;
  zIndex: number;
}

// ─── Clock ───────────────────────────────────────────────────────────────────
const Clock: React.FC = () => {
  const fmt = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = setInterval(() => setT(fmt()), 10000); return () => clearInterval(id); }, []);
  return <div className="l3__taskbar-clock">{t}</div>;
};

// ─── Desktop Icon (draggable, double-click to open) ──────────────────────────
interface DeskIconProps {
  id: WinId;
  icon: React.ReactNode;
  label: string;
  onOpen: (id: WinId) => void;
  onDropOnBin: (id: WinId) => void;
  binRef: React.RefObject<HTMLDivElement | null>;
  shattering: boolean;
  shatterDelay: number;
}

const DeskIcon: React.FC<DeskIconProps> = ({ id, icon, label, onOpen, onDropOnBin, binRef, shattering, shatterDelay }) => {
  const lastTap = useRef(0);

  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 400) {
      onOpen(id);
    }
    lastTap.current = now;
  }, [id, onOpen]);

  const handleDragEnd = useCallback((_e: unknown, info: { point: { x: number; y: number } }) => {
    if (!binRef.current) return;
    const rect = binRef.current.getBoundingClientRect();
    const { x, y } = info.point;
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      onDropOnBin(id);
    }
  }, [id, binRef, onDropOnBin]);

  return (
    <motion.div
      className="l3__icon-wrapper"
      drag={!shattering}
      dragMomentum={false}
      dragElastic={0}
      onClick={handleClick}
      onDragEnd={handleDragEnd as Parameters<typeof motion.div>[0]['onDragEnd']}
      whileDrag={{ scale: 1.1, opacity: 0.8 }}
      animate={shattering ? { scale: 0, rotate: Math.random() > 0.5 ? 180 : -180, x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 800, opacity: 0, filter: "blur(10px) brightness(3)" } : {}}
      transition={shattering ? { duration: 0.9, delay: shatterDelay, ease: "easeOut" } : {}}
    >
      <div className="l3__icon-glyph">{icon}</div>
      <div className="l3__icon-label">{label}</div>
    </motion.div>
  );
};

// ─── XP Window ───────────────────────────────────────────────────────────────
interface XpWinProps {
  win: WinState;
  isActive: boolean;
  onFocus: (id: WinId) => void;
  onClose: (id: WinId) => void;
  onMinimize: (id: WinId) => void;
  initialX: number;
  initialY: number;
  shattering: boolean;
  shatterDelay: number;
  children: React.ReactNode;
  minWidth?: number;
}

const XpWindow: React.FC<XpWinProps> = ({
  win, isActive: _isActive, onFocus, onClose, onMinimize, initialX, initialY,
  shattering, shatterDelay, children, minWidth
}) => {
  const dragControls = useDragControls();

  if (win.isMinimized) return null;

  return (
    <motion.div
      className="l3__window"
      style={{ zIndex: win.zIndex, minWidth: minWidth ?? 400 }}
      initial={{ x: initialX, y: initialY, opacity: 0, scale: 0.9 }}
      animate={shattering
        ? { scale: 0, x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 800, rotate: Math.random() > 0.5 ? 180 : -180, opacity: 0, filter: "blur(10px) brightness(3)" }
        : { opacity: 1, scale: 1 }
      }
      transition={shattering
        ? { duration: 1.0, delay: shatterDelay, ease: "easeOut" }
        : { duration: 0.15 }
      }
      drag={!shattering}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onPointerDown={() => onFocus(win.id)}
    >
      {/* Titlebar */}
      <div
        className="l3__window-titlebar"
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="l3__window-titlebar-left">
          <div className="l3__window-title-icon">{win.icon}</div>
          <span>{win.title}</span>
        </div>
        <div className="l3__window-controls">
          <button
            className="l3__window-btn l3__window-btn--min"
            onPointerDown={e => e.stopPropagation()}
            onClick={() => onMinimize(win.id)}
          >─</button>
          <button className="l3__window-btn l3__window-btn--max" onPointerDown={e => e.stopPropagation()}>□</button>
          <button
            className="l3__window-btn l3__window-btn--close"
            onPointerDown={e => e.stopPropagation()}
            onClick={() => onClose(win.id)}
          >✕</button>
        </div>
      </div>
      {/* Body */}
      <div className="l3__window-body">
        {children}
      </div>
    </motion.div>
  );
};

// ─── Content Components ───────────────────────────────────────────────────────


const GDSCWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const TABS = ['Overview', 'Events', 'Media Gallery'];

  return (
    <>
      <div className="l3__window-toolbar">
        <WindowDropdown label="File" onCloseWindow={onClose} />
        <WindowDropdown label="Edit" />
        <WindowDropdown label="View" />
        <WindowDropdown label="Help" />
      </div>
      <div className="l3__tab-bar">
        {TABS.map((t, i) => (
          <div key={t} className={`l3__tab ${tab === i ? 'l3__tab--active' : ''}`} onClick={() => setTab(i)}>{t}</div>
        ))}
      </div>
      <div className="l3__tab-content">
        {tab === 0 && (
          <>
            <div className="l3__section-title">GDSC — Sub-Head (Year 2)</div>
            <div className="l3__text">Entered the club early, leveraging editing software skill advantages. Used creativity to become a core member of the tech-design bridge team.</div>
            <div className="l3__kv-row"><div className="l3__kv-key">Role</div><div className="l3__kv-val">Sub-Head, Digital Creatives</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Domain</div><div className="l3__kv-val">Graphic Design x Tech Community Building</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Impact</div><div className="l3__kv-val">Built & scaled creative pipelines. Realized combining design with tech builds lasting communities.</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Tools</div><div className="l3__kv-val">Adobe Illustrator, Photoshop, Premiere Pro, Figma, Canva</div></div>
          </>
        )}
        {tab === 1 && (
          <>
            <div className="l3__section-title">Key Events & Milestones</div>
            <div className="l3__kv-row"><div className="l3__kv-key">Freshers Foobar 2023</div><div className="l3__kv-val">Flagship annual welcome hackathon</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Cloud Study Jams 2023</div><div className="l3__kv-val">Google Cloud certification drive</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">MPSTME OnTrack</div><div className="l3__kv-val">App promotion and campus outreach</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Hyphen (Flagship)</div><div className="l3__kv-val">2-day hackathon — Tier 1 sponsors: Godrej, Nippon, Unstop, Luma, LetsUpgrade</div></div>
          </>
        )}
        {tab === 2 && (
          <>
            <div className="l3__section-title">Media Gallery</div>
            <div className="l3__masonry">
              <div className="l3__masonry-item">
                <video src="/assets/level3/y2_gdsc_vid1.mp4" autoPlay loop muted playsInline style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y2_gdsc_g1.png" alt="GDSC Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y2_gdsc_g2.png" alt="GDSC Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y2_gdsc_g3.png" alt="GDSC Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y2_gdsc_g4.png" alt="GDSC Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y2_gdsc_g5.png" alt="GDSC Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y2_gdsc_g6.png" alt="GDSC Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const IEEEWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const TABS = ['Overview', 'Events', 'Media Gallery'];

  return (
    <>
      <div className="l3__window-toolbar">
        <WindowDropdown label="File" onCloseWindow={onClose} />
        <WindowDropdown label="Edit" />
        <WindowDropdown label="View" />
        <WindowDropdown label="Help" />
      </div>
      <div className="l3__tab-bar">
        {TABS.map((t, i) => (
          <div key={t} className={`l3__tab ${tab === i ? 'l3__tab--active' : ''}`} onClick={() => setTab(i)}>{t}</div>
        ))}
      </div>
      <div className="l3__tab-content">
        {tab === 0 && (
          <>
            <div className="l3__section-title">IEEE — Sub-Head (Year 2)</div>
            <div className="l3__text">Coordinated departmental operations and early student events across IEEE's technical and creative arms.</div>
            <div className="l3__kv-row"><div className="l3__kv-key">Role</div><div className="l3__kv-val">Sub-Head, Digital Creatives</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Domain</div><div className="l3__kv-val">Event Coordination x Graphics Design</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Impact</div><div className="l3__kv-val">Strengthened committee publicity and student engagement</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Tools</div><div className="l3__kv-val">Adobe Illustrator, Photoshop, Canva</div></div>
          </>
        )}
        {tab === 1 && (
          <>
            <div className="l3__section-title">Key Events</div>
            <div className="l3__kv-row"><div className="l3__kv-key">TopG</div><div className="l3__kv-val">Departmental technical showcase event</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">techSafar</div><div className="l3__kv-val">Student technical workshop series</div></div>
          </>
        )}
        {tab === 2 && (
          <>
            <div className="l3__section-title">Media Gallery</div>
            <div className="l3__masonry">
              <div className="l3__masonry-item">
                <video src="/assets/level3/y2_IEEE_vid1.mp4" autoPlay loop muted playsInline style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y2_IEEE_g1.png" alt="IEEE Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y2_IEEE_g2.png" alt="IEEE Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y2_IEEE_g3.png" alt="IEEE Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>

            </div>
          </>
        )}
      </div>
    </>
  );
};

const GDGWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const TABS = ['Logistics', 'Super Core Events', 'Media Gallery'];

  return (
    <>
      <div className="l3__window-toolbar">
        <WindowDropdown label="File" onCloseWindow={onClose} />
        <WindowDropdown label="Edit" />
        <WindowDropdown label="View" />
        <WindowDropdown label="Help" />
      </div>
      <div className="l3__tab-bar">
        {TABS.map((t, i) => (
          <div key={t} className={`l3__tab ${tab === i ? 'l3__tab--active' : ''}`} onClick={() => setTab(i)}>{t}</div>
        ))}
      </div>
      <div className="l3__tab-content">
        {tab === 0 && (
          <>
            <div className="l3__section-title">Operational Scale</div>
            <div className="l3__kv-row"><div className="l3__kv-key">Team Size</div><div className="l3__kv-val">150+ active creative/tech members</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Role</div><div className="l3__kv-val">Super Core — Creative × Tech Lead (co-chief)</div></div>
          </>
        )}
        {tab === 1 && (
          <>
            <div className="l3__section-title">Super Core Events</div>
            <div className="l3__kv-row"><div className="l3__kv-key">FreshersFoobar 2.0</div><div className="l3__kv-val">Scaled welcome hackathon with 300+ participants</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Flutter & Figma Workshop</div><div className="l3__kv-val">Cross-disciplinary design-engineering skill sprint</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Decrypt Workshop</div><div className="l3__kv-val">Hands-on cryptography & security session</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Hyphen 2.0</div><div className="l3__kv-val">Flagship 2-day hackathon — elevated sponsorship tier</div></div>
          </>
        )}
        {tab === 2 && (
          <>
            <div className="l3__section-title">Media Gallery</div>
            <div className="l3__masonry">
              <div className="l3__masonry-item">
                <video src="/assets/level3/y3_gdsc_vid1.mp4" autoPlay loop muted playsInline style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <video src="/assets/level3/y3_gdsc_vid2.mp4" autoPlay loop muted playsInline style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y3_gdsc_g1.png" alt="IEEE Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y3_gdsc_g2.png" alt="IEEE Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y3_gdsc_g3.png" alt="IEEE Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y3_gdsc_g4.png" alt="IEEE Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y3_gdsc_g5.png" alt="IEEE Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/y3_gdsc_g6.png" alt="IEEE Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const CertsWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {

  return (
    <>
      <div className="l3__window-toolbar">
        <WindowDropdown label="File" onCloseWindow={onClose} />
        <WindowDropdown label="Edit" />
        <WindowDropdown label="View" />
        <WindowDropdown label="Help" />
      </div>
      <div className="l3__window-content" style={{ maxHeight: 420 }}>
        <div className="l3__section-title">Awards & Hackathons</div>
        <div className="l3__award-grid">
          <a href="https://www.linkedin.com/posts/harsh-maru2610_hackathon-disabilityinclusion-innovation-ugcPost-7438912229619478528-iW6h/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEU_Gm8BG2LbLid22qEdZryjVdlNEk73kLo" target="_blank" rel="noopener noreferrer" className="l3__award-card"><strong>🥉 NMIMS Mirae Asset 2026</strong>3rd Place — GestoChair (Multi-modal wheelchair retrofit platform)</a>
          <a href="https://www.linkedin.com/in/harsh-maru2610/" target="_blank" rel="noopener noreferrer" className="l3__award-card"><strong>🥇 NMIMS Polarizer 2024</strong>1st Place — QuadStreamCV (Custom drone + ROS pose detection)</a>
          <a href="https://www.linkedin.com/in/harsh-maru2610/" target="_blank" rel="noopener noreferrer" className="l3__award-card"><strong>🥇 TechSafar TechSkript'25</strong>1st Place — GestoDrive (Hand gesture game controller, IEEE published)</a>
          <a href="https://www.linkedin.com/in/harsh-maru2610/" target="_blank" rel="noopener noreferrer" className="l3__award-card"><strong>✦ GDG Hyphen Ideathon</strong>Distinction award — community innovation track</a>
          <a href="https://www.linkedin.com/posts/harsh-maru2610_gesto-drive-real-time-hci-for-peripheral-free-share-7447514138689605632-hINf/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEU_Gm8BG2LbLid22qEdZryjVdlNEk73kLo" target="_blank" rel="noopener noreferrer" className="l3__award-card" style={{ gridColumn: '1/-1' }}><strong>📄 IEEE ICECER 2025 — Madagascar</strong>Paper presented & published as primary author (GestoDrive)</a>
        </div>
        <div className="l3__section-title" style={{ marginTop: 12 }}>Badges & Certifications</div>
        <div className="l3__badge-list">
          {[
            { label: 'Google GenAI Skill Badge', href: 'https://www.skills.google/public_profiles/2998247e-1da7-4a57-a5ed-48ff618d819a/badges/8941677' },
            { label: 'Vertex AI Prompt Engineering', href: 'https://www.credly.com/badges/9a56bc22-8126-4a9d-a9e3-578cd76a2353/linked_in_profile' },
            { label: 'IBM Docker Essentials', href: 'https://www.credly.com/badges/54c70ab1-27b4-4958-b58e-afff7d66497a/linked_in_profile' },
            { label: 'IBM Watson AI (Python/Flask)', href: 'https://www.coursera.org/account/accomplishments/verify/KP2FPOY3IJYG' },
            { label: 'Stanford DeepLearning.AI — Supervised ML', href: 'https://www.coursera.org/account/accomplishments/verify/CNHED57LFGGB' },
            { label: 'Kaggle ML Explainability', href: 'https://www.kaggle.com/learn/certification/boombox2610/machine-learning-explainability' },
            { label: 'HackerRank REST API (Intermediate)', href: 'https://www.hackerrank.com/certificates/cac95a15cca8' },
            { label: 'Coursera Power BI', href: 'https://www.coursera.org/account/accomplishments/verify/LIKYOC1SM788' },
            { label: 'SamikaSystems Drone Coretech 5-Day Cert', href: '#' },
            { label: 'Participation in Hyphen 2.0', href: 'https://unstop.com/certificate-preview/cf79915e-2608-4a06-90da-7ea00fd7e23f' },
          ].map(b => <a href={b.href} target="_blank" rel="noopener noreferrer" key={b.label} className="l3__badge" style={{ textDecoration: 'none' }}>{b.label}</a>)}
        </div>
      </div>
    </>
  );
};

const CloudMumWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const TABS = ['Overview', 'Media Gallery'];

  return (
    <>
      <div className="l3__window-toolbar">
        <WindowDropdown label="File" onCloseWindow={onClose} />
        <WindowDropdown label="Edit" />
        <WindowDropdown label="View" />
        <WindowDropdown label="Help" />
      </div>
      <div className="l3__tab-bar">
        {TABS.map((t, i) => (
          <div key={t} className={`l3__tab ${tab === i ? 'l3__tab--active' : ''}`} onClick={() => setTab(i)}>{t}</div>
        ))}
      </div>
      <div className="l3__tab-content">
        {tab === 0 && (
          <>
            <div className="l3__section-title">GDG Cloud Mumbai — Cloud Community Days</div>
            <div className="l3__text">Event logistics, operations, and digital creatives management for Google Developer Group Cloud Mumbai's flagship community event.</div>
            <div className="l3__kv-row"><div className="l3__kv-key">Event</div><div className="l3__kv-val">GDG Cloud Mumbai — Cloud Community Days</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Role</div><div className="l3__kv-val">Digital Creatives Lead</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Scope</div><div className="l3__kv-val">End-to-end visual identity, promotional assets, on-ground operations</div></div>
            <div className="l3__kv-row"><div className="l3__kv-key">Output</div><div className="l3__kv-val">Full digital design system + event day creatives</div></div>
          </>
        )}
        {tab === 1 && (
          <>
            <div className="l3__section-title">Media Gallery</div>
            <div className="l3__masonry">
              <div className="l3__masonry-item">
                <img src="/assets/level3/gdg_cloud_g1.jpg" alt="Cloud Mumbai Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/gdg_cloud_g2.jpg" alt="Cloud Mumbai Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/gdg_cloud_g3.jpg" alt="Cloud Mumbai Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/gdg_cloud_g4.jpeg" alt="Cloud Mumbai Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
              <div className="l3__masonry-item">
                <img src="/assets/level3/gdg_cloud_g5.png" alt="Cloud Mumbai Media" style={{ width: '100%', minHeight: '100px', objectFit: 'cover' }} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const WhatcodeWindow: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <>
    {/* Acrobat-style toolbar */}
    <div className="l3__acrobat-toolbar">
      <span>File</span><span>Edit</span><span>Document</span><span>View</span><span>Window</span>
    </div>
    <div className="l3__window-content" style={{ padding: 0, background: '#888' }}>
      <div className="l3__acrobat-page">
        <div className="l3__acrobat-logo">whatCode. — Freelance Portfolio</div>
        <div className="l3__text"><strong>Freelance Collaboration</strong></div>
        <div className="l3__kv-row"><div className="l3__kv-key">Role</div><div className="l3__kv-val">UI/UX Engineering & Branding Lead</div></div>
        <div className="l3__kv-row"><div className="l3__kv-key">Collaborators</div><div className="l3__kv-val">Chief Strategist, Product Lead, UI/UX Engineering Developers</div></div>
        <div className="l3__kv-row"><div className="l3__kv-key">Deliverables</div><div className="l3__kv-val">Professional logo systems, brand identity, UI engineering assets</div></div>
        <div className="l3__kv-row"><div className="l3__kv-key">Tools Used</div><div className="l3__kv-val">Adobe Illustrator, Figma, CSS/React</div></div>
        <div className="l3__text" style={{ fontStyle: 'italic', color: '#555', marginTop: 8 }}>
          Bridging precision engineering with visual storytelling for client brand launch.
        </div>
        <div style={{ marginTop: 24, border: '1px solid #CCC', padding: 8, background: '#FFF' }}>
          <div style={{ color: '#888', fontStyle: 'italic', marginBottom: 8 }}>[ Dark Mode Logo ]</div>
          <img src="/assets/level3/whatcode_g1.png" alt="Whatcode Media" style={{ width: '100%', minHeight: '150px', objectFit: 'cover', background: '#F5F5F5' }} />
        </div>
        <div style={{ marginTop: 24, border: '1px solid #CCC', padding: 8, background: '#000' }}>
          <div style={{ color: '#888', fontStyle: 'italic', marginBottom: 8 }}>[ Light Mode Logo ]</div>
          <img src="/assets/level3/whatcode_g2.png" alt="Whatcode Media" style={{ width: '100%', minHeight: '150px', objectFit: 'cover', background: '#F5F5F5' }} />
        </div>
      </div>
    </div>
  </>
);

// ─── Installer Wizard ─────────────────────────────────────────────────────────
const InstallerWindow: React.FC<{ onNext: () => void; onCancel: () => void }> = ({ onNext, onCancel }) => (
  <>
    <div className="l3__wizard-header">
      <div className="l3__wizard-icon"><XpSystem size={48} /></div>
      <div className="l3__wizard-title-block">
        <strong>System_Upgrade.exe</strong>
        <span>NextGen Framework Installation Wizard</span>
      </div>
    </div>
    <div className="l3__wizard-body">
      <p>Welcome to the <strong>NextGen Framework Upgrade Wizard</strong>.</p>
      <p>This utility will replace the current operating environment with a modern high-performance spatial architecture.</p>
      <p>Before proceeding, ensure all personal files are saved. This action cannot be undone.</p>
      <p style={{ color: '#880000', fontWeight: 'bold' }}>⚠ Warning: All desktop processes will be terminated.</p>
    </div>
    <div className="l3__wizard-footer">
      <button className="l3__wizard-btn" onClick={onCancel}>Cancel</button>
      <button className="l3__wizard-btn" onClick={onNext}>Next &gt;</button>
    </div>
  </>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Level3_WinXP: React.FC = () => {
  const setLevel = usePortfolioStore(s => s.setLevel);
  const [topZ, setTopZ] = useState(20);
  const [activeId, setActiveId] = useState<WinId | null>(null);
  const [showBalloon, setShowBalloon] = useState(false);
  const [shattering, setShattering] = useState(false);
  const [trashFull, setTrashFull] = useState(false);
  const [showTrashAlert, setShowTrashAlert] = useState(false);
  const binRef = useRef<HTMLDivElement>(null);

  // Initial window states
  const initWins = (): Record<WinId, WinState> => ({
    gdsc: { id: 'gdsc', title: 'year2_GDSC_subhead.exe', icon: <XpExe size={16} />, isOpen: false, zIndex: 20 },
    ieee: { id: 'ieee', title: 'year2_IEEE_subhead.exe', icon: <XpExe color="#336633" size={16} />, isOpen: false, zIndex: 20 },
    gdg: { id: 'gdg', title: 'year3_GDG_SuperCore.exe', icon: <XpExe color="#CC4400" size={16} />, isOpen: false, zIndex: 20 },
    certs: { id: 'certs', title: 'Certifications_and_Awards.zip', icon: <XpZip size={16} />, isOpen: false, zIndex: 20 },
    cloudmum: { id: 'cloudmum', title: 'GDG_cloudMum', icon: <XpFolder size={16} />, isOpen: false, zIndex: 20 },
    whatcode: { id: 'whatcode', title: 'whatCode_freelance.pdf', icon: <XpPdf size={16} />, isOpen: false, zIndex: 20 },
    installer: { id: 'installer', title: 'System_Upgrade.exe', icon: <XpSystem size={16} />, isOpen: false, zIndex: 20 },
  });

  const [wins, setWins] = useState<Record<WinId, WinState>>(initWins);

  const ICONS: { id: WinId; icon: React.ReactNode; label: string }[] = [
    { id: 'gdsc', icon: <XpExe />, label: 'year2_GDSC_subhead.exe' },
    { id: 'ieee', icon: <XpExe color="#336633" />, label: 'year2_IEEE_subhead.exe' },
    { id: 'gdg', icon: <XpExe color="#CC4400" />, label: 'year3_GDG_SuperCore.exe' },
    { id: 'certs', icon: <XpZip />, label: 'Certifications_and_Awards.zip' },
    { id: 'cloudmum', icon: <XpFolder />, label: 'GDG_cloudMum' },
    { id: 'whatcode', icon: <XpPdf />, label: 'whatCode_freelance.pdf' },
    { id: 'installer', icon: <XpSystem />, label: 'System_Upgrade.exe' },
  ];

  const WIN_OFFSETS: Record<WinId, { x: number; y: number }> = {
    gdsc: { x: 100, y: 30 }, ieee: { x: 150, y: 50 },
    gdg: { x: 120, y: 40 }, certs: { x: 200, y: 60 },
    cloudmum: { x: 160, y: 45 }, whatcode: { x: 180, y: 35 },
    installer: { x: 280, y: 80 },
  };

  const bringToFront = (id: WinId) => {
    setTopZ(z => z + 1);
    setWins(w => ({ ...w, [id]: { ...w[id], zIndex: topZ + 1, isMinimized: false } }));
    setActiveId(id);
  };

  const openWindow = (id: WinId) => {
    if (!wins[id].isOpen) {
      setWins(w => ({ ...w, [id]: { ...w[id], isOpen: true, isMinimized: false } }));
    }
    bringToFront(id);
    if (id === 'installer') setTimeout(() => setShowBalloon(true), 600);
  };

  const closeWindow = (id: WinId) => {
    setWins(w => ({ ...w, [id]: { ...w[id], isOpen: false } }));
    if (activeId === id) setActiveId(null);
    if (id === 'installer') setShowBalloon(false);
  };

  const minimizeWindow = (id: WinId) => {
    setWins(w => ({ ...w, [id]: { ...w[id], isMinimized: true } }));
    if (activeId === id) setActiveId(null);
  };

  const toggleTaskbarWindow = (id: WinId) => {
    if (wins[id].isMinimized) {
      bringToFront(id);
    } else if (activeId === id) {
      minimizeWindow(id);
    } else {
      bringToFront(id);
    }
  };

  const handleDropOnBin = useCallback((id: WinId) => {
    setTrashFull(true);
    setShowTrashAlert(true);
    closeWindow(id);
  }, [closeWindow]);

  const triggerShatter = useCallback(() => {
    setShowBalloon(false);
    setShattering(true);
    // After shatter animation, transition to level 4
    setTimeout(() => setLevel(4), 2600);
  }, [setLevel]);

  const openWindows = (Object.values(wins) as WinState[]).filter(w => w.isOpen);

  return (
    <div className="l3 anim-fade-up">
      {/* Wallpaper */}
      <div className={`l3__wallpaper${shattering ? ' l3__wallpaper--glitch' : ''}`} />
      <div className="l3__quote">
        "The real club was the friends we made along the way"
      </div>

      {/* Desktop Area */}
      <div className="l3__desktop-area">
        {/* Desktop Icons */}
        <div className="l3__desktop-icons">
          {ICONS.map((item, i) => (
            <DeskIcon
              key={item.id}
              id={item.id}
              icon={item.icon}
              label={item.label}
              onOpen={openWindow}
              onDropOnBin={handleDropOnBin}
              binRef={binRef}
              shattering={shattering}
              shatterDelay={i * 0.06}
            />
          ))}
        </div>

        {/* Recycle Bin — top-right per spec */}
        <div className="l3__recycle-bin" ref={binRef}>
          <XpTrash full={trashFull} size={44} />
          <div className="l3__recycle-label">Recycle Bin</div>
        </div>

        {/* Windows */}
        <AnimatePresence>
          {openWindows.map((win, i) => {
            const off = WIN_OFFSETS[win.id];
            return (
              <XpWindow
                key={win.id}
                win={win}
                isActive={activeId === win.id}
                onFocus={bringToFront}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                initialX={off.x + Math.random() * 20}
                initialY={off.y + Math.random() * 20}
                shattering={shattering}
                shatterDelay={i * 0.09 + 0.1}
                minWidth={win.id === 'certs' || win.id === 'gdg' ? 540 : 420}
              >
                {win.id === 'gdsc' && <GDSCWindow onClose={() => closeWindow('gdsc')} />}
                {win.id === 'ieee' && <IEEEWindow onClose={() => closeWindow('ieee')} />}
                {win.id === 'gdg' && <GDGWindow onClose={() => closeWindow('gdg')} />}
                {win.id === 'certs' && <CertsWindow onClose={() => closeWindow('certs')} />}
                {win.id === 'cloudmum' && <CloudMumWindow onClose={() => closeWindow('cloudmum')} />}
                {win.id === 'whatcode' && <WhatcodeWindow onClose={() => closeWindow('whatcode')} />}
                {win.id === 'installer' && (
                  <InstallerWindow
                    onNext={triggerShatter}
                    onCancel={() => closeWindow('installer')}
                  />
                )}
              </XpWindow>
            );
          })}
        </AnimatePresence>

        {/* Trash Alert */}
        {showTrashAlert && (
          <motion.div
            className="l3__window"
            style={{ zIndex: 8000, position: 'absolute', left: '50%', top: '35%', transform: 'translate(-50%,-50%)', minWidth: 340 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="l3__window-titlebar">
              <div className="l3__window-titlebar-left">
                <div className="l3__window-title-icon"><XpTrash size={16} /></div>
                <span>Recycle Bin</span>
              </div>
              <div className="l3__window-controls">
                <button className="l3__window-btn l3__window-btn--close" onClick={() => setShowTrashAlert(false)}>✕</button>
              </div>
            </div>
            <div className="l3__window-body">
              <div className="l3__window-content" style={{ textAlign: 'center' }}>
                <div className="l3__text">You can delete it from here, but not from my brain.</div>
                <div style={{ marginTop: 12 }}>
                  <button className="l3__wizard-btn" onClick={() => { setShowTrashAlert(false); setTrashFull(false); }}>Empty Bin</button>
                  {' '}
                  <button className="l3__wizard-btn" onClick={() => setShowTrashAlert(false)}>Close</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Taskbar */}
      <motion.div
        className="l3__taskbar"
        animate={shattering ? { scale: 0, rotate: (Math.random() > 0.5 ? 20 : -20), y: 400, opacity: 0, filter: "blur(10px) brightness(3)" } : {}}
        transition={shattering ? { duration: 1.0, delay: 0.3, ease: "easeOut" } : {}}
      >
        <button className="l3__start-btn" onClick={() => openWindow('installer')}>
          <svg className="l3__start-icon" viewBox="0 0 18 18" fill="none">
            <rect x="0" y="0" width="8" height="8" fill="#FF4444" />
            <rect x="10" y="0" width="8" height="8" fill="#44AA44" />
            <rect x="0" y="10" width="8" height="8" fill="#4444FF" />
            <rect x="10" y="10" width="8" height="8" fill="#FFAA00" />
          </svg>
          start
        </button>
        <div className="l3__taskbar-divider" />
        {openWindows.map(win => (
          <button
            key={win.id}
            className={`l3__taskbar-btn${activeId === win.id && !win.isMinimized ? ' l3__taskbar-btn--active' : ''}`}
            onClick={() => toggleTaskbarWindow(win.id)}
          >
            {win.title.slice(0, 18)}
          </button>
        ))}
        <div className="l3__taskbar-tray">
          <Clock />
          {/* XP Balloon — anchored above tray */}
          <AnimatePresence>
            {showBalloon && (
              <motion.div
                className="l3__balloon"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="l3__balloon-title">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" fill="#316AC5" />
                    <text x="7" y="11" textAnchor="middle" fontFamily="Arial" fontSize="9" fontWeight="bold" fill="#FFF">i</text>
                  </svg>
                  System Notification
                </div>
                <div className="l3__balloon-text">
                  System Architecture Outdated.<br />
                  Deploy NextGen Framework?
                </div>
                <div className="l3__balloon-actions">
                  <button className="l3__balloon-btn" onClick={triggerShatter}>Yes</button>
                  <button className="l3__balloon-btn" onClick={() => { setShowBalloon(false); closeWindow('installer'); }}>No</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Black fade-in overlay after shatter */}
      <div className={`l3__shatter-overlay${shattering ? ' l3__shatter-overlay--active' : ''}`} />

      <Screensaver />
    </div>
  );
};

export default Level3_WinXP;
