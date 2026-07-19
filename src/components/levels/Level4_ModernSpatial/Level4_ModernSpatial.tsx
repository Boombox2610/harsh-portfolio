import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { usePortfolioStore } from '../../../store/usePortfolioStore';
import './Level4_ModernSpatial.css';
import BracketCursor from '../../shared/BracketCursor';

// ─── Project Data ────────────────────────────────────────────────────────────

interface Project {
  id: string;
  title: string;
  tagline: string;
  tags: string[];
  description: string;
  stats?: { value: string; label: string }[];
  techStack: string[];
  credits?: string;
  extraContent?: React.ReactNode;
}

const PROJECTS: Project[] = [
  {
    id: 'gesto-drive',
    title: 'Gesto-Drive',
    tagline: 'Gaming by Hand — Human-Computer Interaction via real-time hand tracking.',
    tags: ['HCI', 'Computer Vision', 'IEEE Published'],
    description:
      'A system utilizing OpenCV and MediaPipe to translate real-time hand coordinates into physical game controls. Presented and published as primary author at the IEEE ICECER 2025 conference in Madagascar.',
    stats: [
      { value: '1st Place', label: 'TechSafar TechSkript\'25' },
      { value: '94%', label: 'Max Accuracy' },
      { value: '22–29ms', label: 'Latency' },
      { value: 'IEEE 2025', label: 'Published' },
    ],
    techStack: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'HID Protocol'],
    credits: 'Co-created with Raj Kothari, Bhavya Sanghrajka, Akshat Mangle & Prof. Tazeen Sheikh',
  },
  {
    id: 'gesto-chair',
    title: 'Gesto-Chair',
    tagline: 'Low-cost, multi-modal, non-invasive wheelchair retrofit platform.',
    tags: ['Arduino', 'Accessibility', 'Hackathon Winner'],
    description:
      'A 5-in-1 human interface integrating voice control and a wearable gesture glove to combat muscle fatigue for wheelchair users. Built on Arduino architecture for under ₹14,000. Secured 3rd place at the Tech Hackathon on Disability Inclusion by NMIMS × Mirae Asset 2026.',
    stats: [
      { value: '₹14K', label: 'Build Cost' },
      { value: '5-in-1', label: 'Interface Modes' },
      { value: '3rd Place', label: 'NMIMS Mirae 2026' },
    ],
    techStack: ['Arduino', 'Embedded C', 'Voice Recognition', 'Gesture Glove', 'MPU6050'],
  },
  {
    id: 'ai-pin',
    title: 'AI Pin',
    tagline: 'Wearable voice assistant — edge processing meets cloud intelligence.',
    tags: ['ESP32-S3', 'Docker', 'Microservices'],
    description:
      'Powered by an ESP32-S3 handling edge processing and local buffer streaming over WebSockets. Scaled via an asynchronous 7-queue Docker Compose microservices infrastructure processing Silero VAD, GPU Faster-Whisper, and a triple-redundant LLM fallback loop (Groq → Gemini → OpenRouter).',
    stats: [
      { value: '1.2s', label: 'End-to-End Latency' },
      { value: '99.97%', label: 'Intent Uptime' },
      { value: '7', label: 'Async Queues' },
    ],
    techStack: ['ESP32-S3', 'WebSockets', 'Docker Compose', 'RabbitMQ', 'Faster-Whisper', 'Silero VAD', 'Python', 'Groq', 'Gemini API'],
  },
  {
    id: 'calcount',
    title: 'CalCount',
    tagline: 'Full-stack calorie tracking with edge AI and CQRS architecture.',
    tags: ['CQRS', 'YOLOv8', 'Circuit Breaker'],
    description:
      'Leverages an ESP32-S3 network node polling an HX711 ADC linked to local YOLOv8 object detection with a Gemini API fallback. Implements a CQRS engine isolating heavy writes (PostgreSQL) from ultra-fast query reads (Redis cache) to keep mobile latency under 10ms. Automatic Circuit Breaker maps 4 operational states.',
    stats: [
      { value: '<10ms', label: 'Query Latency' },
      { value: '4 States', label: 'Circuit Breaker' },
      { value: 'CQRS', label: 'Architecture' },
    ],
    techStack: ['ESP32-S3', 'HX711', 'YOLOv8', 'PostgreSQL', 'Redis', 'Gemini API', 'React Native', 'Node.js'],
  },
  {
    id: 'fitcheck',
    title: 'FitCheck',
    tagline: 'Mood-driven AI fashion outfit generator.',
    tags: ['Android', 'Flask', 'Gemini AI'],
    description:
      'An Android application utilizing Android Studio, Flask, and the Gemini API to generate personalized fashion outfit visualizations based on mood input.',
    techStack: ['Android Studio', 'Kotlin', 'Flask', 'Gemini API', 'Python'],
  },
  {
    id: 'esp32-eink',
    title: 'ESP32 E-Ink UPI',
    tagline: 'IoT-to-cloud secure UPI rendering on e-ink displays.',
    tags: ['IoT', 'PHP', 'E-Ink'],
    description:
      'An IoT device using secure JSON-based HTTP over PHP to dynamically render secure UPI codes on e-ink displays. Designed for low-power merchant terminals.',
    techStack: ['ESP32', 'E-Ink Display', 'PHP', 'JSON HTTP', 'IoT'],
  },
  {
    id: 'quadstreamcv',
    title: 'QuadStreamCV',
    tagline: 'Custom quadcopter with live pose-detection inference.',
    tags: ['ROS', 'Drone', '1st Place Polarizer'],
    description:
      'Custom built and tuned quadcopter drone processing live pose-detection inference via ROS-Foxy and Ubuntu 22. Won 1st Place at NMIMS Polarizer 2024.',
    stats: [
      { value: '1st Place', label: 'NMIMS Polarizer 2024' },
    ],
    techStack: ['ROS Foxy', 'Ubuntu 22', 'Python', 'OpenCV', 'PX4', 'Custom Frame'],
  },
  {
    id: 'jio-platforms',
    title: 'Jio Platforms Ltd.',
    tagline: 'Summer internship — core platform connectivity optimization.',
    tags: ['Internship', 'YOLO', 'QLORA'],
    description:
      'Optimized core platform connectivity infrastructures at Jio Platforms using YOLO visual models and QLORA quantization scaling for production-grade performance.',
    techStack: ['YOLO', 'QLORA', 'Python', 'PyTorch', 'Infrastructure'],
  },
];

