'use client';

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export function NavAuth({ isSignedIn }: { isSignedIn: boolean }) {
  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className="rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm font-medium text-white shadow-2xl backdrop-blur-xl transition hover:border-white/20 hover:bg-black/60"
      >
        Sign In
      </Link>
    );
  }
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: 'h-9 w-9',
        },
      }}
    />
  );
}
