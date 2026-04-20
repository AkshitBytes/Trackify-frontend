import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

interface ProgressRingProps {
  progress: number;
  solved?: number;
  total?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showBreakdown?: boolean;
  confettiEnabled?: boolean;
  confettiMode?: 'side-cannons' | 'fireworks';
}

const ProgressRing: React.FC<ProgressRingProps> = ({ 
  progress, 
  solved = 0,
  total = 0,
  size = 120, 
  strokeWidth = 10,
  color = 'var(--accent-primary)',
  showBreakdown = true,
  confettiEnabled = true,
  confettiMode = 'side-cannons',
}) => {
  const [offset, setOffset] = useState(0);
  const previousProgressRef = useRef(progress);
  
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const isComplete = progress >= 100 && total > 0;

  useEffect(() => {
    const progressOffset = circumference - (progress / 100) * circumference;
    const timer = setTimeout(() => {
      setOffset(progressOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [circumference, progress]);

  useEffect(() => {
    const crossedToComplete = previousProgressRef.current < 100 && progress >= 100 && total > 0;
    previousProgressRef.current = progress;
    if (!confettiEnabled || !crossedToComplete) return;

    if (confettiMode === 'fireworks') {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }

    const end = Date.now() + 1300;
    const colors = ['#22c55e', '#6366f1', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6'];
    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        startVelocity: 45,
        origin: { x: 0, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        startVelocity: 45,
        origin: { x: 1, y: 0.65 },
        colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  }, [confettiEnabled, confettiMode, progress, total]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg
        className="progress-ring"
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          stroke="var(--border-subtle)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          stroke={isComplete ? 'var(--accent-success)' : color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: offset || circumference, transition: 'stroke-dashoffset 1s ease-in-out' }}
          r={radius}
          cx={center}
          cy={center}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: size <= 70 ? '0.85rem' : '1.5rem', fontWeight: 700 }}>{progress}%</span>
      </div>
      </div>
      {showBreakdown && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {solved}/{total} solved
        </span>
      )}
    </div>
  );
};

export default ProgressRing;
