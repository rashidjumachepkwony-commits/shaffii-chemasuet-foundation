-- 011_audit_functions.sql
-- Audit trail triggers and helper functions

-- ============================================================
-- Audit Trail Trigger Function
-- ============================================================

create or replace function audit_trigger_function()
returns trigger as $$
declare
  v_actor uuid := auth.uid();
  v_action text;
  v_old_values jsonb;
  v_new_values jsonb;
begin
  -- Determine the action
  if tg_op = 'INSERT' then
    v_action := 'INSERT';
    v_new_values := row_to_json(NEW)::jsonb;
    v_old_values := null;
  elsif tg_op = 'UPDATE' then
    v_action := 'UPDATE';
    v_old_values := row_to_json(OLD)::jsonb;
    v_new_values := row_to_json(NEW)::jsonb;
  elsif tg_op = 'DELETE' then
    v_action := 'DELETE';
    v_old_values := row_to_json(OLD)::jsonb;
    v_new_values := null;
  else
    return NEW;
  end if;

  -- Insert audit log entry
  insert into audit_logs (actor_id, action, table_name, record_id, old_values, new_values)
  values (
    v_actor,
    v_action,
    tg_table_name,
    case
      when tg_op = 'INSERT' then NEW.id
      when tg_op = 'UPDATE' then NEW.id
      when tg_op = 'DELETE' then OLD.id
      else null
    end,
    v_old_values,
    v_new_values
  );

  return NEW;
end;
$$ language 'plpgsql' security definer;

-- ============================================================
-- Create audit triggers for tables that need tracking
-- ============================================================

-- Events
create trigger audit_events_trigger
  after insert or update or delete on events
  for each row execute function audit_trigger_function();

create trigger audit_event_categories_trigger
  after insert or update or delete on event_categories
  for each row execute function audit_trigger_function();

-- Event Registrations
create trigger audit_event_registrations_trigger
  after insert or update or delete on event_registrations
  for each row execute function audit_trigger_function();

-- Projects
create trigger audit_projects_trigger
  after insert or update or delete on projects
  for each row execute function audit_trigger_function();

-- News
create trigger audit_news_trigger
  after insert or update or delete on news
  for each row execute function audit_trigger_function();

-- Gallery
create trigger audit_gallery_trigger
  after insert or update or delete on gallery_items
  for each row execute function audit_trigger_function();

-- Volunteers
create trigger audit_volunteers_trigger
  after insert or update or delete on volunteers
  for each row execute function audit_trigger_function();

-- Donations
create trigger audit_donations_trigger
  after insert or update or delete on donations
  for each row execute function audit_trigger_function();

-- Contact Messages
create trigger audit_contact_messages_trigger
  after insert or update or delete on contact_messages
  for each row execute function audit_trigger_function();

-- Site Settings
create trigger audit_site_settings_trigger
  after insert or update or delete on site_settings
  for each row execute function audit_trigger_function();

-- Profiles
create trigger audit_profiles_trigger
  after insert or update or delete on profiles
  for each row execute function audit_trigger_function();

-- User Roles
create trigger audit_user_roles_trigger
  after insert or update or delete on user_roles
  for each row execute function audit_trigger_function();

-- ============================================================
-- Notification creation trigger
-- ============================================================

create or replace function create_registration_notification()
returns trigger as $$
declare
  v_event_title text;
begin
  -- Get the event title
  select title into v_event_title
  from events
  where id = NEW.event_id;

  -- Create a notification for the user who registered
  if NEW.user_id is not null then
    insert into notifications (user_id, title, message, type, action_url)
    values (
      NEW.user_id,
      'Registration Confirmed',
      format('Your registration for "%s" has been confirmed.', v_event_title),
      'registration',
      format('/events/%s/registrations', (select slug from events where id = NEW.event_id))
    );
  end if;

  return NEW;
end;
$$ language 'plpgsql';

create trigger create_registration_notification_trigger
  after insert on event_registrations
  for each row execute function create_registration_notification();

-- ============================================================
-- Timestamp trigger helper
-- ============================================================

-- This redefines the update_updated_at_column function with a more robust version
-- that works correctly with all tables
create or replace function update_updated_at_column()
returns trigger as $$
begin
  if tg_op = 'UPDATE' then
    new.updated_at := timezone('utc'::text, now());
  end if;
  return new;
end;
$$ language 'plpgsql';
