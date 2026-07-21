import React, { useState, useEffect, useRef } from 'react';
import { useSiteConfig } from '../../contexts/SiteConfigContext';
import catSprite from '../../assets/cat_tiles.png';

export function WalkingCatFooter() {
  const { config } = useSiteConfig();
  const color = config?.catAccentColor || '#00E5FF';
  const message =
    config?.catMessage ||
    "You've reached the end! The developer is out walking his cat.";

  const [isSitting, setIsSitting] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let observer;
    let isVisible = false;
    let animationFrameId = null;

    const handleMouseMove = (e) => {
      if (!isVisible || !containerRef.current) return;
      if (animationFrameId) return;

      animationFrameId = requestAnimationFrame(() => {
        animationFrameId = null;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const catCenterX = rect.left + rect.width / 2;
        const catCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(e.clientX - catCenterX, 2) +
            Math.pow(e.clientY - catCenterY, 2)
        );

        setIsSitting((prev) => {
          if (distance < 150 && !prev) return true;
          if (distance >= 150 && prev) return false;
          return prev;
        });
      });
    };

    if (containerRef.current) {
      observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0 });
      observer.observe(containerRef.current);
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (observer) observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
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
          from { transform: translate(0px, 0px); }
          to { transform: translate(0px, -2400px); }
        }

        @keyframes sit-animation {
          from { transform: translate(-400px, 0px); }
          to { transform: translate(-400px, -1000px); }
        }

        .cat-container {
          width: 400px;
          height: 200px;
          overflow: hidden;
          position: relative;
        }

        .cat-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 1600px; /* full intrinsic width */
          height: 2591px; /* full intrinsic height */
          will-change: transform;
        }

        .walking .cat-image {
          animation: walk-animation 2s steps(12) infinite;
        }

        .sitting .cat-image {
          animation: sit-animation 0.8s steps(5) forwards;
        }

        @keyframes treadmill {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
        
        .treadmill-track {
          display: flex;
          width: 200%;
          margin-left: -100%;
          /* Move right to give illusion of cat walking left */
          animation: treadmill 2s infinite linear;
          will-change: transform;
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
            className={`cat-container absolute bottom-0 origin-bottom ${isSitting ? 'sitting' : 'walking'}`}
            style={{ transform: 'scale(0.45)' }}
          >
            <img src={catSprite} alt="cat sprite" className="cat-image max-w-none" />
          </div>
        </div>

        {/* The Treadmill Ground & Paw Prints */}
        <div className="absolute bottom-0 left-0 flex h-16 w-full items-end overflow-hidden">
          {/* Fading Edges Mask */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-[#F8F9FA] via-transparent to-[#F8F9FA] dark:from-[#0A0A0A] dark:via-transparent dark:to-[#0A0A0A]" />

          <div
            className={`treadmill-track relative z-0 ${isSitting ? 'treadmill-paused' : ''}`}
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
        {isSitting ? 'Meow?' : message}
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
