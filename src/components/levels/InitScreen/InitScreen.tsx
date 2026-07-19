import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { usePortfolioStore, type Level } from '../../../store/usePortfolioStore';
import BracketCursor from '../../shared/BracketCursor';
import './InitScreen.css';

// ─── 3D Story Carousel ──────────────────────────────────────────────────────

const CARDS = [
  { id: 0, era: 'THE SPARK', subtitle: 'Age 8. The first canvas.', targetLevel: 0, image: '/assets/age8_1.png' },
  { id: 1, era: 'THE ORIGIN', subtitle: 'Age 14. First logic.', targetLevel: 1, image: '/assets/age14_1.png' },
  { id: 2, era: 'THE CATALYST', subtitle: 'Age 17. Clubs & craft.', targetLevel: 2, image: '/assets/age17_1.png' },
  { id: 3, era: 'THE BUILD', subtitle: 'Age 20. Real projects.', targetLevel: 4, image: '/assets/ai-pin-architecture.jpeg' },
];

// Mobile users shouldn't have to drag 1200px. Reduce stride to 500px for snappy swiping on small screens.
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const CARD_STRIDE = isMobile ? 500 : 1200;

const CarouselCard: React.FC<{
  card: typeof CARDS[0];
  index: number;
  dragY: any;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ card, index, dragY, isSelected, onSelect }) => {
  // cardOffset = how far THIS card is from the visual center.
  // dragY moves the whole container, but each card is placed at index * CARD_STRIDE inside it.
  // So when dragY = -index * CARD_STRIDE, this card is centered (offset = 0).
  const cardOffset = useTransform(dragY, (dy: number) => dy + index * CARD_STRIDE);

  // 5-point non-linear input range (2 strides in either direction)
  const S = CARD_STRIDE;
  const input = [-S * 2, -S, 0, S, S * 2];

  // Z-index: center card on top, fade symmetrically. Strictly integer via Math.round.
  const zIndexFloat = useTransform(cardOffset, input, [0, 3, 10, 3, 0]);
  const zIndex = useTransform(zIndexFloat, (v) => Math.round(v));

  // Scale: deep recession on outer cards.
  const scale = useTransform(cardOffset, input, [0.4, 0.65, 1, 0.65, 0.4]);

  // Beanstalk X: upcoming cards (positive offset = right of center) sit far RIGHT,
  // passed cards (negative offset = left of center) sweep to the far LEFT.
  // The carousel container already handles the scroll track — these are ADDITIONAL
  // visual offsets RELATIVE to the card's natural track position.
  // We want incoming (right side) to pull slightly further right, outgoing (left) to pull left.
  const xExtra = useTransform(cardOffset, input, [-600, -300, 0, 300, 600]);

  // Beanstalk Y: upcoming cards originate from bottom-right (positive Y),
  // active card sits at screen center (Y: 0), passed cards exit top-left (negative Y).
  const y = useTransform(cardOffset, input, [-700, -350, 0, 350, 700]);

  // RotateY: incoming cards angle inward (positive), passing cards angle outward (negative).
  const rotateY = useTransform(cardOffset, input, [-50, -28, 0, 28, 50]);

  // RotateX: incoming cards tilt back (positive = looking up at them),
  // passed cards tilt forward (negative = looking down at them).
  const rotateX = useTransform(cardOffset, input, [-18, -7, 0, 7, 18]);

  // Opacity: hard fade to 0 at outer extremes, no edge clipping.
  const opacity = useTransform(cardOffset, input, [0, 0.35, 1, 0.35, 0]);

  return (
    <motion.div
      className="init-screen__card"
      style={{
        x: xExtra,
        y,
        rotateY,
        rotateX,
        scale: isSelected ? 3 : scale,
        opacity: isSelected ? 0 : opacity,
        zIndex,
        backgroundImage: `url(${card.image})`
      }}
      onClick={onSelect}
      data-cursor-expand="true"
      transition={isSelected ? { duration: 0.6, type: 'spring' } : undefined}
    >
      <div className="init-screen__card-content">
        <div className="init-screen__card-title">{card.era}</div>
        <div className="init-screen__card-subtitle">{card.subtitle}</div>
      </div>
    </motion.div>
  );
};

