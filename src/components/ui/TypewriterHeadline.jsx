import React, { useState, useEffect } from 'react';

export function TypewriterHeadline({
  words = ['Web Developer.', 'Digital Creator.'],
  speed = 100,
  pause = 1500,
}) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const cursorTimeout = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(cursorTimeout);
  }, [blink]);

  // Typing logic
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
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
      subIndex === words[index].length && !reverse ? pause : currentSpeed
    );

    return () => clearTimeout(timeout);
  }, [subIndex, reverse, index, words, speed, pause]);

  return (
    <span className="mt-2 block font-mono text-5xl font-black tracking-tight text-cyan-500 drop-shadow-[0_0_12px_rgba(0,255,204,0.6)] md:text-7xl dark:text-[#00ffcc]">
      {words[index].substring(0, subIndex)}
      <span
        className={`ml-2 inline-block h-[0.9em] w-[4px] bg-cyan-500 align-middle transition-opacity duration-100 dark:bg-[#00ffcc] ${blink ? 'opacity-100' : 'opacity-0'}`}
      />
    </span>
  );
}
