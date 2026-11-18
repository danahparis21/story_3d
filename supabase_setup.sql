-- ==============================================================================
-- Story Votes Table Setup (Safe to run alongside IT Passport)
-- This creates ONLY the 'story_votes' table.
-- It DOES NOT touch, alter, or delete 'sessions', 'explanations', or any other data.
-- ==============================================================================

-- 1. Create the dedicated story_votes table
create table if not exists public.story_votes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  story_index integer not null,
  story_title text not null,
  voter_id text
);

-- 2. Enable Row Level Security (RLS) on story_votes
alter table public.story_votes enable row level security;

-- 3. Policy to allow inserting votes
create policy "Allow insert story_votes"
on public.story_votes
for insert
to anon, authenticated, service_role
with check (true);

-- 4. Policy to allow reading votes (so the winning story and standings can be calculated)
create policy "Allow read story_votes"
on public.story_votes
for select
to anon, authenticated, service_role
using (true);
