'use client';

import confetti from 'canvas-confetti';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * On dashboard: if URL has ?success=true, refresh the Clerk session so publicMetadata (e.g. isPro) is up to date,
 * then show a Pro welcome toast, confetti, and clean the URL.
 */
export function SuccessHandler() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    const success = searchParams.get('success');
    if (success !== 'true') return;
    handled.current = true;

    (async () => {
      if (user) await user.reload();
      toast.success('Welcome to Pro! You now have unlimited access.');
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1 } });
      }, 150);
      router.replace('/dashboard');
    })();
  }, [searchParams, router, user]);

  return null;
}
