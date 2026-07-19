import React, { useEffect, useState } from 'react';
import { usePortfolioStore } from '../../../store/usePortfolioStore';
import './Level1_Bios.css';

// ─── ASCII Frame Component ───────────────────────────────────────────────────
interface AsciiFrameProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const AsciiFrame: React.FC<AsciiFrameProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`ascii-frame ${className}`}>
      <div className="ascii-row">
        <span aria-hidden="true">╔</span>
        <span className="ascii-h" aria-hidden="true">
          {title ? `═[ ${title} ]` : ''}
          {'═'.repeat(200)}
        </span>
        <span aria-hidden="true">╗</span>
      </div>
      <div className="ascii-mid">
        <div className="ascii-v" aria-hidden="true">
          {'║'.repeat(1000)}
        </div>
        <div className="ascii-content">
          {children}
        </div>
        <div className="ascii-v" aria-hidden="true">
          {'║'.repeat(1000)}
        </div>
      </div>
      <div className="ascii-row">
        <span aria-hidden="true">╚</span>
        <span className="ascii-h" aria-hidden="true">
          {'═'.repeat(200)}
        </span>
        <span aria-hidden="true">╝</span>
      </div>
    </div>
  );
};

// ─── Constants ───────────────────────────────────────────────────────────────
const EARLY_LOGS = [
  "Loading Flip Book Animations...",
  "Initializing Paint 3D...",
  "Compiling first Scratch game...",
  "Executing Java/Python basics...",
  "Joining Committies and Clubs...",
  "Refining Adobe Suite...",
  "Published Research Paper on IEEEXplore...",
  "Cracking first Hackathon...",
  "Making Award Winning Projects...",
  "Deploying MicroServices...",
  "Building Drones...",
  "Interned at Jio Platforms..."
];

const MENU_ITEMS = [
  "HARDWARE DIAGNOSTICS",
  "CORE KERNEL",
  "BOOT LOGS"
];

