'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useAuth, UserButton } from '@clerk/nextjs';

const SMART_FILTERS = [
  'All',
  'High Hook Rate (>8)',
  'SaaS',
  'E-com',
  'UGC',
  'Cinematic',
] as const;

export type SmartFilter = (typeof SMART_FILTERS)[number];

export interface CommandBarProps {
  searchValue?: string;
  activeFilter?: SmartFilter;
  onSearch?: (query: string) => void;
  onFilterChange?: (filter: SmartFilter) => void;
}

export function CommandBar({
  searchValue: controlledSearch,
  activeFilter: controlledFilter,
  onSearch,
  onFilterChange,
}: CommandBarProps) {
  const [internalQuery, setInternalQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [internalFilter, setInternalFilter] = useState<SmartFilter>('All');

  const { isSignedIn } = useAuth();
  const query = controlledSearch !== undefined ? controlledSearch : internalQuery;
  const activeFilter = controlledFilter !== undefined ? controlledFilter : internalFilter;

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (controlledSearch === undefined) setInternalQuery(value);
      onSearch?.(value);
    },
    [onSearch, controlledSearch]
  );

  const handleFilterClick = useCallback(
    (filter: SmartFilter) => {
      if (controlledFilter === undefined) setInternalFilter(filter);
      onFilterChange?.(filter);
    },
    [onFilterChange, controlledFilter]
  );

  return (
    <div className="sticky top-6 z-50 flex justify-center px-4">
      <div
        className="flex w-full max-w-3xl items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-black/50 py-2 pl-4 pr-3 shadow-2xl backdrop-blur-xl"
        style={{ minHeight: 48 }}
      >
        {/* Search: icon + input, expands on focus */}
        <div className="flex shrink-0 items-center gap-2">
          <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
          <motion.div
            className="overflow-hidden"
            animate={{ width: focused ? 384 : 256 }}
            initial={false}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <input
              type="search"
              placeholder="Search ads..."
              value={query}
              onChange={handleSearchChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full min-w-0 border-0 bg-transparent text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
              aria-label="Search ads"
            />
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px shrink-0 bg-white/10" aria-hidden />

        {/* Smart Filters: horizontal scroll */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-1">
          {SMART_FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterClick(filter)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Auth: Glass Sign In or UserButton */}
        <div className="h-6 w-px shrink-0 bg-white/10" aria-hidden />
        <div className="flex shrink-0 items-center">
          {!isSignedIn ? (
            <Link
              href="/sign-in"
              className="rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm font-medium text-white shadow-2xl backdrop-blur-xl transition hover:border-white/20 hover:bg-black/60"
            >
              Sign In
            </Link>
          ) : (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: 'h-8 w-8' },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
