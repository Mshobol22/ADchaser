/**
 * Supabase client exports for app and server use.
 * Use createServerClient(accessToken) when calling from server code with Clerk auth
 * so saved_ads RLS (auth.jwt() ->> 'sub' = user_id) applies.
 */
export {
  createClient,
  createServerClient,
  createServiceRoleClient,
} from '@/lib/supabase';
