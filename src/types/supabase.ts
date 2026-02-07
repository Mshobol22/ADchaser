/**
 * Database type definitions for Supabase.
 * Ad interface matches the ads table schema.
 */

export interface Ad {
  id: string;
  created_at: string;
  brand_name: string;
  headline: string;
  primary_text: string;
  format: 'video' | 'image' | 'carousel';
  media_url: string;
  thumbnail_url: string;
  landing_page_url: string;
  hook_rating: number;
  industry: string;
}

export interface Database {
  public: {
    Tables: {
      ads: {
        Row: Ad;
        Insert: Omit<Ad, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Ad, 'id'>>;
      };
    };
  };
}
