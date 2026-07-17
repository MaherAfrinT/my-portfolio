import React, { useState, useEffect, useRef } from 'react';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import catSprite from '../../assets/cat_tiles.png';

export function WalkingCatFooter() {
  const { config } = useSiteConfig();
  const color = config?.catAccentColor || '#FFFF00';
  const message =
    config?.catMessage ||
    "You've reached the end! The developer is out walking his cat.";

  const [isLooking, setIsLooking] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const catCenterX = rect.left + rect.width / 2;
      const catCenterY = rect.top + rect.height / 2;

      const dist = Math.sqrt(
        Math.pow(e.clientX - catCenterX, 2) +
          Math.pow(e.clientY - catCenterY, 2)
      );

      setIsLooking(dist < 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-24 opacity-80 transition-opacity duration-500 hover:opacity-100">
      {/* Inline CSS for the Sprite Walk Cycle and Treadmill */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --cat-color: ${color};
        }
        
        @keyframes walk-animation {
          from { background-position: 0 0; }
          to { background-position: 0 -2391px; }
        }

        @keyframes sit-animation {
          from { background-position: -400px 0; }
          to { background-position: -400px -1200px; }
        }

        .cat-sprite {
          width: 400px;
          height: 200px;
          background: url("${catSprite}") 0 0 no-repeat;
        }

        .walking {
          animation: walk-animation 2s steps(12) infinite;
        }

        .sitting {
          animation: sit-animation 2s steps(6) infinite;
        }

        @keyframes treadmill {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        
        .treadmill-track {
          display: flex;
          width: 200%;
          /* Move right to give illusion of cat walking left */
          animation: treadmill 2s infinite linear;
        }
        
        .treadmill-paused {
          animation-play-state: paused;
        }
        
        .neon-glow {
          box-shadow: 0 0 8px var(--cat-color), 0 0 16px var(--cat-color)80;
          background-color: var(--cat-color);
        }
        
        .neon-text {
          color: var(--cat-color);
          text-shadow: 0 0 10px var(--cat-color)80, 0 0 20px var(--cat-color)40;
        }
        
        .neon-svg {
          fill: var(--cat-color);
          filter: drop-shadow(0 0 6px var(--cat-color)) drop-shadow(0 0 12px var(--cat-color)80);
        }
      `,
        }}
      />

      <div
        className="relative flex w-full max-w-md flex-col items-center justify-end"
        ref={containerRef}
      >
        {/* The Cat - Wrapped to constrain height since we are scaling the 200px sprite down */}
        <div className="pointer-events-none relative z-10 mb-[2px] flex h-[80px] w-full items-end justify-center">
          <div
            className={`cat-sprite absolute bottom-0 origin-bottom ${isLooking ? 'sitting' : 'walking'}`}
            style={{ transform: 'scale(0.45)' }}
          />
        </div>

        {/* The Treadmill Ground & Paw Prints */}
        <div className="absolute bottom-0 left-0 flex h-16 w-full items-end overflow-hidden">
          {/* Fading Edges Mask */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-white via-transparent to-white dark:from-slate-950 dark:via-transparent dark:to-slate-950" />

          <div
            className={`treadmill-track relative z-0 ${isLooking ? 'treadmill-paused' : ''}`}
          >
            {/* Segment 1 */}
            <div className="relative flex w-1/2 items-end">
              <div className="neon-glow h-[1px] w-full" />
              {/* Paw prints spaced out */}
              <div className="absolute bottom-3 flex w-full justify-around pr-20 opacity-40">
                <PawPrintIcon className="neon-svg h-3 w-3 rotate-12" />
                <PawPrintIcon className="neon-svg mt-3 h-3 w-3 rotate-12" />
                <PawPrintIcon className="neon-svg h-3 w-3 rotate-12" />
                <PawPrintIcon className="neon-svg mt-3 h-3 w-3 rotate-12" />
              </div>
            </div>

            {/* Segment 2 */}
            <div className="relative flex w-1/2 items-end">
              <div className="neon-glow h-[1px] w-full" />
              <div className="absolute bottom-3 flex w-full justify-around pr-20 opacity-40">
                <PawPrintIcon className="neon-svg h-3 w-3 rotate-12" />
                <PawPrintIcon className="neon-svg mt-3 h-3 w-3 rotate-12" />
                <PawPrintIcon className="neon-svg h-3 w-3 rotate-12" />
                <PawPrintIcon className="neon-svg mt-3 h-3 w-3 rotate-12" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <p className="neon-text mt-8 max-w-sm px-4 text-center font-mono text-sm font-medium tracking-wide transition-all duration-700 md:text-base">
        {isLooking ? 'Meow?' : message}
      </p>
    </div>
  );
}

/**
 * Pure SVG Paw Print to avoid lucide-react dependency
 */
function PawPrintIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11 2a2 2 0 0 0-2 2v2a2 2 0 1 0 4 0V4a2 2 0 0 0-2-2z" />
      <path d="M18.3 4.7a2 2 0 0 0-2.8 0l-1.4 1.4a2 2 0 0 0 2.8 2.8l1.4-1.4a2 2 0 0 0 0-2.8z" />
      <path d="M5.7 4.7a2 2 0 0 1 2.8 0l1.4 1.4a2 2 0 0 1-2.8 2.8L5.7 7.5a2 2 0 0 1 0-2.8z" />
      <path d="M12 11c-2.8 0-5 2.2-5 5s2.2 6 5 6 5-2.2 5-6-2.2-5-5-5z" />
    </svg>
  );
}
