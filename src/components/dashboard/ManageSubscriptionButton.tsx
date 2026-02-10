'use client';

import { useState } from 'react';

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portal', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Could not open billing portal');
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No redirect URL returned');
      }
    } catch (err) {
      setLoading(false);
      alert(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium text-zinc-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white disabled:opacity-60"
    >
      {loading ? 'Loading...' : 'Manage Subscription'}
    </button>
  );
}
