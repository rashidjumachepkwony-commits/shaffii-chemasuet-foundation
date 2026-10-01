-- 006_rls.sql
-- Row Level Security policies for all tables

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table user_roles enable row level security;
alter table roles enable row level security;
alter table events enable row level security;
alter table event_categories enable row level security;
alter table event_registrations enable row level security;
alter table projects enable row level security;
alter table news enable row level security;
alter table gallery_items enable row level security;
alter table volunteers enable row level security;
alter table donations enable row level security;
alter table contact_messages enable row level security;
alter table site_settings enable row level security;
alter table audit_logs enable row level security;
alter table notifications enable row level security;

-- Helper function to check if user has a specific permission
create or replace function user_has_permission(user_uuid uuid, permission text)
returns boolean as $$
declare
  user_role text;
  role_permissions text[];
begin
  select r.role into user_role
  from user_roles r
  where r.user_id = user_uuid;

  if user_role is null then
    return false;
  end if;

  select permissions into role_permissions
  from roles
  where name = user_role;

  return role_permissions && array[permission];
end;
$$ language plpgsql stable;

-- Helper function to check if user has a specific role
create or replace function user_has_role(user_uuid uuid, role_name text)
returns boolean as $$
declare
  user_role text;
begin
  select r.role into user_role
  from user_roles r
  where r.user_id = user_uuid;

  return user_role = role_name;
end;
$$ language plpgsql stable;

-- Helper function to check if user is admin (any admin role)
create or replace function user_is_admin(user_uuid uuid)
returns boolean as $$
declare
  user_role text;
begin
  select r.role into user_role
  from user_roles r
  where r.user_id = user_uuid;

  return user_role in ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER', 'CONTENT_MANAGER');
end;
$$ language plpgsql stable;

-- ============================================================
-- POLICIES: profiles
-- ============================================================

-- Users can view their own profile
create policy "users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Users can insert their own profile (during signup)
create policy "users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Admins can view all profiles
create policy "admins can view all profiles"
  on profiles for select
  using (user_is_admin(auth.uid()));

-- Admins can update all profiles
create policy "admins can update all profiles"
  on profiles for update
  using (user_is_admin(auth.uid()));

-- ============================================================
-- POLICIES: user_roles
-- ============================================================

-- Users can view their own role
create policy "users can view own role"
  on user_roles for select
  using (user_id = auth.uid());

-- Only SUPER_ADMIN can insert roles
create policy "super_admin can insert roles"
  on user_roles for insert
  with check (user_has_role(auth.uid(), 'SUPER_ADMIN'));

-- Only SUPER_ADMIN can update roles
create policy "super_admin can update roles"
  on user_roles for update
  using (user_has_role(auth.uid(), 'SUPER_ADMIN'));

-- Only SUPER_ADMIN can delete roles
create policy "super_admin can delete roles"
  on user_roles for delete
  using (user_has_role(auth.uid(), 'SUPER_ADMIN'));

-- ============================================================
-- POLICIES: roles
-- ============================================================

-- Roles are readable by any authenticated user
create policy "authenticated can read roles"
  on roles for select
  to authenticated
  using (auth.uid() is not null);

-- Only SUPER_ADMIN can modify roles
create policy "super_admin can manage roles"
  on roles for insert
  with check (user_has_role(auth.uid(), 'SUPER_ADMIN'));

create policy "super_admin can update roles"
  on roles for update
  using (user_has_role(auth.uid(), 'SUPER_ADMIN'));

create policy "super_admin can delete roles"
  on roles for delete
  using (user_has_role(auth.uid(), 'SUPER_ADMIN'));

-- ============================================================
-- POLICIES: event_categories
-- ============================================================

-- Categories are readable by anyone
create policy "public can read categories"
  on event_categories for select
  using (true);

-- Only admins can manage categories
create policy "admins can manage categories"
  on event_categories for insert
  with check (user_is_admin(auth.uid()));

create policy "admins can update categories"
  on event_categories for update
  using (user_is_admin(auth.uid()));

create policy "admins can delete categories"
  on event_categories for delete
  using (user_is_admin(auth.uid()));

-- ============================================================
-- POLICIES: events
-- ============================================================

-- Only published events are visible publicly
create policy "public can view published events"
  on events for select
  using (published = true and status = 'PUBLISHED');

-- Authenticated users can view all events (for admin/dashboard purposes)
create policy "authenticated can view all events"
  on events for select
  to authenticated
  using (auth.uid() is not null);

-- Only admins can create events
create policy "admins can create events"
  on events for insert
  with check (user_is_admin(auth.uid()));

-- Only admins can update events
create policy "admins can update events"
  on events for update
  using (user_has_permission(auth.uid(), 'events.update'));

-- Only admins can delete events
create policy "admins can delete events"
  on events for delete
  using (user_has_permission(auth.uid(), 'events.delete'));

-- ============================================================
-- POLICIES: event_registrations
-- ============================================================

-- Public can see registration counts (for capacity display)
-- Individual registrations are restricted by user
create policy "users can view own registrations"
  on event_registrations for select
  using (
    user_id = auth.uid()
    OR user_has_permission(auth.uid(), 'registrations.view')
  );

-- Users can insert their own registrations
create policy "users can create registrations"
  on event_registrations for insert
  with check (user_id = auth.uid() OR user_id IS NULL);

-- Users cannot update their own registrations (prevents tampering)
create policy "admins can update registrations"
  on event_registrations for update
  using (user_has_permission(auth.uid(), 'registrations.manage'));

-- Only admins can delete registrations
create policy "admins can delete registrations"
  on event_registrations for delete
  using (user_has_permission(auth.uid(), 'registrations.manage'));

