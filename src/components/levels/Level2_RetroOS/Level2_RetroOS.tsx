import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { usePortfolioStore } from '../../../store/usePortfolioStore';
import './Level2_RetroOS.css';
import WindowDropdown from '../../shared/WindowDropdown';
import Screensaver from '../../shared/Screensaver';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const IconPalette: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="2" y="2" width="36" height="28" fill="#FFF" stroke="#000" strokeWidth="2" />
    <rect x="4" y="30" width="32" height="6" fill="#888" stroke="#000" strokeWidth="1" />
    <circle cx="10" cy="10" r="4" fill="#FF3333" /><circle cx="20" cy="8" r="4" fill="#3366FF" />
    <circle cx="30" cy="10" r="4" fill="#FFDD00" /><circle cx="14" cy="18" r="4" fill="#33AA33" />
    <circle cx="26" cy="18" r="4" fill="#FF8800" />
    <rect x="30" y="2" width="4" height="12" fill="#8B4513" />
    <polygon points="30,14 34,14 32,20" fill="#888" />
  </svg>
);

const IconFlipbook: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {[4, 8, 12].map(x => <rect key={x} x={x} y="4" width="26" height="32" fill="#F5F0E8" stroke="#555" strokeWidth="1" rx="1" />)}
    <rect x="14" y="4" width="24" height="32" fill="#FFF" stroke="#000" strokeWidth="1.5" rx="1" />
    <circle cx="26" cy="12" r="3" fill="#000" />
    <line x1="26" y1="15" x2="26" y2="24" stroke="#000" strokeWidth="1.5" />
    <line x1="26" y1="18" x2="20" y2="22" stroke="#000" strokeWidth="1.5" />
    <line x1="26" y1="18" x2="32" y2="21" stroke="#000" strokeWidth="1.5" />
    <line x1="26" y1="24" x2="22" y2="30" stroke="#000" strokeWidth="1.5" />
    <line x1="26" y1="24" x2="30" y2="30" stroke="#000" strokeWidth="1.5" />
  </svg>
);

const IconBlock: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <polygon points="20,4 36,14 36,30 20,36 4,26 4,14" fill="#33AA33" stroke="#000" strokeWidth="1.5" />
    <polygon points="20,4 36,14 20,20 4,14" fill="#55DD55" stroke="#000" strokeWidth="1" />
    <polygon points="20,20 36,14 36,30 20,36" fill="#116611" stroke="#000" strokeWidth="1" />
    <polygon points="4,14 20,20 20,36 4,26" fill="#228822" stroke="#000" strokeWidth="1" />
  </svg>
);

const IconTerminal: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="2" y="4" width="36" height="32" fill="#000" stroke="#444" strokeWidth="2" />
    <text x="5" y="17" fontFamily="Courier New" fontSize="8" fill="#00FF00">&gt; run.py</text>
    <text x="5" y="25" fontFamily="Courier New" fontSize="8" fill="#00FF00">Hello World</text>
    <text x="5" y="33" fontFamily="Courier New" fontSize="7" fill="#00AA00">&gt; _</text>
  </svg>
);

const IconAdobe: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="2" y="2" width="36" height="36" fill="#C0C0C0" stroke="#000" strokeWidth="1.5" />
    <rect x="6" y="8" width="28" height="12" fill="#FFF" stroke="#888" strokeWidth="1" />
    <rect x="7" y="9" width="20" height="10" fill="#000080" />
    <text x="8" y="17" fontFamily="Courier New" fontSize="7" fill="#FFF">72%</text>
    <text x="6" y="29" fontFamily="Courier New" fontSize="7" fill="#000080">ILLUSTRATOR</text>
    <text x="6" y="36" fontFamily="Courier New" fontSize="6" fill="#444">v6.0.1</text>
  </svg>
);

const IconDoc: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="6" y="2" width="24" height="30" fill="#FFF" stroke="#000" strokeWidth="1.5" />
    <polygon points="24,2 30,2 30,8" fill="#C0C0C0" stroke="#000" strokeWidth="1" />
    <line x1="24" y1="2" x2="24" y2="8" stroke="#000" strokeWidth="1" />
    <line x1="24" y1="8" x2="30" y2="8" stroke="#000" strokeWidth="1" />
    <line x1="10" y1="14" x2="26" y2="14" stroke="#888" strokeWidth="1" />
    <line x1="10" y1="18" x2="26" y2="18" stroke="#888" strokeWidth="1" />
    <line x1="10" y1="22" x2="22" y2="22" stroke="#888" strokeWidth="1" />
    <text x="6" y="38" fontFamily="Courier New" fontSize="7" fill="#000080">.txt</text>
  </svg>
);

