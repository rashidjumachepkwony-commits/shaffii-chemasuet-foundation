-- 002_roles.sql
-- Seed the roles table with predefined roles and their permissions

insert into roles (name, display_name, description, permissions) values
('SUPER_ADMIN', 'Super Administrator', 'Full system access', array[
  'events.view', 'events.create', 'events.update', 'events.delete', 'events.publish',
  'registrations.view', 'registrations.manage', 'attendance.view', 'attendance.manage',
  'users.view', 'users.manage',
  'projects.create', 'projects.update', 'projects.delete',
  'news.create', 'news.update', 'news.delete', 'news.publish',
  'gallery.manage', 'volunteers.manage', 'donations.manage',
  'settings.manage', 'audit_logs.view', 'messages.manage', 'contact.manage'
]),
('ADMIN', 'Administrator', 'Full administrative access', array[
  'events.view', 'events.create', 'events.update', 'events.delete', 'events.publish',
  'registrations.view', 'registrations.manage', 'attendance.view', 'attendance.manage',
  'users.view', 'users.manage',
  'projects.create', 'projects.update', 'projects.delete',
  'news.create', 'news.update', 'news.delete', 'news.publish',
  'gallery.manage', 'volunteers.manage', 'donations.manage',
  'settings.manage', 'audit_logs.view', 'messages.manage', 'contact.manage'
]),
('EVENT_MANAGER', 'Event Manager', 'Manage events and registrations', array[
  'events.view', 'events.create', 'events.update', 'events.publish',
  'registrations.view', 'registrations.manage', 'attendance.view', 'attendance.manage'
]),
('CONTENT_MANAGER', 'Content Manager', 'Manage content pages', array[
  'events.view', 'events.publish',
  'projects.create', 'projects.update', 'projects.delete',
  'news.create', 'news.update', 'news.delete', 'news.publish',
  'gallery.manage', 'messages.manage'
]),
('USER', 'Standard User', 'Basic user access', array[]::text[]);
