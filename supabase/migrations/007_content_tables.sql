-- 007_content_tables.sql

create table projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  summary text,
  description text,
  featured_image text,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED')),
  start_date date,
  end_date date,
  location text,
  created_by uuid references auth.users,
  updated_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_projects_slug on projects(slug);
create index idx_projects_status on projects(status);
create index idx_projects_created_at on projects(created_at desc);

create trigger update_projects_updated_at
  before update on projects
  for each row execute procedure update_updated_at_column();

-- ============================================================
-- NEWS
-- ============================================================

create table news (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  featured_image text,
  category text,
  author text,
  published_date timestamp with time zone,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_by uuid references auth.users,
  updated_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_news_slug on news(slug);
create index idx_news_status on news(status);
create index idx_news_published_date on news(published_date desc);
create index idx_news_category on news(category);
create index idx_news_created_at on news(created_at desc);

create trigger update_news_updated_at
  before update on news
  for each row execute procedure update_updated_at_column();

-- ============================================================
-- GALLERY ITEMS
-- ============================================================

create table gallery_items (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  thumbnail_url text,
  caption text,
  category text,
  alt_text text,
  sort_order integer default 0,
  uploaded_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_gallery_category on gallery_items(category);
create index idx_gallery_sort_order on gallery_items(sort_order);
create index idx_gallery_created_at on gallery_items(created_at desc);
