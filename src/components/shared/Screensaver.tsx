import React, { useEffect, useRef, useState } from 'react';
import './Screensaver.css';

interface ScreensaverProps {
  timeoutMs?: number;
}

const Screensaver: React.FC<ScreensaverProps> = ({ timeoutMs = 15000 }) => {
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      setIsActive(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsActive(true), timeoutMs);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach(e => document.addEventListener(e, resetTimer));
    resetTimer(); // init

    return () => {
      events.forEach(e => document.removeEventListener(e, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [timeoutMs]);

  useEffect(() => {
    if (!isActive || !canvasRef.current) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const numStars = 400;
    const stars: { x: number, y: number, z: number, pz: number }[] = [];
    const speed = 2.5;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w * 2,
        y: (Math.random() - 0.5) * h * 2,
        z: Math.random() * w,
        pz: 0
      });
      stars[i].pz = stars[i].z;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#FFFFFF';
      const cx = w / 2;
      const cy = h / 2;

      stars.forEach(s => {
        s.z -= speed;
        if (s.z <= 0) {
          s.x = (Math.random() - 0.5) * w * 2;
          s.y = (Math.random() - 0.5) * h * 2;
          s.z = w;
          s.pz = s.z;
        }

        const sx = (s.x / s.z) * cx + cx;
        const sy = (s.y / s.z) * cy + cy;
        const px = (s.x / s.pz) * cx + cx;
        const py = (s.y / s.pz) * cy + cy;

        const size = Math.max(0, 1.5 - s.z / w);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.lineWidth = size * 2;
        ctx.strokeStyle = '#FFF';
        ctx.stroke();

        s.pz = s.z;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="screensaver-overlay anim-fade-in">
      <canvas ref={canvasRef} />
      <div className="screensaver-text blink">WAKING IN PROGRESS...</div>
    </div>
  );
};

export default Screensaver;
