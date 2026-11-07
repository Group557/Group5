### TE6: Access Control

- `packages/frontend/app/(login-registration)/index.ts` — User registration, user authentication, sign-in, and routing based on onboarding status.
- `supabase/migrations/20261008071853_profiles.sql` — Profiles table and RLS policy restricting users to reading their own profile.
- `utils/supabase.ts` — Supabase client configuration, session storage, and automatic token refresh.

Supabase provides backend authentication and token handling