-- Run this SQL in your Supabase Dashboard:
-- Go to: Supabase Dashboard -> SQL Editor -> New query -> Paste and Run

-- 1. Create the votes table
create table if not exists public.votes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  story_index integer not null,
  story_title text not null,
  voter_id text
);

-- 2. Enable Row Level Security (RLS)
alter table public.votes enable row level security;

-- 3. Policy to allow anonymous visitors to cast votes
create policy "Allow anonymous inserts"
on public.votes
for insert
to anon, authenticated
with check (true);

-- 4. Policy to allow reading votes so the live standings/leaderboard can be shown
create policy "Allow anonymous reads"
on public.votes
for select
to anon, authenticated
using (true);