// ─── Work Card ────────────────────────────────────────────────────────────────

interface WorkCardProps {
  project: Project;
  index: number;
  onSelect: (id: string) => void;
}

const WorkCard: React.FC<WorkCardProps> = ({ project, index, onSelect }) => {
  return (
    <motion.div
      className="l4__work-card"
      data-cursor-expand
      onClick={() => onSelect(project.id)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <div className="l4__work-card-index">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="l4__work-card-title">{project.title}</div>
      <div className="l4__work-card-tags">
        {project.tags.map(t => <span key={t} className="l4__work-tag">{t}</span>)}
      </div>
      <div className="l4__work-card-brief">{project.tagline}</div>
    </motion.div>
  );
};

// ─── Case Study View ─────────────────────────────────────────────────────────

interface CaseStudyProps {
  project: Project;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  nextTitle: string | null;
}

const CaseStudy: React.FC<CaseStudyProps> = ({ project, index, onClose, onNext, nextTitle }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const fadeOpacity = useTransform(scrollY, [150, 350], [1, 0]);
  const [activeTab, setActiveTab] = useState<'interface' | 'architecture'>('interface');

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [project.id]);

  return (
    <motion.div
      ref={containerRef}
      className="l4__case-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button className="l4__case-close" onClick={onClose} data-cursor-expand="true">
        [ close ]
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Sticky Hero */}
          <div className="l4__case-hero">
            <motion.div style={{ opacity: fadeOpacity }} className="l4__case-hero-index">
              {String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
            </motion.div>
            <h1 className="l4__case-hero-title">{project.title}</h1>
            <motion.p style={{ opacity: fadeOpacity }} className="l4__case-hero-tagline">{project.tagline}</motion.p>
          </div>

          {['gesto-drive', 'gesto-chair', 'ai-pin', 'esp32-eink', 'quadstreamcv'].includes(project.id) && (
            <video src={`/assets/${project.id === 'quadstreamcv' ? 'drone2' : project.id}.mp4`} autoPlay loop muted playsInline className="l4__case-video" />
          )}

          {/* Scrollable Body */}
          <div className="l4__case-body">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="l4__case-section-label">[ the process ]</div>
              <p className="l4__case-text">{project.description}</p>
            </motion.div>

            {project.stats && (
              <motion.div
                className="l4__case-stats"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {project.stats.map(s => (
                  <div key={s.label} className="l4__case-stat">
                    <div className="l4__case-stat-value">{s.value}</div>
                    <div className="l4__case-stat-label">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            )}

            {project.id === 'gesto-drive' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
              >
                <div className="l4__case-section-label">[ the architecture ]</div>
                <div className="l4__case-diagram-container">
                  <div className="l4__diagram">
                    {/* Row 1 */}
                    <div className="l4__diagram-row">
                      <div className="l4__diagram-node">Video Stream</div>
                      <div className="l4__diagram-line-right"></div>
                      <div className="l4__diagram-node">Image</div>
                      <div className="l4__diagram-line-right"></div>
                      <div className="l4__diagram-node">Detection</div>
                      <div className="l4__diagram-line-right"></div>
                      <div className="l4__diagram-node">Pre-processing</div>
                    </div>
                    {/* Vertical 1 */}
                    <div className="l4__diagram-row l4__diagram-row--right-align">
                      <div className="l4__diagram-line-vert"></div>
                    </div>
                    {/* Row 2 */}
                    <div className="l4__diagram-row l4__diagram-row--right-align">
                      <div className="l4__diagram-node">Feature Extraction</div>
                    </div>
                    {/* Vertical 2 */}
                    <div className="l4__diagram-row l4__diagram-row--right-align">
                      <div className="l4__diagram-line-vert"></div>
                    </div>
                    {/* Row 3 */}
                    <div className="l4__diagram-row">
                      <div className="l4__diagram-node">Game Input</div>
                      <div className="l4__diagram-line-left"></div>
                      <div className="l4__diagram-node">Decision</div>
                      <div className="l4__diagram-line-left"></div>
                      <div className="l4__diagram-node">Recognition</div>
                      <div className="l4__diagram-line-left"></div>
                      <div className="l4__diagram-node l4__diagram-node--db">Gesture DB</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {project.id === 'gesto-chair' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
              >
                <div className="l4__case-section-label">[ the architecture ]</div>
                <div className="l4__case-diagram-container">
                  <div className="l4__gc-diagram">
                    <div className="l4__gc-inputs">
                      <div className="l4__gc-column">
                        <div className="l4__gc-node l4__gc-node--input">Gesture / Joystick</div>
                        <div className="l4__gc-arrow-down"></div>
                        <div className="l4__gc-node">Data Processing<br /><span className="l4__gc-sub">Arduino ATMega 32A</span></div>
                        <div className="l4__gc-arrow-down l4__gc-arrow-down--dashed"></div>
                        <div className="l4__gc-node l4__gc-node--logic">Decision Logic<br /><span className="l4__gc-sub">Analog Thresholds</span></div>
                      </div>

                      <div className="l4__gc-column l4__gc-column--center">
                        <div className="l4__gc-divider">OR</div>
                      </div>

                      <div className="l4__gc-column">
                        <div className="l4__gc-node l4__gc-node--input">Phone Input</div>
                        <div className="l4__gc-arrow-down"></div>
                        <div className="l4__gc-node">Data Processing<br /><span className="l4__gc-sub">Bluetooth Parsing</span></div>
                        <div className="l4__gc-arrow-down l4__gc-arrow-down--dashed"></div>
                        <div className="l4__gc-node l4__gc-node--logic">Decision Logic<br /><span className="l4__gc-sub">Char Commands</span></div>
                      </div>
                    </div>

                    <div className="l4__gc-arrow-right"></div>

                    <div className="l4__gc-column">
                      <div className="l4__gc-node l4__gc-node--output">Wireless Comms<br /><span className="l4__gc-sub">BT HC-05 2.4GHz</span></div>
                      <div className="l4__gc-arrow-down"></div>
                      <div className="l4__gc-node l4__gc-node--output">Actuation<br /><span className="l4__gc-sub">L293D / DC Motors</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="l4__case-section-label">[ tech stack ]</div>
              <div className="l4__case-tech-grid">
                {project.techStack.map(t => (
                  <span key={t} className="l4__case-tech-pill">{t}</span>
                ))}
              </div>
            </motion.div>

            {project.id === 'ai-pin' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
              >
                <div className="l4__case-section-label" style={{ marginTop: '0' }}>[ the architecture ]</div>
                <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
                  <img src="/assets/ai-pin-architecture.jpeg" alt="AI Pin Architecture" style={{ width: '100%', borderRadius: '4px', border: '1px solid #333' }} />
                </div>
              </motion.div>
            )}

            {project.id === 'fitcheck' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 }}
              >
                <div className="l4__tab-bar">
                  <button
                    className={`l4__tab-btn ${activeTab === 'interface' ? 'l4__tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('interface')}
                    data-cursor-expand="true"
                  >
                    [ interface ]
                  </button>
                  <button
                    className={`l4__tab-btn ${activeTab === 'architecture' ? 'l4__tab-btn--active' : ''}`}
                    onClick={() => setActiveTab('architecture')}
                    data-cursor-expand="true"
                  >
                    [ architecture & flow ]
                  </button>
                </div>

                {activeTab === 'interface' && (
                  <div className="l4__case-horizontal-scroll">
                    <img src="/assets/fitcheck-loginUI.png" alt="Login UI" />
                    <img src="/assets/fitcheck-formUI.png" alt="Form UI" />
                    <img src="/assets/fitcheck-gen1UI.png" alt="Gen 1 UI" />
                    <img src="/assets/fitcheck-gen2UI.png" alt="Gen 2 UI" />
                    <img src="/assets/fitcheck-accountUI.png" alt="Account UI" />
                  </div>
                )}

                {activeTab === 'architecture' && (
                  <div className="l4__case-diagram-container">
                    {/* 1. SDLC */}
                    <div className="l4__case-section-label" style={{ marginTop: '2rem' }}>[ sdlc ]</div>
                    <div className="l4__gc-diagram" style={{ marginBottom: '4rem' }}>
                      <div className="l4__gc-column">
                        <div className="l4__gc-node l4__gc-node--input">Requirements</div>
                        <div className="l4__gc-arrow-down"></div>
                        <div className="l4__gc-node">Prototyping</div>
                        <div className="l4__gc-arrow-down"></div>
                        <div className="l4__gc-node">Development<br /><span className="l4__gc-sub">App & Backend</span></div>
                        <div className="l4__gc-arrow-down"></div>
                        <div className="l4__gc-node l4__gc-node--logic">Testing</div>
                        <div className="l4__gc-arrow-down"></div>
                        <div className="l4__gc-node l4__gc-node--output">Deployment</div>
                      </div>
                    </div>

                    {/* 2. Activity Diagram */}
                    <div className="l4__case-section-label">[ activity diagram ]</div>
                    <div className="l4__diagram" style={{ marginBottom: '4rem' }}>
                      <div className="l4__diagram-row">
                        <div className="l4__diagram-node l4__diagram-node--db">Login</div>
                        <div className="l4__diagram-line-right"></div>
                        <div className="l4__diagram-node">Upload Photo</div>
                        <div className="l4__diagram-line-right"></div>
                        <div className="l4__diagram-node">Select Mood</div>
                      </div>
                      <div className="l4__diagram-row l4__diagram-row--right-align">
                        <div className="l4__diagram-line-vert"></div>
                      </div>
                      <div className="l4__diagram-row">
                        <div className="l4__diagram-node l4__diagram-node--output">Show Outfit</div>
                        <div className="l4__diagram-line-left"></div>
                        <div className="l4__diagram-node l4__diagram-node--logic">Gemini Parse</div>
                        <div className="l4__diagram-line-left"></div>
                        <div className="l4__diagram-node">API Request</div>
                      </div>
                    </div>

                    {/* 3. Sequence Diagram */}
                    <div className="l4__case-section-label">[ sequence diagram ]</div>
                    <div className="l4__diagram" style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Mono', fontSize: '11px', color: '#888', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
                        <span>[ Client ]</span><span>[ Server ]</span><span>[ AI Engine ]</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
                        <div className="l4__diagram-node" style={{ flex: 1 }}>Request</div>
                        <div style={{ flex: 2, height: '1px', background: 'dashed 1px #555', margin: '0 16px' }}></div>
                        <div className="l4__diagram-node l4__diagram-node--db" style={{ flex: 1 }}>Auth</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
                        <div style={{ flex: 1 }}></div>
                        <div className="l4__diagram-node l4__diagram-node--db" style={{ flex: 1 }}>Prompt</div>
                        <div style={{ flex: 2, height: '1px', background: 'dashed 1px #555', margin: '0 16px' }}></div>
                        <div className="l4__diagram-node l4__diagram-node--logic" style={{ flex: 1 }}>Generate</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
                        <div className="l4__diagram-node l4__diagram-node--output" style={{ flex: 1 }}>Render</div>
                        <div style={{ flex: 2, height: '1px', background: 'dashed 1px #555', margin: '0 16px' }}></div>
                        <div className="l4__diagram-node l4__diagram-node--db" style={{ flex: 1 }}>Response</div>
                      </div>
                    </div>

                    {/* 4. Class Diagram */}
                    <div className="l4__case-section-label">[ class diagram ]</div>
                    <div className="l4__diagram" style={{ marginBottom: '4rem', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <div style={{ border: '1px solid #444', background: '#111', borderRadius: '4px', padding: '12px', minWidth: '150px' }}>
                        <div style={{ fontFamily: 'Space Mono', color: '#FFF', borderBottom: '1px solid #333', paddingBottom: '4px', marginBottom: '8px' }}>User</div>
                        <div style={{ fontFamily: 'Space Mono', fontSize: '11px', color: '#888' }}>+ id: UUID<br />+ name: String<br />+ login()</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#555' }}>--- 1:N ---</div>
                      <div style={{ border: '1px solid #444', background: '#111', borderRadius: '4px', padding: '12px', minWidth: '150px' }}>
                        <div style={{ fontFamily: 'Space Mono', color: '#FFF', borderBottom: '1px solid #333', paddingBottom: '4px', marginBottom: '8px' }}>Outfit</div>
                        <div style={{ fontFamily: 'Space Mono', fontSize: '11px', color: '#888' }}>+ items: List<br />+ style: String<br />+ generate()</div>
                      </div>
                    </div>

                    {/* 5. State Machine */}
                    <div className="l4__case-section-label">[ state machine ]</div>
                    <div className="l4__gc-diagram" style={{ marginBottom: '4rem' }}>
                      <div className="l4__gc-column">
                        <div className="l4__gc-node">IDLE</div>
                        <div className="l4__gc-arrow-down"></div>
                        <div className="l4__gc-node l4__gc-node--input">AUTH</div>
                        <div className="l4__gc-arrow-down"></div>
                        <div className="l4__gc-node">READY</div>
                        <div className="l4__gc-arrow-down"></div>
                        <div className="l4__gc-node l4__gc-node--logic">GENERATING</div>
                        <div className="l4__gc-arrow-down"></div>
                        <div className="l4__gc-node l4__gc-node--output">VIEWING</div>
                      </div>
                    </div>

                    {/* 6. Use Case */}
                    <div className="l4__case-section-label">[ use case ]</div>
                    <div className="l4__diagram" style={{ marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center' }}>
                      <div style={{ fontFamily: 'Space Mono', color: '#FFF' }}>Actor: User</div>
                      <div style={{ width: '2px', height: '100px', background: '#333' }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="l4__diagram-node">Manage Wardrobe</div>
                        <div className="l4__diagram-node">Generate Outfit</div>
                        <div className="l4__diagram-node">Save Favorites</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {project.id === 'gesto-drive' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.18 }}
              >
                <div className="l4__case-section-label">[ validation ]</div>
                <div className="l4__case-links">
                  <a href="https://ieeexplore.ieee.org/document/11401101" target="_blank" rel="noopener noreferrer" className="l4__case-link" data-cursor-expand="true">IEEE Publication ↗</a>
                  {/* <a href="https://github.com/harsh/gesto-drive" target="_blank" rel="noopener noreferrer" className="l4__case-link" data-cursor-expand="true">View Source Code ↗</a> */}
                </div>
              </motion.div>
            )}

            {project.id === 'gesto-chair' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.18 }}
              >
                <div className="l4__case-section-label">[ validation ]</div>
                <div className="l4__case-links">
                  <a href="https://www.linkedin.com/posts/harsh-maru2610_hackathon-disabilityinclusion-innovation-ugcPost-7438912229619478528-iW6h/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEU_Gm8BG2LbLid22qEdZryjVdlNEk73kLo" target="_blank" rel="noopener noreferrer" className="l4__case-link" data-cursor-expand="true">LinkedIn Post (Hackathon Win) ↗</a>
                </div>
              </motion.div>
            )}

            {project.credits && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="l4__case-credits">{project.credits}</div>
              </motion.div>
            )}
          </div>

          {/* Next Project */}
          {nextTitle && (
            <div className="l4__case-next" onClick={onNext}>
              <div className="l4__case-next-title" data-cursor-expand="true">[ next: {nextTitle.toLowerCase()} ]</div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Hero with Scroll Parallax ───────────────────────────────────────────────

const HeroSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="l4__hero">
      <motion.div style={{ y, opacity }} className="l4__hero">
        <div className="l4__hero-overline">portfolio - 2026</div>
        <h1 className="l4__hero-title l4__hover-blur-trigger" data-cursor-expand="true">
          The Build.
        </h1>
        <p className="l4__hero-subtitle l4__blur-target">
          System-level architectures. From embedded edge nodes to distributed cloud pipelines.
        </p>
        <div className="l4__hero-scroll-hint">↓ scroll to explore</div>
      </motion.div>
    </div>
  );
};

// ─── White Flash Entry ───────────────────────────────────────────────────────

const WhiteFlash: React.FC = () => {
  return (
    <motion.div
      className="l4__white-flash"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
    />
  );
};

// ─── Nav Trigger Component ───────────────────────────────────────────────────

interface NavTriggerProps {
  label: string;
  className: string;
  onClick?: () => void;
  onHoverChange?: (state: boolean) => void;
}

const NavTrigger: React.FC<NavTriggerProps> = ({ label, className, onClick, onHoverChange }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`l4__nav-corner ${className} l4__hover-blur-trigger`}
      data-cursor-expand={label === 'theme' ? "small" : "true"}
      onClick={onClick}
      onMouseEnter={() => { setHovered(true); onHoverChange?.(true); }}
      onMouseLeave={() => { setHovered(false); onHoverChange?.(false); }}
    >
      <div className="l4__nav-trigger-inner">
        <motion.div animate={{ y: hovered && label !== 'theme' ? 15 : 0, opacity: hovered && label !== 'theme' ? 0 : 1 }} transition={{ duration: 0.3 }}>
          {label === 'theme' ? <div className="l4__theme-dot" /> : `[ ${label} ]`}
        </motion.div>
        {label !== 'theme' && (
          <motion.div
            className="l4__nav-trigger-reveal"
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: hovered ? 0 : -15, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const Level4_ModernSpatial: React.FC = () => {
  const setLevel = usePortfolioStore(s => s.setLevel);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [zDiving, setZDiving] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const selectedIndex = useMemo(
    () => PROJECTS.findIndex(p => p.id === selectedId),
    [selectedId]
  );
  const selectedProject = selectedIndex >= 0 ? PROJECTS[selectedIndex] : null;

  const handleNextProject = useCallback(() => {
    if (selectedIndex < PROJECTS.length - 1) {
      setSelectedId(PROJECTS[selectedIndex + 1].id);
    } else {
      setSelectedId(null); // close on last
    }
  }, [selectedIndex]);

  const triggerZDive = useCallback(() => {
    setShowConfirm(false);
    setZDiving(true);
    setTimeout(() => setLevel(5), 2200);
  }, [setLevel]);

  return (
    <div className={`l4 ${isLightMode ? 'l4--light' : ''}`}>
      <WhiteFlash />
      <BracketCursor />

      {/* 4-Corner Spatial Navigation */}
      <NavTrigger
        label="theme"
        className="l4__nav-corner--tl"
        onClick={() => setIsLightMode(!isLightMode)}
      />
      <NavTrigger
        label="initialize_connection"
        className="l4__nav-corner--bc"
        onClick={() => setShowConfirm(true)}
        onHoverChange={(s) => setHoveredNav(s ? 'connect' : null)}
      />
      <NavTrigger
        label="works"
        className="l4__nav-corner--bl"
        onClick={() => document.querySelector('.l4__works-section')?.scrollIntoView({ behavior: 'smooth' })}
        onHoverChange={(s) => setHoveredNav(s ? 'works' : null)}
      />
      <NavTrigger
        label="vision"
        className="l4__nav-corner--br"
        onClick={() => document.querySelector('.l4__vision-section')?.scrollIntoView({ behavior: 'smooth' })}
        onHoverChange={(s) => setHoveredNav(s ? 'vision' : null)}
      />

      {/* Massive Hover Reveals */}
      <AnimatePresence>
        {hoveredNav === 'works' && (
          <motion.div className="l4__massive-reveal l4__massive-reveal--tl" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>Works</motion.div>
        )}
        {hoveredNav === 'vision' && (
          <motion.div className="l4__massive-reveal l4__massive-reveal--tr" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>Vision</motion.div>
        )}
        {hoveredNav === 'connect' && (
          <motion.div className="l4__massive-reveal l4__massive-reveal--tc" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>Connect</motion.div>
        )}
      </AnimatePresence>

      <div className={hoveredNav ? 'l4__blur-active' : ''}>
        {/* Hero */}
        <HeroSection />

        {/* Works Section */}
        <div className="l4__section-header">[ works ]</div>
        <div className="l4__works-section">
          <div className="l4__works-grid">
            {PROJECTS.map((p, i) => (
              <WorkCard
                key={p.id}
                project={p}
                index={i}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </div>

        {/* Vision Statement */}
        <div className="l4__section-header">[ vision ]</div>
        <motion.div
          className="l4__vision-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="l4__vision-text">
            "I see <strong>Andrew Ng</strong> as my professional idol. I want to build and optimize <strong>advanced model architectures</strong> completely from scratch and develop the <strong>production-ready frameworks</strong> required to scale deep learning algorithms to <strong>millions of concurrent users</strong>."
          </div>
        </motion.div>
      </div>

      {/* (Footer removed in favor of TR spatial nav corner) */}

      {/* Case Study Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <CaseStudy
            project={selectedProject}
            index={selectedIndex}
            total={PROJECTS.length}
            onClose={() => setSelectedId(null)}
            onNext={handleNextProject}
            nextTitle={
              selectedIndex < PROJECTS.length - 1
                ? PROJECTS[selectedIndex + 1].title
                : null
            }
          />
        )}
      </AnimatePresence>

      {/* Glassmorphism Confirm */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="l4__confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="l4__confirm-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="l4__confirm-title">Initialize Connection</div>
              <div className="l4__confirm-text">
                You are about to enter the final node. This will terminate the current spatial environment.
              </div>
              <div className="l4__confirm-btns">
                <button
                  className="l4__confirm-btn"
                  onClick={() => setShowConfirm(false)}
                  data-cursor-expand="true"
                >
                  [ cancel ]
                </button>
                <button
                  className="l4__confirm-btn"
                  onClick={triggerZDive}
                  data-cursor-expand="true"
                >
                  [ confirm ]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Z-axis dive transition */}
      <AnimatePresence>
        {zDiving && (
          <motion.div
            className="l4__zdive-overlay"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Screen scale-up effect during z-dive */}
      {zDiving && (
        <style>{`
          .l4 { animation: l4ZDive 2s ease-in forwards; }
          @keyframes l4ZDive {
            0% { transform: scale(1); filter: none; opacity: 1; }
            60% { transform: scale(3); filter: blur(4px); opacity: 0.4; }
            100% { transform: scale(8); filter: blur(10px); opacity: 0; }
          }
        `}</style>
      )}
    </div>
  );
};

export default Level4_ModernSpatial;
