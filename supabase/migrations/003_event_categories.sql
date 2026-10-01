-- 003_event_categories.sql

create table event_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  color text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_event_categories_slug on event_categories(slug);

insert into event_categories (name, slug, color, description) values
('Community', 'community', '#0ea5e9', 'Community gatherings and town halls'),
('Education', 'education', '#8b5cf6', 'Educational workshops and seminars'),
('Health', 'health', '#ef4444', 'Health screenings and wellness events'),
('Youth', 'youth', '#f59e0b', 'Youth programs and activities'),
('Volunteer', 'volunteer', '#10b981', 'Volunteer recruitment and training'),
('Fundraising', 'fundraising', '#d946ef', 'Fundraising and donation drives'),
('Cultural', 'cultural', '#06b22b', 'Cultural celebrations and events');
