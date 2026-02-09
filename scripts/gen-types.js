/**
 * Generate Supabase TypeScript types. Uses NEXT_PUBLIC_SUPABASE_URL from .env.local
 * to get the project ref (e.g. https://REF.supabase.co -> REF).
 * Run: npm run gen:types  (or: node scripts/gen-types.js)
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const match = url.match(/^https:\/\/([^.]+)\.supabase\.co/);
const projectRef = match ? match[1] : '';

if (!projectRef) {
  console.error('Missing or invalid NEXT_PUBLIC_SUPABASE_URL in .env.local (e.g. https://YOUR_REF.supabase.co)');
  process.exit(1);
}

console.log('Generating types for project ref:', projectRef);
execSync(
  `npx supabase gen types typescript --project-id ${projectRef} > src/types/supabase.ts`,
  { stdio: 'inherit', cwd: process.cwd() }
);
console.log('Done. src/types/supabase.ts updated.');
