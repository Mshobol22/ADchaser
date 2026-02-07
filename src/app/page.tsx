import { createClient } from '@/lib/supabase';
import { UserButton } from '@clerk/nextjs';
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
          <p className="text-center text-slate-500">No ads in the library yet.</p>
        )}
      </main>
    </div>
  );
}
