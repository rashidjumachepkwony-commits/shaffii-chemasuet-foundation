-- 001_initial_schema.sql
-- Core foundation tables: profiles, roles, user_roles

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Roles table (static role definitions)
create table roles (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  display_name text not null,
  description text,
  permissions text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User roles (maps Supabase Auth users to roles)
create table user_roles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  role text not null references roles(name) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users,
  unique(user_id)
);

-- Profiles table (extends auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  email text,
  phone text,
  organization text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index idx_user_roles_user_id on user_roles(user_id);
create index idx_user_roles_role on user_roles(role);
create index idx_profiles_email on profiles(email);

-- Trigger: auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language 'plpgsql';

create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_user_roles_updated_at
  before update on user_roles
  for each row execute procedure update_updated_at_column();

create trigger update_roles_updated_at
  before update on roles
  for each row execute procedure update_updated_at_column();