const StoryCarousel: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const dragY = useMotionValue(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Parallax Reactive Tech Spine Physics
  const spineRotateY = useTransform(dragY, [-2000, 2000], [-180, 180]);
  const spineTranslateY = useTransform(dragY, [-2000, 2000], [-200, 200]);

  // Inverse Y to lock the visual layer while the drag layer moves
  const inverseY = useTransform(dragY, (v) => -v);

  const setHasSelectedMode = usePortfolioStore((s) => s.setHasSelectedMode);
  const setLevel = usePortfolioStore((s) => s.setLevel);

  React.useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsLoading(false), 1200); // 1.2s loading screen
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleCardClick = (targetLevel: number, index: number) => {
    if (!isActive || selectedCard !== null) return;
    
    // Auto-center the clicked card smoothly
    animate(dragY, index * -CARD_STRIDE, { type: 'spring', stiffness: 300, damping: 30 });
    setSelectedCard(index);

    setTimeout(() => {
      setHasSelectedMode(true);
      setLevel(targetLevel as Level);
    }, 800);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isActive || selectedCard !== null || isLoading) return;
    const currentY = dragY.get();
    // Scroll speed multiplier mapping vertical scroll to vertical drag
    const speed = 1.5; 
    const newY = Math.max(-(CARDS.length - 1) * CARD_STRIDE, Math.min(0, currentY - e.deltaY * speed));
    dragY.set(newY);
  };

  if (!isActive) return null;

  return (
    <div 
      className={`init-screen__carousel-wrapper ${isActive ? 'init-screen__carousel-wrapper--active' : ''}`}
      onWheel={handleWheel}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="init-screen__loading">
          <div className="init-screen__loading-text">INITIALIZING STORY MODE...</div>
        </div>
      )}

      {/* Vertical Reactive Tech Spine */}
      <motion.div className="init-screen__spine-container" style={{ rotateY: spineRotateY, y: spineTranslateY, rotateZ: -15 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="spine-ring" style={{ transform: `translateY(${(i - 7) * 40}px) rotateX(75deg)` }} />
        ))}
      </motion.div>

      {/* Ripple Element */}
      {selectedCard !== null && (
        <div className="init-screen__ripple init-screen__ripple--active" />
      )}

      {/* Draggable Carousel with Inverse Layer to lock visual center */}
      {/* height dynamically calculated to ensure the container always covers the viewport no matter how far up it is dragged */}
      <motion.div
        className="init-screen__carousel"
        drag="y"
        dragConstraints={{ top: -((CARDS.length - 1) * CARD_STRIDE), bottom: 0 }}
        dragElastic={0.08}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 40 }}
        style={{ y: dragY, height: `calc(100vh + ${(CARDS.length - 1) * CARD_STRIDE}px)` }}
      >
        <motion.div 
          className="init-screen__carousel-inverse"
          style={{ y: inverseY }}
        >
          {CARDS.map((card, index) => (
            <CarouselCard 
              key={card.id}
              card={card}
              index={index}
              dragY={dragY}
              isSelected={selectedCard === index}
              onSelect={() => handleCardClick(card.targetLevel, index)}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

// ─── Main Init Screen ───────────────────────────────────────────────────────

const InitScreen: React.FC = () => {
  const [hoveredOption, setHoveredOption] = useState<'STORY' | 'CREATIVE' | null>(null);
  const [exiting, setExiting] = useState(false);
  
  const setIsCreativeMode = usePortfolioStore((s) => s.setIsCreativeMode);
  const setHasSelectedMode = usePortfolioStore((s) => s.setHasSelectedMode);
  const setLevel = usePortfolioStore((s) => s.setLevel);

  const handleSelectCreative = () => {
    setIsCreativeMode(true);
    setHasSelectedMode(true);
    setLevel(1); // Warp to BIOS
  };

  const handleSelectStory = () => {
    setExiting(true);
  };

  return (
    <div className="init-screen">
      <BracketCursor />
      
      <div className={`init-screen__content ${exiting ? 'init-screen__content--exit' : ''}`}>
        <div className="init-screen__header">HARSH MARU</div>
        
        <div className="init-screen__options">
          {/* Story Mode */}
          <div 
            className={`init-screen__option ${hoveredOption === 'CREATIVE' ? 'init-screen__option--blurred' : ''}`}
            onMouseEnter={() => setHoveredOption('STORY')}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={handleSelectStory}
            data-cursor-expand="true"
          >
            <div className="init-screen__option-title">[ STORY MODE ]</div>
            <div className="init-screen__option-subtitle">Experience the timeline.</div>
          </div>

          {/* Creative Mode */}
          <div 
            className={`init-screen__option ${hoveredOption === 'STORY' ? 'init-screen__option--blurred' : ''}`}
            onMouseEnter={() => setHoveredOption('CREATIVE')}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={handleSelectCreative}
            data-cursor-expand="true"
          >
            <div className="init-screen__option-title">[ CREATIVE MODE ]</div>
            <div className="init-screen__option-subtitle">Fast Mode.</div>
          </div>
        </div>
      </div>

      {/* Mounts after Story Mode is clicked */}
      <StoryCarousel isActive={exiting} />
    </div>
  );
};

export default InitScreen;
