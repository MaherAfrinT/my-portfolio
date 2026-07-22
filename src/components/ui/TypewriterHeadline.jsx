import React, { useState, useEffect, useMemo } from 'react';

export function TypewriterHeadline({
  words = ['Web Developer.', 'Digital Creator.'],
  speed = 100,
  pause = 1500,
}) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Find longest word to reserve space and prevent CLS
  const longestWord = useMemo(() => {
    return words.reduce((a, b) => (a.length > b.length ? a : b), '');
  }, [words]);

  // Blinking cursor
  useEffect(() => {
    const cursorTimeout = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(cursorTimeout);
  }, [blink]);

  // Reset state if words array changes
  useEffect(() => {
    setIndex(0);
    setSubIndex(0);
    setReverse(false);
  }, [words.join(',')]);

  // Typing logic
  useEffect(() => {
    if (!words || words.length === 0) return;
    
    // Safety check in case words array shrank
    const currentIndex = index >= words.length ? 0 : index;
    const currentWord = words[currentIndex] || '';

    if (subIndex === currentWord.length + 1 && !reverse) {
      setReverse(true);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    // Speed varies for natural feel
    const currentSpeed = reverse
      ? speed / 2
      : speed - Math.random() * (speed / 3);

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      subIndex === currentWord.length && !reverse ? pause : currentSpeed
    );

    return () => clearTimeout(timeout);
  }, [subIndex, reverse, index, words, speed, pause]);

  // Safety checks for render
  const currentIndex = index >= words.length ? 0 : index;
  const currentWord = words[currentIndex] || '';

  return (
    <span className="mt-2 relative block font-mono text-5xl font-black tracking-tight text-[#009bbf] drop-shadow-[0_4px_12px_rgba(79,70,229,0.2)] md:text-7xl dark:text-cyan-500 dark:drop-shadow-[0_0_12px_rgba(0,255,204,0.6)]">
      {/* Invisible placeholder to prevent layout shifts (CLS) */}
      <span className="opacity-0 pointer-events-none select-none block w-full">
        {longestWord}
        {/* Invisible cursor for layout consistency */}
        <span className="ml-2 inline-block h-[0.9em] w-[4px] align-middle" />
      </span>
      
      {/* Actual typing text */}
      <span className="absolute top-0 left-0 w-full h-full text-left">
        {currentWord.substring(0, subIndex)}
        <span
          className={`ml-2 inline-block h-[0.9em] w-[4px] bg-[#009bbf] align-middle transition-opacity duration-100 dark:bg-cyan-500 ${blink ? 'opacity-100' : 'opacity-0'}`}
        />
      </span>
    </span>
  );
}
