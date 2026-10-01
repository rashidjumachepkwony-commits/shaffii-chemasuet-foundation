-- 004_events.sql

create table events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  short_description text,
  full_description text,
  featured_image text,
  category_id uuid references event_categories(id) on delete set null,
  event_date date not null,
  start_time time not null,
  end_time time not null,
  venue text,
  location text,
  organizer text,
  contact_information text,
  registration_deadline date,
  capacity integer check (capacity > 0),
  registration_enabled boolean default true not null,
  published boolean default false not null,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED')),
  created_by uuid references auth.users,
  updated_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_events_slug on events(slug);
create index idx_events_status on events(status);
create index idx_events_event_date on events(event_date);
create index idx_events_category on events(category_id);
create index idx_events_published on events(published, status);
create index idx_events_created_at on events(created_at desc);

create trigger update_events_updated_at
  before update on events
  for each row execute procedure update_updated_at_column();
