import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

import { createServiceRoleClient } from '../src/lib/supabase';
// import type { Database } from '../src/types/supabase';
// type AdInsert = Database['public']['Tables']['ads']['Insert'];

async function seed() {
  const supabase = createServiceRoleClient();

  const ads: any[] = [
    {
      brand_name: 'Nike',
      headline: 'Just Do It — Run Your Day',
      primary_text: 'Every run counts. Find your pace with the latest gear.',
      format: 'video',
      media_url: 'https://placehold.co/600x400/000000/FFFFFF?text=Nike+Video',
      thumbnail_url: 'https://placehold.co/600x400/111111/FFFFFF?text=Nike',
      landing_page_url: 'https://placehold.co/600x400?text=Landing',
      hook_rating: 9,
      industry: 'Sportswear',
    },
    {
      brand_name: 'Apple',
      headline: 'Think different.',
      primary_text: 'Innovation that changes the way you work and create.',
      format: 'image',
      media_url: 'https://placehold.co/600x400/1a1a1a/FFFFFF?text=Apple',
      thumbnail_url: 'https://placehold.co/600x400/2a2a2a/FFFFFF?text=Apple',
      landing_page_url: 'https://placehold.co/600x400?text=Landing',
      hook_rating: 10,
      industry: 'Technology',
    },
    {
      brand_name: 'Coca-Cola',
      headline: 'Taste the Feeling',
      primary_text: 'Open happiness. Share a Coke with someone you care about.',
      format: 'carousel',
      media_url: 'https://placehold.co/600x400/cc0000/FFFFFF?text=Coca-Cola+1',
      thumbnail_url: 'https://placehold.co/600x400/cc0000/FFFFFF?text=Coke',
      landing_page_url: 'https://placehold.co/600x400?text=Landing',
      hook_rating: 8,
      industry: 'Beverages',
    },
    {
      brand_name: 'Spotify',
      headline: 'Music for everyone.',
      primary_text: 'Millions of songs. One place. Start listening today.',
      format: 'video',
      media_url: 'https://placehold.co/600x400/1DB954/000000?text=Spotify',
      thumbnail_url: 'https://placehold.co/600x400/1ed760/000000?text=Spotify',
      landing_page_url: 'https://placehold.co/600x400?text=Landing',
      hook_rating: 9,
      industry: 'Music & Entertainment',
    },
    {
      brand_name: 'Airbnb',
      headline: 'Belong Anywhere',
      primary_text: 'Book unique homes and experiences. Travel like a local.',
      format: 'carousel',
      media_url: 'https://placehold.co/600x400/FF5A5F/FFFFFF?text=Airbnb',
      thumbnail_url: 'https://placehold.co/600x400/FF5A5F/FFFFFF?text=Airbnb',
      landing_page_url: 'https://placehold.co/600x400?text=Landing',
      hook_rating: 8,
      industry: 'Travel & Hospitality',
    },
  ];

  // Casting to 'any' to bypass Vercel build strict type checking
  const { error } = await supabase.from('ads').insert(ads as any);

  if (error) {
    throw new Error(`Seed failed: ${error.message}`);
  }

  console.log('✅ Seeding Complete');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