// ─── Component ───────────────────────────────────────────────────────────────
const Level1_Bios: React.FC = () => {
  const setLevel = usePortfolioStore((s) => s.setLevel);
  const isCreativeMode = usePortfolioStore((s) => s.isCreativeMode);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalSelection, setModalSelection] = useState<'Y' | 'N'>('Y');
  const [glitch, setGlitch] = useState(true);

  // Initial Boot Glitch
  useEffect(() => {
    const timer = setTimeout(() => {
      setGlitch(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Boot logs animation (safely driven by state length)
  useEffect(() => {
    if (selectedIndex !== 2) {
      setLogs([]); // Reset logs when leaving
      return;
    }

    if (logs.length < EARLY_LOGS.length) {
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, EARLY_LOGS[prev.length]]);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [selectedIndex, logs.length]);

  // Auto-transition when modal is open
  useEffect(() => {
    if (showModal && modalSelection === 'Y') {
      const transitionTimer = setTimeout(() => {
        setLevel(isCreativeMode ? 4 : 2);
      }, 1500);
      return () => clearTimeout(transitionTimer);
    }
  }, [showModal, modalSelection, setLevel]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showModal) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          setModalSelection((prev) => (prev === 'Y' ? 'N' : 'Y'));
        } else if (e.key === 'Enter') {
          // Enter is the ONLY key that executes the transition
          if (modalSelection === 'Y') setLevel(isCreativeMode ? 4 : 2);
          else setShowModal(false);
        } else if (e.key === 'Escape') {
          // Escape always cancels
          setShowModal(false);
          setModalSelection('Y');
        }
        // Intentionally no y/n shortcut — user must use arrow keys then Enter
      } else {
        if (e.key === 'F10') {
          e.preventDefault();
          setShowModal(true);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : MENU_ITEMS.length - 1));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev < MENU_ITEMS.length - 1 ? prev + 1 : 0));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, modalSelection, setLevel]);

  return (
    <div className={`l1 anim-fade-up ${glitch ? 'anim-crt-flicker' : ''}`} role="application" aria-label="BIOS TUI - Level 1">
      <div className="l1__layout">
        <div className="l1__header">
          HARSH_MARU BIOS (C) 2002-2026 American Megatrends, Inc.
          {glitch && <span style={{ color: '#FF5555', marginLeft: '1rem' }}>WARNING: System Memory Check — PASSED (16384 MB OK)</span>}
        </div>

        <div className="l1__main-grid">
          {/* ── Left Panel: Menu ────────────────────────────────────────── */}
          <AsciiFrame title="MAIN MENU" className="ascii-frame--menu">
            <div className="l1__menu">
              {MENU_ITEMS.map((item, idx) => (
                <div
                  key={item}
                  className={`l1__menu-item ${selectedIndex === idx ? 'l1__menu-item--active' : ''}`}
                  onClick={() => setSelectedIndex(idx)}
                  role="button"
                  tabIndex={0}
                >
                  [ {item} ]
                </div>
              ))}
            </div>
          </AsciiFrame>

          {/* ── Right Panel: Dynamic Content ──────────────────────────────── */}
          <AsciiFrame title={MENU_ITEMS[selectedIndex]} className="ascii-frame--fill">
            {selectedIndex === 0 && (
              <>
                <div className="l1__stat-row">
                  <span className="l1__stat-label">USER_NAME:</span>
                  <span className="l1__stat-value">Harsh Maru</span>
                </div>
                <div className="l1__stat-row">
                  <span className="l1__stat-label">ARCHITECTURE:</span>
                  <span className="l1__stat-value">B.Tech Integrated Computer Engineering (NMIMS MPSTME)</span>
                </div>
                <div className="l1__stat-row">
                  <span className="l1__stat-label">UPTIME:</span>
                  <span className="l1__stat-value">20 Years</span>
                </div>
                <div className="l1__stat-row">
                  <span className="l1__stat-label">BASE_LOCATION:</span>
                  <span className="l1__stat-value">Mumbai, IND</span>
                </div>

                <div className="l1__skills-group">
                  <span className="l1__skills-label">PRIMARY_SKILLS:</span>
                  <span className="l1__skills-list">
                    System Architecture, Computer Vision, Machine Learning, Artificial Intelligence, GenAI, Scikit-Learn, HCI, Microservices, Kubernetes, LLMs, Fine Tuning, QLoRA, Supabase, PostgreSQL, FastAPI, RabbitMQ, Redis, CQRS, Docker, IBM Watson, Power BI, ArcGIS, Android Studio, Ubuntu, ROS, GCP, ArduPilot, Mission Planner, Drone Piloting, Arduino, IoT, Robotics Automation, Adobe Creative Suite, Figma.
                  </span>
                </div>

                <div className="l1__skills-group">
                  <span className="l1__skills-label">SECONDARY_SKILLS:</span>
                  <span className="l1__skills-list">
                    Team Leadership, Project Planning, Teamwork, Collaboration, Event Logistics, Event Management, Design Team, Creative Content Creation.
                  </span>
                </div>

                <div className="l1__skills-group" style={{ marginTop: '16px' }}>
                  <div className="l1__stat-row">
                    <span className="l1__stat-label">HOBBIES:</span>
                    <span className="l1__stat-value">Guitar, Drone Piloting, Music, Video Editing, Fitness</span>
                  </div>
                </div>
              </>
            )}

            {selectedIndex === 1 && (
              <div className="l1__philosophy-full">
                "My journey in AI/ML is driven by a single philosophy: shifting the standards from making humans adapt to technology, to engineering smart systems that adapt to human needs. Machine learning is the ultimate tool for creative problem-solving and automation."
              </div>
            )}

            {selectedIndex === 2 && (
              <div className="l1__logs-container">
                {logs.map((log, i) => (
                  <div key={i} className="l1__log-line anim-fade-up">
                    <span className="l1__log-ok">[OK]</span> {log}
                  </div>
                ))}
              </div>
            )}
          </AsciiFrame>
        </div>

        <div
          className="l1__action-bar"
          onClick={() => setShowModal(true)}
          role="button"
          tabIndex={0}
        >
          [F10] EXECUTE GUI.EXE
        </div>
      </div>

      {showModal && (
        <div className="l1__modal-overlay">
          <AsciiFrame title="WARNING" className="l1__modal-frame">
            <div className="l1__modal">
              <div className="l1__modal-text">
                Overriding text interface. Proceed? (Y/N)
              </div>
              <div className="l1__modal-actions">
                <button
                  className={`l1__modal-btn ${modalSelection === 'Y' ? 'l1__modal-btn--active' : ''}`}
                  onClick={() => setLevel(2)}
                >
                  [ Y ]
                </button>
                <button
                  className={`l1__modal-btn ${modalSelection === 'N' ? 'l1__modal-btn--active' : ''}`}
                  onClick={() => setShowModal(false)}
                >
                  [ N ]
                </button>
              </div>
            </div>
          </AsciiFrame>
        </div>
      )}
    </div>
  );
};

export default Level1_Bios;
