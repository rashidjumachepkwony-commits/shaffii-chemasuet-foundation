-- 015_content_sections.sql
-- Flexible content sections for the website (homepage sections, about page, etc.)

create table content_sections (
  id uuid default uuid_generate_v4() primary key,
  section_key text unique not null,
  title text,
  type text not null default 'section' check (type in ('section', 'hero', 'stat', 'team_member', 'testimonial')),
  content jsonb not null default '{}'::jsonb,
  sort_order integer default 0,
  is_published boolean default false not null,
  published_at timestamp with time zone,
  created_by uuid references auth.users,
  updated_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_content_sections_key on content_sections(section_key);
create index idx_content_sections_type on content_sections(type);
create index idx_content_sections_is_published on content_sections(is_published);
create index idx_content_sections_sort_order on content_sections(sort_order);
create index idx_content_sections_created_at on content_sections(created_at desc);

create trigger update_content_sections_updated_at
  before update on content_sections
  for each row execute procedure update_updated_at_column();
