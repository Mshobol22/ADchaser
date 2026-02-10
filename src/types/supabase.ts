/**
 * Database type definitions for Supabase.
 * Ad and SavedAd match the ads and saved_ads table schemas.
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

export interface SavedAd {
  id: string;
  user_id: string;
  ad_id: string;
  created_at: string;
}

export interface User {
  id: string;
  subscription_plan: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      ads: {
        Row: Ad;
        Insert: Omit<Ad, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Ad, 'id'>>;
      };
      saved_ads: {
        Row: SavedAd;
        Insert: Omit<SavedAd, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<SavedAd, 'id'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'updated_at'> & { updated_at?: string };
        Update: Partial<Omit<User, 'id'>>;
      };
    };
  };
}
