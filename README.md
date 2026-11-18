# 🎬 Stories in Code (3D Interactive Stories & Voting)

An interactive, 3D animated storytelling experience built with Three.js, featuring 9 ethical dilemmas in tech, custom ambient generative music, and cloud voting with live leaderboard results.

---

## 🗄️ Supabase Setup (Reusing Your IT Passport Database)

This project safely shares the Supabase project from **IT Passport** (`https://kkpuswsvnibhgpgxmfki.supabase.co`).
It creates **only one new table**: `story_votes`.
It **does not touch, alter, or delete** your existing `sessions` or `explanations` tables!

### Step 1: Run the SQL in Supabase
1. Open your Supabase dashboard for **IT Passport**.
2. Click **SQL Editor** &rarr; **New query**.
3. Copy and paste the contents of [`supabase_setup.sql`](./supabase_setup.sql):
   ```sql
   create table if not exists public.story_votes (
     id uuid default gen_random_uuid() primary key,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     story_index integer not null,
     story_title text not null,
     voter_id text
   );

   alter table public.story_votes enable row level security;

   create policy "Allow insert story_votes"
   on public.story_votes for insert
   to anon, authenticated, service_role
   with check (true);

   create policy "Allow read story_votes"
   on public.story_votes for select
   to anon, authenticated, service_role
   using (true);
   ```
4. Click **Run**.

---

## 🚀 Deploying to Vercel

### Method A: Vercel CLI (Fastest)
1. In your terminal in this directory, run:
   ```bash
   npx vercel
   ```
2. In the Vercel Project Settings &rarr; **Environment Variables**, add the same two variables from IT Passport:
   - `SUPABASE_URL` = `https://kkpuswsvnibhgpgxmfki.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = `(Your Supabase Service Role Key from IT Passport)`

### Method B: Push to GitHub & Import in Vercel
1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial 3D voting story"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), import the repo, add the two environment variables above, and click **Deploy**.

---

## 🏆 Voting & Results Features
- **Pick up to 3 stories**: Visitors can select between 1 and 3 stories before submitting.
- **Winner Crown Display**: Highlights the #1 most voted story with golden glow, vote count, and percentage. Handles ties smoothly.
- **Complete Leaderboard**: Shows live vote count and visual progress bar for all 9 stories.
- **Safe Fallback**: Works locally even when offline or before database connection.
