# Supabase Setup Instructions

Follow these steps to set up your Supabase database for GolfGrid.

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name:** golfgrid (or golfgrid-mvp)
   - **Database Password:** (generate strong password and save it!)
   - **Region:** Choose closest to you
   - **Plan:** Free tier
5. Wait 2-3 minutes for provisioning

## Step 2: Get Your Credentials

1. In Supabase Dashboard, go to **Project Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 3: Set Up Environment Variables

1. In your GolfGrid project root, create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and paste your values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Run Database Schema

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the contents of `schema.sql` and paste into the editor
4. Click **Run** or press `Ctrl+Enter`
5. Verify: You should see "Success. No rows returned"

## Step 5: Set Up Row Level Security

1. In SQL Editor, click **New Query** again
2. Copy the contents of `rls-policies.sql` and paste
3. Click **Run**
4. Verify: You should see "Success. No rows returned"

## Step 6: Verify Setup

1. Click **Table Editor** (left sidebar)
2. You should see these tables:
   - users
   - availability
   - events
   - event_participants
   - friendships
   - messages

## Step 7: Enable Email Authentication

1. Go to **Authentication** (left sidebar)
2. Click **Providers**
3. Enable **Email** provider (should be on by default)
4. (Optional) Configure email templates under **Email Templates**

## Step 8: Test Connection

1. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Check for any errors in the console
3. The app should now be connected to Supabase!

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists in project root
- Check that variable names match exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after creating `.env.local`

### SQL errors when running schema
- Make sure you're running `schema.sql` first, then `rls-policies.sql`
- Each file should be run in a separate query

### Authentication not working
- Check that Email provider is enabled in Authentication settings
- Verify RLS policies were applied successfully

## What's Next?

Once setup is complete:
1. Authentication components will be implemented
2. Calendar will be connected to real database
3. Events and availability will persist
4. Real-time updates will work between users

## Schema Files

- **schema.sql**: Creates all tables, indexes, functions, and triggers
- **rls-policies.sql**: Sets up Row Level Security policies for data protection
- **README.md**: This file - setup instructions

## Need Help?

If you encounter issues:
1. Check Supabase Dashboard → Logs for errors
2. Check browser console for errors
3. Verify environment variables are loaded: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
