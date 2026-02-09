'use client';

import Link from 'next/link';
import { DataMountain } from './DataMountain';
import { InfiniteMarquee } from './InfiniteMarquee';

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col overflow-hidden bg-slate-950">
      {/* Background: marquee, dimmed */}
      <div className="absolute inset-0 z-0 opacity-40">
        <InfiniteMarquee />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-16 pb-8 text-center">
        <h1 className="font-serif text-5xl font-medium tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          The World&apos;s Most <em className="italic">Profitable</em> Ads.
        </h1>
        <p className="mt-6 max-w-md text-lg text-slate-400 sm:text-xl" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
          Stop guessing. Start copying what works.
        </p>
        <Link
          href="/#library"
          className="mt-10 inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-medium text-white shadow-[0_0_24px_rgba(52,211,153,0.15)] backdrop-blur-md transition hover:border-emerald-400/40 hover:bg-white/15 hover:shadow-[0_0_32px_rgba(52,211,153,0.25)]"
        >
          Explore the Library
        </Link>
      </div>

      {/* Bottom anchor: DataMountain */}
      <div className="relative z-10 w-full px-4 pb-8">
        <DataMountain />
      </div>
    </section>
  );
}
