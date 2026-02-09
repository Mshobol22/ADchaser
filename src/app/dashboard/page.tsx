import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Bookmark } from 'lucide-react';
import { fetchSavedAds } from '@/app/actions/fetchSavedAds';
import { SuccessHandler } from '@/app/dashboard/SuccessHandler';
import { VaultWithModal } from '@/app/dashboard/VaultWithModal';
import { NavAuth } from '@/components/layout/NavAuth';
import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const savedAds = await fetchSavedAds();
  const count = savedAds.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Suspense fallback={null}>
        <SuccessHandler />
      </Suspense>
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 px-4 py-5 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              My Swipe File
            </h1>
            <p className="text-sm text-slate-500">Your personal collection of high-converting creatives.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400">
              {count} {count === 1 ? 'Ad' : 'Ads'} Saved
            </span>
            <Link
              href="/"
              className="text-sm font-medium text-slate-400 transition hover:text-white"
            >
              Library
            </Link>
            <NavAuth isSignedIn={!!userId} />
          </div>
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        {savedAds.length === 0 ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Bookmark className="h-8 w-8 text-slate-500" aria-hidden />
            </div>
            <p className="text-lg text-slate-400">Your vault is empty.</p>
            <Link
              href="/"
              className="cursor-pointer rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/15"
            >
              Explore the Library
            </Link>
          </div>
        ) : (
          <>
            <div className="h-12 shrink-0" aria-hidden />
            <VaultWithModal initialAds={savedAds} />
          </>
        )}
      </main>
    </div>
  );
}