const IconCD: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="17" fill="#D8D8D8" stroke="#000" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="11" fill="none" stroke="#A0A0A0" strokeWidth="4" />
    <circle cx="20" cy="20" r="3.5" fill="#FFF" stroke="#808080" strokeWidth="1" />
    <path d="M 6 14 Q 20 4 34 14" stroke="#FF0080" strokeWidth="1.5" fill="none" opacity="0.5" />
    <path d="M 5 18 Q 20 6 35 18" stroke="#0080FF" strokeWidth="1.5" fill="none" opacity="0.5" />
  </svg>
);

const IconTrash: React.FC<{ full?: boolean; size?: number }> = ({ full = false, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <rect x="8" y="14" width="24" height="22" fill="#C0C0C0" stroke="#000" strokeWidth="1.5" />
    <line x1="8" y1="21" x2="32" y2="21" stroke="#888" strokeWidth="1" />
    <line x1="8" y1="28" x2="32" y2="28" stroke="#888" strokeWidth="1" />
    <rect x="6" y="10" width="28" height="5" fill="#A0A0A0" stroke="#000" strokeWidth="1.5" />
    <rect x="16" y="6" width="8" height="5" fill="none" stroke="#000" strokeWidth="1.5" />
    {full && <>
      <ellipse cx="16" cy="18" rx="4" ry="3" fill="#F5F0E8" stroke="#888" strokeWidth="1" transform="rotate(-15,16,18)" />
      <ellipse cx="24" cy="17" rx="3" ry="2.5" fill="#F5F0E8" stroke="#888" strokeWidth="1" transform="rotate(10,24,17)" />
    </>}
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────
type WindowId = 'age8' | 'age10' | 'age11' | 'age14' | 'age17' | 'academic' | 'installer';

interface WinState {
  id: WindowId;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized?: boolean;
  zIndex: number;
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const completeCalled = useRef(false);

  useEffect(() => {
    const total = 1500, step = 40, steps = total / step;
    let cur = 0;
    const id = setInterval(() => {
      cur++;
      setProgress(Math.min(Math.round((cur / steps) * 100), 100));
      if (cur >= steps) {
        clearInterval(id);
        if (!completeCalled.current) {
          completeCalled.current = true;
          setTimeout(onComplete, 300);
        }
      }
    }, step);
    return () => clearInterval(id);
  }, [onComplete]);

  return (
    <div className="l2-loader">
      <div className="l2-loader__card">
        <div className="l2-loader__title">HarshOS 98</div>
        <div className="l2-loader__subtitle">LOADING SYSTEM ENVIRONMENT...</div>
        <div className="l2-loader__bar-track">
          <div className="l2-loader__bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="l2-loader__percent">{progress}%</div>
      </div>
    </div>
  );
};

// ─── Draggable Desktop Icon ───────────────────────────────────────────────────
interface DeskIconProps {
  id: WindowId;
  icon: React.ReactNode;
  label: string;
  onOpen: (id: WindowId) => void;
  onDroppedOnBin: (id: WindowId) => void;
  binRef: React.RefObject<HTMLDivElement | null>;
}

const DeskIcon: React.FC<DeskIconProps> = ({ id, icon, label, onOpen, onDroppedOnBin, binRef }) => {
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasDragged = useRef(false);

  const handleDragEnd = useCallback((_e: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number } }) => {
    if (!binRef.current) return;
    const rect = binRef.current.getBoundingClientRect();
    const { x, y } = info.point;
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      onDroppedOnBin(id);
    }
  }, [id, binRef, onDroppedOnBin]);

  return (
    <motion.div
      className="l2__icon-wrapper"
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => { wasDragged.current = true; }}
      onDragEnd={handleDragEnd as Parameters<typeof motion.div>[0]['onDragEnd']}
      onClick={() => {
        if (!wasDragged.current) {
          if (clickTimer.current) clearTimeout(clickTimer.current);
          clickTimer.current = setTimeout(() => onOpen(id), 200);
        }
        wasDragged.current = false;
      }}
      whileDrag={{ scale: 1.08, opacity: 0.85 }}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div className="l2__icon-glyph">{icon}</div>
      <div className="l2__icon-label">{label}</div>
    </motion.div>
  );
};

// ─── Draggable Window ─────────────────────────────────────────────────────────
interface WinProps {
  win: WinState;
  isActive: boolean;
  children: React.ReactNode;
  onFocus: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  initialX: number;
  initialY: number;
  defaultWidth?: number;
}

