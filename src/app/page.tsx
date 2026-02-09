import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase';
import { HeroSection } from '@/components/hero/HeroSection';
import { LibraryWithModal } from '@/components/feed/LibraryWithModal';
import { Footer } from '@/components/layout/Footer';
import { NavAuth } from '@/components/layout/NavAuth';

export default async function Home() {
  const { userId } = await auth();
  const supabase = createClient();
  const { data: ads = [] } = await supabase.from('ads').select('*').order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          ADchaser Library
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
          >
            Filter
          </button>
          <NavAuth isSignedIn={!!userId} />
        </div>
      </header>

      <HeroSection />

      {/* Spacer + CommandBar + BentoGrid (filtered feed); click a card to open AdInsightModal */}
      <main id="library" className="px-4 py-8 sm:px-6 lg:px-8">
        <LibraryWithModal ads={ads} />
      </main>

      <Footer />
    </div>
  );
}
