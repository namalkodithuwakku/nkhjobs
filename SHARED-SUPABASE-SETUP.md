# Shared Supabase setup (N K Hotel OS + Hospitality Jobs)

This version keeps N K Hotel OS tables in `public` and places all Hospitality Jobs tables in the separate `jobs` schema. Supabase Authentication remains shared.

## 1. Run the Jobs migration

Open Supabase **SQL Editor**, create a new query, paste the complete contents of:

`supabase/NK_Hospitality_Jobs_Initial_Setup.sql`

Run it once. Do not rerun the older public-schema version.

## 2. Expose the Jobs schema to the API

In Supabase open **Project Settings → API**. Under **Exposed schemas**, add:

`jobs`

Keep the existing schemas, including `public` and `storage`. Save the setting.

## 3. Keep the existing Vercel variables

The app still uses:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

No service-role key is required for the current user flow.

## 4. Authentication URLs

In Supabase **Authentication → URL Configuration**, set your Vercel production URL as the Site URL and add:

`https://YOUR-VERCEL-DOMAIN/auth/callback`

## 5. Important shared-auth note

New Hospitality Jobs users include `app: nkh_jobs` in their authentication metadata. The Jobs trigger creates a Jobs profile only for those users. Existing N K Hotel OS data and tables are not changed by the Jobs migration.

If the OS project already has an unconditional `auth.users` trigger that rejects unfamiliar role values, a Jobs signup may show “Database error saving new user.” If that occurs, inspect that existing OS trigger before changing it; do not delete either app’s profile tables.
