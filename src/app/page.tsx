import { createClient } from '@/lib/supabase';
import { UserButton } from '@clerk/nextjs';
import { Film } from 'lucide-react';
import { AdCard } from '@/components/AdCard';

export default async function Home() {
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
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-9 w-9',
              },
            }}
          />
        </div>
      </header>

      {/* Masonry grid */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
          {ads.map((ad) => (
            <div key={ad.id} className="mb-6 break-inside-avoid">
              <AdCard ad={ad} />
            </div>
          ))}
        </div>
        {ads.length === 0 && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <Film className="h-12 w-12 text-slate-500" strokeWidth={1.25} />
            </div>
            <p className="text-lg font-medium text-slate-400">No ads found</p>
            <p className="max-w-sm text-sm text-slate-500">
              Ingest ads from the Ad Library to see them here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
