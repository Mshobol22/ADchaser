'use client';

import { motion } from 'framer-motion';

const DURATION = 60;

const PLACEHOLDER_CARDS = Array.from({ length: 12 }, (_, i) => ({ id: i }));

function MarqueeCardPlaceholder() {
  return (
    <div
      className="h-24 w-36 flex-shrink-0 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
      style={{ aspectRatio: '4/3' }}
    />
  );
}

function MarqueeRow({
  direction,
  duration,
}: {
  direction: 'left' | 'right';
  duration: number;
}) {
  const offset = direction === 'left' ? ['0%', '-50%'] : ['0%', '50%'];
  return (
    <motion.div
      className="flex gap-4"
      animate={{ x: offset as [string, string] }}
      transition={{
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        duration,
      }}
    >
      {[...PLACEHOLDER_CARDS, ...PLACEHOLDER_CARDS].map(({ id }, i) => (
        <MarqueeCardPlaceholder key={`${id}-${i}`} />
      ))}
    </motion.div>
  );
}

export function InfiniteMarquee() {
  return (
    <div
      className="relative z-0 overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
    >
      <div className="flex flex-col gap-6 py-4">
        <div className="flex w-max">
          <MarqueeRow direction="left" duration={DURATION} />
        </div>
        <div className="flex w-max">
          <MarqueeRow direction="right" duration={DURATION} />
        </div>
      </div>
    </div>
  );
}
