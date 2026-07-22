import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function NeonCrawler() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isMobile = useMediaQuery('(max-width: 768px)');

  const SEGMENTS = 5;

  const x0 = useMotionValue(Math.random() * window.innerWidth);
  const x1 = useMotionValue(Math.random() * window.innerWidth);
  const x2 = useMotionValue(Math.random() * window.innerWidth);
  const x3 = useMotionValue(Math.random() * window.innerWidth);
  const x4 = useMotionValue(Math.random() * window.innerWidth);
  const xValues = React.useMemo(() => [x0, x1, x2, x3, x4], [x0, x1, x2, x3, x4]);

  const y0 = useMotionValue(Math.random() * window.innerHeight);
  const y1 = useMotionValue(Math.random() * window.innerHeight);
  const y2 = useMotionValue(Math.random() * window.innerHeight);
  const y3 = useMotionValue(Math.random() * window.innerHeight);
  const y4 = useMotionValue(Math.random() * window.innerHeight);
  const yValues = React.useMemo(() => [y0, y1, y2, y3, y4], [y0, y1, y2, y3, y4]);

  const sx0 = useSpring(x0, { damping: 15, stiffness: 200, mass: 1 });
  const sx1 = useSpring(x1, { damping: 17, stiffness: 185, mass: 1.2 });
  const sx2 = useSpring(x2, { damping: 19, stiffness: 170, mass: 1.4 });
  const sx3 = useSpring(x3, { damping: 21, stiffness: 155, mass: 1.6 });
  const sx4 = useSpring(x4, { damping: 23, stiffness: 140, mass: 1.8 });
  const xSprings = [sx0, sx1, sx2, sx3, sx4];

  const sy0 = useSpring(y0, { damping: 15, stiffness: 200, mass: 1 });
  const sy1 = useSpring(y1, { damping: 17, stiffness: 185, mass: 1.2 });
  const sy2 = useSpring(y2, { damping: 19, stiffness: 170, mass: 1.4 });
  const sy3 = useSpring(y3, { damping: 21, stiffness: 155, mass: 1.6 });
  const sy4 = useSpring(y4, { damping: 23, stiffness: 140, mass: 1.8 });
  const ySprings = [sy0, sy1, sy2, sy3, sy4];

  const eyeOffsetX = useMotionValue(0);
  const eyeOffsetY = useMotionValue(0);

  const [mode, setMode] = useState('wandering');
  const [particles, setParticles] = useState([]);
  const requestRef = useRef();
  const [isBlinking, setIsBlinking] = useState(false);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  const colors = isDark
    ? ['#00ffcc', '#00ffcc', '#8a2be2', '#8a2be2', '#ff00ff']
    : ['#ff9a9e', '#fecfef', '#a18cd1', '#fbc2eb', '#84fab0'];

  // Blinking logic
  useEffect(() => {
    if (isMobile) return;
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, Math.random() * 4000 + 2000); // Blink every 2-6 seconds
    return () => clearInterval(blinkInterval);
  }, [isMobile]);

  // Wandering & Evasion logic
  useEffect(() => {
    if (isMobile) return;
    let angle = Math.random() * Math.PI * 2;
    let targetX = xValues[0].get();
    let targetY = yValues[0].get();
    let lastTime = performance.now();
    let timeOffset = Math.random() * 100;

    const animate = (time) => {
      const delta = Math.min((time - lastTime) * 0.05, 2);
      lastTime = time;

      // Calculate distance to mouse
      const dx = mouseX.current - targetX;
      const dy = mouseY.current - targetY;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);

      // Eye tracking
      const angleToMouse = Math.atan2(dy, dx);
      eyeOffsetX.set(Math.cos(angleToMouse) * 3);
      eyeOffsetY.set(Math.sin(angleToMouse) * 3);

      if (mode === 'wandering') {
        timeOffset += 0.05;
        
        // Evasion
        let speedMult = 1;
        if (distToMouse < 150) {
          // Run away!
          angle = Math.atan2(-dy, -dx);
          speedMult = 3.5;
        } else {
          // Organic wandering with sine wave
          angle += Math.sin(timeOffset) * 0.1;
        }

        targetX += Math.cos(angle) * delta * 2 * speedMult;
        targetY += Math.sin(angle) * delta * 2 * speedMult;

        // Bounce off walls organically
        if (targetX < 50) { targetX = 50; angle = Math.PI - angle; }
        if (targetX > window.innerWidth - 50) { targetX = window.innerWidth - 50; angle = Math.PI - angle; }
        if (targetY < 50) { targetY = 50; angle = -angle; }
        if (targetY > window.innerHeight - 50) { targetY = window.innerHeight - 50; angle = -angle; }

        xValues[0].set(targetX);
        yValues[0].set(targetY);

        for (let i = 1; i < SEGMENTS; i++) {
          xValues[i].set(xValues[i - 1].get());
          yValues[i].set(yValues[i - 1].get());
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [mode, xValues, yValues, isMobile, eyeOffsetX, eyeOffsetY]);

  // Cursor tracking
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      
      if (mode === 'following-cursor' || mode === 'dragging') {
        xValues[0].set(e.clientX);
        yValues[0].set(e.clientY);

        for (let i = 1; i < SEGMENTS; i++) {
          xValues[i].set(xValues[i - 1].get());
          yValues[i].set(yValues[i - 1].get());
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mode, xValues, yValues, isMobile]);

  const handleCrawlerClick = (e) => {
    const newParticles = Array(10).fill(0).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX,
      y: e.clientY,
      angle: (i / 10) * Math.PI * 2,
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    setMode((prev) => prev === 'wandering' ? 'following-cursor' : 'wandering');

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1000);
  };

  if (isMobile) return null;

  return (
    <>
      {/* Hidden SVG for Gooey Filter */}
      <svg width="0" height="0" className="pointer-events-none absolute hidden">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
      </svg>

      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" style={{ filter: 'url(#gooey)' }}>
        {[...Array(SEGMENTS)].map((_, i) => {
          const idx = SEGMENTS - 1 - i;
          const isHead = idx === 0;
          const size = isHead ? 24 : 20 - idx * 2;

          return (
            <motion.div
              key={idx}
              className={`absolute rounded-full shadow-lg ${isHead ? 'pointer-events-auto cursor-pointer' : ''}`}
              style={{
                width: size,
                height: size,
                x: xSprings[idx],
                y: ySprings[idx],
                backgroundColor: colors[idx],
                boxShadow: isDark ? `0 0 15px ${colors[idx]}80` : 'none',
                marginLeft: -size / 2,
                marginTop: -size / 2,
                zIndex: 50 - idx,
              }}
              onClick={isHead ? handleCrawlerClick : undefined}
            >
              {isHead && (
                <motion.div 
                  className="relative h-full w-full"
                  animate={{ scaleY: isBlinking ? 0 : 1 }}
                  transition={{ duration: 0.05 }}
                >
                  <motion.div 
                    className="absolute top-[6px] left-[4px] h-[5px] w-[5px] rounded-full bg-[#111]" 
                    style={{ x: eyeOffsetX, y: eyeOffsetY }}
                  />
                  <motion.div 
                    className="absolute top-[6px] right-[4px] h-[5px] w-[5px] rounded-full bg-[#111]"
                    style={{ x: eyeOffsetX, y: eyeOffsetY }}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
            animate={{
              x: p.x + Math.cos(p.angle) * 100,
              y: p.y + Math.sin(p.angle) * 100,
              scale: 0,
              opacity: 0,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              width: 8,
              height: 8,
              backgroundColor: isDark ? '#00ffcc' : '#ff9a9e',
              marginLeft: -4,
              marginTop: -4,
            }}
          />
        ))}
      </div>
    </>
  );
}
