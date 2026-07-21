import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function CursorTrail() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring for the crisp dot
  const dotX = useSpring(mouseX, { damping: 25, stiffness: 700, mass: 0.5 });
  const dotY = useSpring(mouseY, { damping: 25, stiffness: 700, mass: 0.5 });

  // Spring for the large glow (smooth & laggy)
  const glowX = useSpring(mouseX, { damping: 40, stiffness: 200, mass: 1 });
  const glowY = useSpring(mouseY, { damping: 40, stiffness: 200, mass: 1 });

  useEffect(() => {
    if (isMobile) return;

    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      if (
        e.target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    setTimeout(() => setIsVisible(true), 500);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Soft Glow Spotlight */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[-1] h-[600px] w-[600px] rounded-full opacity-40 blur-[80px] dark:opacity-30"
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
          background:
            'radial-gradient(circle, rgba(0, 255, 204, 0.4) 0%, rgba(168, 85, 247, 0.15) 35%, rgba(0,0,0,0) 65%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Crisp Dot Cursor */}
      <motion.div
        className={`pointer-events-none fixed top-0 left-0 z-[100] transition-colors duration-200 ${
          isHovering
            ? 'border-2 border-slate-400 bg-transparent dark:border-[#00E5FF]'
            : 'border-0 border-transparent bg-slate-400 dark:bg-[#00E5FF]'
        }`}
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        initial={{ scale: 0, width: 12, height: 12, borderRadius: '50%' }}
        animate={{
          scale: isVisible ? (isClicking ? 0.8 : 1) : 0,
          width: isHovering ? 40 : 12,
          height: isHovering ? 40 : 12,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.5 }}
      />
    </>
  );
}
