'use client';

import { useState } from 'react';

export function ProBadgeButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
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
      title="Click to Manage Subscription"
      className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-black transition hover:bg-amber-300 disabled:opacity-60"
      aria-label="Manage subscription"
    >
      {loading ? '…' : 'PRO'}
    </button>
  );
}
