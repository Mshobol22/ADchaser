'use client';

import { useCallback, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Check } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

export interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional: which plan the user is on ('free' | 'pro') to show "Current Plan" on the right card */
  currentPlan?: 'free' | 'pro';
}

const FREE_FEATURES = ['3 Saved Ads', 'Basic Search'];
const PRO_FEATURES = ['Unlimited Saves', 'AI Insights', 'Top 1% Hook Filter'];

export function PricingModal({ open, onOpenChange, currentPlan = 'free' }: PricingModalProps) {
  const { user } = useUser();
  const isPro = user?.publicMetadata?.isPro === true;
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = useCallback(async () => {
    setIsUpgrading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error ?? 'Something went wrong');
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      toast.error('No checkout URL received');
    } catch {
      toast.error('Failed to start checkout');
    } finally {
      setIsUpgrading(false);
    }
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-8"
          aria-describedby="pricing-description"
        >
          <Dialog.Title className="sr-only">Choose your plan</Dialog.Title>
          <p id="pricing-description" className="sr-only">
            Compare Free and Pro plans. Pro includes unlimited saves, AI insights, and top hook filter.
          </p>

          <div className="mb-6 text-center">
            <h2
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Upgrade your workflow
            </h2>
            <p className="mt-1 text-sm text-slate-500">Choose the plan that fits you.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Free Card */}
            <div className="rounded-xl border border-slate-600/50 bg-slate-800/40 p-5 backdrop-blur-xl sm:p-6">
              <h3 className="text-lg font-semibold text-white">Starter</h3>
              <p
                className="mt-2 text-2xl text-slate-300"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                $0/mo
              </p>
              <ul className="mt-4 space-y-2">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-400">
                    <Check className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-default rounded-full border border-slate-600/50 bg-slate-700/30 py-3 text-sm font-medium text-slate-500"
              >
                {currentPlan === 'free' ? 'Current Plan' : 'Current Plan'}
              </button>
            </div>

            {/* Pro Card */}
            <div className="rounded-xl border border-emerald-500/50 bg-slate-800/40 p-5 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] backdrop-blur-xl sm:p-6">
              <h3 className="text-lg font-semibold text-white">Professional</h3>
              <p
                className="mt-2 text-2xl text-emerald-400"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                $29/mo
              </p>
              <ul className="mt-4 space-y-2">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={isUpgrading || isPro}
                className={
                  isPro
                    ? 'mt-6 w-full cursor-default rounded-full bg-slate-600 py-3 text-sm font-medium text-slate-400'
                    : 'pricing-cta-shimmer mt-6 w-full rounded-full bg-emerald-500 py-3 text-sm font-medium text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] transition hover:bg-emerald-600 hover:shadow-[0_0_24px_-5px_rgba(16,185,129,0.5)] disabled:cursor-not-allowed disabled:opacity-80'
                }
              >
                {isPro
                  ? 'Plan Active'
                  : isUpgrading
                    ? 'Redirecting to Stripe...'
                    : 'Upgrade Now'}
              </button>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M12 4L4 12M4 4l8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