const DraggableWindow: React.FC<WinProps> = ({ win, isActive, children, onFocus, onClose, onMinimize, initialX, initialY, defaultWidth }) => {
  const dragControls = useDragControls();

  if (win.isMinimized) return null;

  return (
    <motion.div
      className={`l2__window${isActive ? ' l2__window--active' : ''}`}
      style={{ zIndex: win.zIndex, position: 'absolute', width: defaultWidth ?? 480, maxWidth: '92vw' }}
      initial={{ x: initialX, y: initialY, opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.12 }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onPointerDown={() => onFocus(win.id)}
    >
      <div
        className="l2__window-titlebar"
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="l2__window-titlebar-left">
          <span>{win.title}</span>
        </div>
        <div className="l2__window-controls">
          <button
            className="l2__window-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onMinimize(win.id)}
            title="Minimize"
          >_</button>
          <button
            className="l2__window-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onClose(win.id)}
            title="Close"
          >×</button>
        </div>
      </div>
      <div className="l2__window-menubar">
        <WindowDropdown label="File" onCloseWindow={() => onClose(win.id)} />
        <WindowDropdown label="Edit" />
        <WindowDropdown label="View" />
        <WindowDropdown label="Help" />
      </div>
      <div className="l2__window-content">{children}</div>
    </motion.div>
  );
};

// ─── Window Content ───────────────────────────────────────────────────────────
const WINDOW_CONTENT: Record<WindowId, { title: string; defaultWidth?: number; body: React.ReactNode }> = {
  age8: { title: 'Age_8.exe', defaultWidth: 460, body: <div className="l2__content-layout l2__content-layout--landscape"><div className="l2__text-box"><div className="l2__section-title">The First Canvas</div><div className="l2__text">Age 8. Before code, there was the blank page. Sketchbooks, craft paper, and MS Paint on a borrowed PC. The instinct to <strong>make things look good</strong> started here.</div></div><div className="l2__image-container"><img src="/assets/age8_1.png" className="l2__image" alt="Age 8" /><div className="l2__image-overlay" /></div></div> },
  age10: { title: 'Age_10.exe', defaultWidth: 540, body: <div className="l2__content-layout l2__content-layout--portrait"><div className="l2__text-box"><div className="l2__section-title">Motion & Sequence</div><div className="l2__text">Age 10. Filling notebooks with stick figures that walked, jumped, and fought. Earliest intuition for <strong>UX timing and transitions</strong>.</div></div><div className="l2__image-container"><img src="/assets/age10_1.png" className="l2__image" alt="Age 10" /><div className="l2__image-overlay" /></div></div> },
  age11: { title: 'Age_11.exe', defaultWidth: 460, body: <div className="l2__content-layout l2__content-layout--landscape"><div className="l2__text-box"><div className="l2__section-title">First Logic Systems</div><div className="l2__text">Age 11. Paint 3D unlocked a dimension. Roblox showed that games are just <strong>logic trees</strong>. Scratch was the first time code produced something visible.</div></div><div className="l2__image-container"><img src="/assets/age11_1.png" className="l2__image" alt="Age 11" /><div className="l2__image-overlay" /></div></div> },
  age14: { title: 'Age_14.exe', defaultWidth: 540, body: <div className="l2__content-layout l2__content-layout--portrait"><div className="l2__text-box"><div className="l2__section-title">Proper Syntax</div><div className="l2__text">Age 14. A school course introduced <strong>Java</strong>. Self-taught <strong>Python</strong> followed. Writing <code style={{ background: '#EEE', padding: '0 3px' }}>print("Hello World")</code> felt like speaking to the machine.</div></div><div className="l2__image-container"><img src="/assets/age14_1.png" className="l2__image" alt="Age 14" /><div className="l2__image-overlay" /></div></div> },
  age17: { title: 'Age_17.exe', defaultWidth: 460, body: <div className="l2__content-layout l2__content-layout--landscape"><div className="l2__text-box"><div className="l2__section-title">Craft Meets Code</div><div className="l2__text">Age 17. Adobe Illustrator and Photoshop brought design precision. Python projects started merging with visual output. The first realisation that <strong>engineering and design are not separate fields</strong>.</div></div><div className="l2__image-container"><img src="/assets/age17_1.png" className="l2__image" alt="Age 17" /><div className="l2__image-overlay" /></div></div> },
  academic: { title: 'MPSTME_CGPA.txt', defaultWidth: 380, body: <div className="l2__text-box"><div className="l2__section-title">NMIMS MPSTME</div><div className="l2__text" style={{ fontSize: 12, marginBottom: 8 }}>B.Tech Integrated Computer Engineering (Age 15 - 21)</div><div className="l2__cgpa-list"><div className="l2__cgpa-item"><span className="l2__cgpa-sem">Sem 1</span><span className="l2__cgpa-grade">3.71</span></div><div className="l2__cgpa-item"><span className="l2__cgpa-sem">Sem 2</span><span className="l2__cgpa-grade">3.72</span></div><div className="l2__cgpa-item"><span className="l2__cgpa-sem">Sem 3</span><span className="l2__cgpa-grade">3.46</span></div><div className="l2__cgpa-item"><span className="l2__cgpa-sem">Sem 4</span><span className="l2__cgpa-grade">3.55</span></div><div className="l2__cgpa-item"><span className="l2__cgpa-sem">Sem 5</span><span className="l2__cgpa-grade">3.57</span></div><div className="l2__cgpa-item"><span className="l2__cgpa-sem">Sem 6</span><span className="l2__cgpa-grade">3.55</span></div><div className="l2__cgpa-item"><span className="l2__cgpa-sem">Sem 7</span><span className="l2__cgpa-grade">3.54</span></div><div className="l2__cgpa-item"><span className="l2__cgpa-sem">Sem 8</span><span className="l2__cgpa-grade">3.48</span></div><div className="l2__cgpa-item"><span className="l2__cgpa-sem">Sem 9</span><span className="l2__cgpa-grade">3.49</span></div><div className="l2__cgpa-item"><span className="l2__cgpa-sem">Sem 10</span><span className="l2__cgpa-grade">3.52</span></div></div><div className="l2__text" style={{ fontSize: 11, fontStyle: 'italic', marginTop: 8, color: '#555' }}>2 sems left.</div></div> },
  installer: { title: 'Install_System_Update.exe', defaultWidth: 380, body: <></> }
};

const ICONS: { id: WindowId; icon: React.ReactNode; label: string }[] = [
  { id: 'age8', icon: <IconPalette />, label: 'Age_8.exe' },
  { id: 'age10', icon: <IconFlipbook />, label: 'Age_10.exe' },
  { id: 'age11', icon: <IconBlock />, label: 'Age_11.exe' },
  { id: 'age14', icon: <IconTerminal />, label: 'Age_14.exe' },
  { id: 'age17', icon: <IconAdobe />, label: 'Age_17.exe' },
  { id: 'academic', icon: <IconDoc />, label: 'MPSTME_CGPA.txt' },
  { id: 'installer', icon: <IconCD />, label: 'Install_Update.exe' },
];

const Level2_RetroOS: React.FC = () => {
  const setLevel = usePortfolioStore((s) => s.setLevel);
  const [loaded, setLoaded] = useState(false);
  const [topZ, setTopZ] = useState(20);
  const [activeId, setActiveId] = useState<WindowId | null>(null);
  const [isShuttingDown, setShutdown] = useState(false);
  const [trashFull, setTrashFull] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const binRef = useRef<HTMLDivElement>(null);

  const initWinState = (): Record<WindowId, WinState> =>
    Object.fromEntries(ICONS.map(i => [i.id, { id: i.id, title: WINDOW_CONTENT[i.id].title, icon: i.icon, isOpen: false, zIndex: 20 }])) as Record<WindowId, WinState>;

  const [wins, setWins] = useState<Record<WindowId, WinState>>(initWinState);

  const bringToFront = (id: WindowId) => {
    setTopZ(z => z + 1);
    setActiveId(id);
    setWins(w => ({ ...w, [id]: { ...w[id], zIndex: topZ + 1, isMinimized: false } }));
  };

  const openWindow = (id: WindowId) => {
    if (!wins[id].isOpen) {
      setWins(w => ({ ...w, [id]: { ...w[id], isOpen: true, isMinimized: false } }));
    }
    bringToFront(id);
  };

  const closeWindow = (id: WindowId) => {
    setWins(w => ({ ...w, [id]: { ...w[id], isOpen: false } }));
    if (activeId === id) setActiveId(null);
  };

  const minimizeWindow = (id: WindowId) => {
    setWins(w => ({ ...w, [id]: { ...w[id], isMinimized: true } }));
    if (activeId === id) setActiveId(null);
  };

  const toggleTaskbarWindow = (id: WindowId) => {
    if (wins[id].isMinimized) {
      bringToFront(id);
    } else if (activeId === id) {
      minimizeWindow(id);
    } else {
      bringToFront(id);
    }
  };

  const triggerShutdown = useCallback(() => {
    setShutdown(true);
    setTimeout(() => setLevel(3), 2000);
  }, [setLevel]);

  const handleDropOnBin = useCallback((id: WindowId) => {
    setTrashFull(true);
    closeWindow(id);
    setAlertMsg(`Moved ${WINDOW_CONTENT[id].title} to Recycle Bin.`);
    setShowAlert(true);
  }, []);

  if (!loaded) return <LoadingScreen onComplete={() => setLoaded(true)} />;

  const winOffsets: Record<WindowId, { x: number; y: number }> = {
    age8: { x: 100, y: 40 }, age10: { x: 160, y: 70 }, age11: { x: 220, y: 100 },
    age14: { x: 130, y: 60 }, age17: { x: 200, y: 80 }, academic: { x: 250, y: 50 }, installer: { x: 300, y: 120 }
  };

  return (
    <div className="l2">
      <div className="l2__desktop-area">
        <div className="l2__desktop-icons">
          {ICONS.map(item => (
            <DeskIcon key={item.id} {...item} onOpen={openWindow} onDroppedOnBin={handleDropOnBin} binRef={binRef} />
          ))}
        </div>
        <div className="l2__recycle-bin-wrapper" ref={binRef}>
          <IconTrash full={trashFull} size={44} />
          <div className="l2__recycle-label">Recycle Bin</div>
        </div>
        {Object.values(wins).filter(w => w.isOpen).map(win => (
          <DraggableWindow
            key={win.id}
            win={win}
            isActive={activeId === win.id}
            onFocus={bringToFront}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            initialX={winOffsets[win.id].x}
            initialY={winOffsets[win.id].y}
            defaultWidth={WINDOW_CONTENT[win.id].defaultWidth}
          >
            {win.id === 'installer' ? (
              <div className="l2__text-box">
                <div className="l2__section-title">System Update Ready</div>
                <div className="l2__installer-text">
                  <strong>WARNING:</strong> Installing will replace the current OS environment.<br /><br />
                  Proceed with installation?
                </div>
                <div className="l2__btn-group" style={{ marginTop: 12 }}>
                  <button className="l2__btn" onClick={triggerShutdown}>Install Now</button>
                  <button className="l2__btn" onClick={() => closeWindow('installer')}>Cancel</button>
                </div>
              </div>
            ) : (
              WINDOW_CONTENT[win.id].body
            )}
          </DraggableWindow>
        ))}

        {/* Recycle Bin Alert */}
        {showAlert && (
          <div className="l2__alert-overlay" onClick={() => setShowAlert(false)}>
            <motion.div
              className="l2__window l2__window--active"
              style={{ zIndex: 8001, position: 'relative', minWidth: 340, maxWidth: 420 }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="l2__window-titlebar">
                <div className="l2__window-titlebar-left"><span>Recycle Bin</span></div>
                <div className="l2__window-controls">
                  <button className="l2__window-btn" onClick={() => setShowAlert(false)}>×</button>
                </div>
              </div>
              <div className="l2__window-menubar">
                {['File', 'Edit', 'View'].map(m => <span key={m} className="l2__window-menu-item">{m}</span>)}
              </div>
              <div className="l2__window-content" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}><IconTrash full size={48} /></div>
                <div className="l2__text" style={{ textAlign: 'center' }}>
                  {alertMsg}
                </div>
                <div className="l2__btn-group" style={{ marginTop: 12 }}>
                  <button className="l2__btn" onClick={() => { setShowAlert(false); setTrashFull(false); }}>
                    Empty Bin
                  </button>
                  <button className="l2__btn" onClick={() => setShowAlert(false)}>
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* ── Bottom Taskbar / Dock ── */}
      <div className="l2__taskbar">
        {Object.values(wins).filter(w => w.isOpen).map(win => (
          <button
            key={win.id}
            className={`l2__taskbar-btn ${activeId === win.id && !win.isMinimized ? 'l2__taskbar-btn--active' : ''}`}
            onClick={() => toggleTaskbarWindow(win.id)}
            title={win.title}
          >
            <div className="l2__taskbar-icon-wrap">{win.icon}</div>
          </button>
        ))}
      </div>

      {/* Shutdown Overlay */}
      <div className={`l2__shutdown-overlay ${isShuttingDown ? 'l2__shutdown-overlay--active' : ''}`}>
        SHUTTING DOWN...
      </div>

      <Screensaver />
    </div>
  );
};

export default Level2_RetroOS;
