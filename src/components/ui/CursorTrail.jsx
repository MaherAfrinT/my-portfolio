import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function CursorTrail() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring for the small dot (snappy)
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

    window.addEventListener('mousemove', moveCursor);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    setTimeout(() => setIsVisible(true), 500);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Soft Glow Spotlight */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[-1] h-[600px] w-[600px] rounded-full opacity-30 blur-[100px] dark:opacity-20"
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
          background:
            'radial-gradient(circle, rgba(0, 255, 204, 0.4) 0%, rgba(168, 85, 247, 0.1) 40%, rgba(0,0,0,0) 70%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Crisp Dot Cursor */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] h-3 w-3 rounded-full bg-cyan-500 mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
