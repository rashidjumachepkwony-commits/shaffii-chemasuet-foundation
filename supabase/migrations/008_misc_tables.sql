-- 008_misc_tables.sql

-- ============================================================
-- VOLUNTEERS
-- ============================================================

create table volunteers (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text,
  phone text,
  location text,
  area_of_interest text,
  availability text,
  experience text,
  message text,
  status text not null default 'NEW' check (status in ('NEW', 'REVIEWING', 'APPROVED', 'DECLINED', 'CONTACTED')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_volunteers_email on volunteers(email);
create index idx_volunteers_status on volunteers(status);
create index idx_volunteers_created_at on volunteers(created_at desc);

create trigger update_volunteers_updated_at
  before update on volunteers
  for each row execute procedure update_updated_at_column();

-- ============================================================
-- DONATIONS
-- ============================================================

create table donations (
  id uuid default uuid_generate_v4() primary key,
  donor_name text,
  donor_email text,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'KES',
  payment_method text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  reference text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_donations_reference on donations(reference);
create index idx_donations_status on donations(status);
create index idx_donations_created_at on donations(created_at desc);

create trigger update_donations_updated_at
  before update on donations
  for each row execute procedure update_updated_at_column();

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================

create table contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'NEW' check (status in ('NEW', 'READ', 'REPLIED', 'ARCHIVED')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_contact_messages_status on contact_messages(status);
create index idx_contact_messages_created_at on contact_messages(created_at desc);
create index idx_contact_messages_email on contact_messages(email);

create trigger update_contact_messages_updated_at
  before update on contact_messages
  for each row execute procedure update_updated_at_column();

-- ============================================================
-- SITE SETTINGS
-- ============================================================

create table site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value text,
  type text not null default 'text' check (type in ('text', 'textarea', 'number', 'boolean', 'url', 'email')),
  group_name text not null default 'general',
  label text not null,
  description text,
  is_public boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_site_settings_key on site_settings(key);
create index idx_site_settings_group on site_settings(group_name);
create index idx_site_settings_is_public on site_settings(is_public);

create trigger update_site_settings_updated_at
  before update on site_settings
  for each row execute procedure update_updated_at_column();

-- ============================================================
-- AUDIT LOGS
-- ============================================================

create table audit_logs (
  id uuid default uuid_generate_v4() primary key,
  actor_id uuid references auth.users,
  action text not null,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_audit_logs_actor_id on audit_logs(actor_id);
create index idx_audit_logs_action on audit_logs(action);
create index idx_audit_logs_created_at on audit_logs(created_at desc);
create index idx_audit_logs_table_name on audit_logs(table_name);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

create table notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('registration', 'attendance', 'event', 'news', 'system')),
  read boolean default false not null,
  action_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_notifications_user_id on notifications(user_id);
create index idx_notifications_read on notifications(read);
create index idx_notifications_created_at on notifications(created_at desc);