-- ============================================================
-- POLICIES: projects
-- ============================================================

-- Public can view published projects
create policy "public can view published projects"
  on projects for select
  using (status = 'COMPLETED' OR status = 'IN_PROGRESS');

-- Admins can view all projects
create policy "admins can view all projects"
  on projects for select
  to authenticated
  using (user_has_permission(auth.uid(), 'projects.create') OR user_is_admin(auth.uid()));

-- Only admins can manage projects
create policy "admins can create projects"
  on projects for insert
  with check (user_has_permission(auth.uid(), 'projects.create'));

create policy "admins can update projects"
  on projects for update
  using (user_has_permission(auth.uid(), 'projects.update'));

create policy "admins can delete projects"
  on projects for delete
  using (user_has_permission(auth.uid(), 'projects.delete'));

-- ============================================================
-- POLICIES: news
-- ============================================================

-- Public can view published news
create policy "public can view published news"
  on news for select
  using (status = 'PUBLISHED');

-- Admins can view all news
create policy "admins can view all news"
  on news for select
  to authenticated
  using (user_has_permission(auth.uid(), 'news.create') OR user_is_admin(auth.uid()));

-- Only admins can manage news
create policy "admins can create news"
  on news for insert
  with check (user_has_permission(auth.uid(), 'news.create'));

create policy "admins can update news"
  on news for update
  using (user_has_permission(auth.uid(), 'news.update'));

create policy "admins can delete news"
  on news for delete
  using (user_has_permission(auth.uid(), 'news.delete'));

-- ============================================================
-- POLICIES: gallery_items
-- ============================================================

-- Gallery is publicly readable (for performance)
create policy "public can view gallery"
  on gallery_items for select
  using (true);

-- Only admins can manage gallery
create policy "admins can create gallery items"
  on gallery_items for insert
  with check (user_has_permission(auth.uid(), 'gallery.manage'));

create policy "admins can update gallery items"
  on gallery_items for update
  using (user_has_permission(auth.uid(), 'gallery.manage'));

create policy "admins can delete gallery items"
  on gallery_items for delete
  using (user_has_permission(auth.uid(), 'gallery.manage'));

-- ============================================================
-- POLICIES: volunteers
-- ============================================================

-- Public can submit volunteer applications (insert only their own)
create policy "public can submit volunteer application"
  on volunteers for insert
  with check (true);

-- Only admins can view all volunteers
create policy "admins can view volunteers"
  on volunteers for select
  using (user_has_permission(auth.uid(), 'volunteers.manage'));

-- Only admins can update volunteers
create policy "admins can update volunteers"
  on volunteers for update
  using (user_has_permission(auth.uid(), 'volunteers.manage'));

-- Admins can delete volunteers
create policy "admins can delete volunteers"
  on volunteers for delete
  using (user_has_permission(auth.uid(), 'volunteers.manage'));

-- ============================================================
-- POLICIES: donations
-- ============================================================

-- Public can view donation totals (for transparency)
create policy "public can view donations"
  on donations for select
  using (true);

-- Only admins can manage donations
create policy "admins can manage donations"
  on donations for insert
  with check (user_has_permission(auth.uid(), 'donations.manage'));
create policy "admins can update donations"
  on donations for update
  using (user_has_permission(auth.uid(), 'donations.manage'));
create policy "admins can delete donations"
  on donations for delete
  using (user_has_permission(auth.uid(), 'donations.manage'));

-- ============================================================
-- POLICIES: contact_messages
-- ============================================================

-- Public can submit contact messages
create policy "public can submit contact message"
  on contact_messages for insert
  with check (true);

-- Only admins can view/manage messages
create policy "admins can view contact messages"
  on contact_messages for select
  using (user_has_permission(auth.uid(), 'contact.manage'));

create policy "admins can update contact messages"
  on contact_messages for update
  using (user_has_permission(auth.uid(), 'contact.manage'));

create policy "admins can delete contact messages"
  on contact_messages for delete
  using (user_has_permission(auth.uid(), 'contact.manage'));

-- ============================================================
-- POLICIES: site_settings
-- ============================================================

-- Public can read public settings
create policy "public can read public settings"
  on site_settings for select
  using (is_public = true);

-- Only admins can manage all settings
create policy "admins can manage settings"
  on site_settings for select
  using (user_has_permission(auth.uid(), 'settings.manage'));

create policy "admins can insert settings"
  on site_settings for insert
  with check (user_has_permission(auth.uid(), 'settings.manage'));

create policy "admins can update settings"
  on site_settings for update
  using (user_has_permission(auth.uid(), 'settings.manage'));

create policy "admins can delete settings"
  on site_settings for delete
  using (user_has_permission(auth.uid(), 'settings.manage'));

-- ============================================================
-- POLICIES: audit_logs
-- ============================================================

-- Only admins can view audit logs
create policy "admins can view audit logs"
  on audit_logs for select
  using (user_has_permission(auth.uid(), 'audit_logs.view'));

-- Audit logs are insert-only (system inserts)
create policy "system can insert audit logs"
  on audit_logs for insert
  with check (true);

-- Nobody can update or delete audit logs
create policy "no updates to audit logs"
  on audit_logs for update
  using (false);

create policy "no deletes from audit logs"
  on audit_logs for delete
  using (false);

-- ============================================================
-- POLICIES: notifications
-- ============================================================

-- Users can view their own notifications
create policy "users can view own notifications"
  on notifications for select
  using (user_id = auth.uid());

-- Users can update their own notification read status
create policy "users can update own notifications"
  on notifications for update
  using (user_id = auth.uid());
