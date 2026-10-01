-- 005_event_registrations.sql

create table event_registrations (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) on delete cascade not null,
  user_id uuid references auth.users on delete set null,
  registration_reference text unique not null,
  full_name text not null,
  email text not null,
  phone text,
  organization text,
  attendee_count integer not null default 1 check (attendee_count > 0),
  notes text,
  status text not null default 'REGISTERED' check (status in ('REGISTERED', 'CHECKED_IN', 'DID_NOT_ATTEND', 'CANCELLED')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_event_registrations_event_id on event_registrations(event_id);
create index idx_event_registrations_user_id on event_registrations(user_id);
create index idx_event_registrations_reference on event_registrations(registration_reference);
create index idx_event_registrations_status on event_registrations(status);
create index idx_event_registrations_email on event_registrations(email);

create trigger update_event_registrations_updated_at
  before update on event_registrations
  for each row execute procedure update_updated_at_column();

-- Prevent duplicate registrations (same email or same user for the same event)
create unique index idx_event_registrations_unique_email
  on event_registrations(event_id, email)
  where status in ('REGISTERED', 'CHECKED_IN');

create unique index idx_event_registrations_unique_user
  on event_registrations(event_id, user_id)
  where user_id is not null and status in ('REGISTERED', 'CHECKED_IN');

-- Function: Generate unique registration reference
create or replace function generate_registration_reference()
returns text as $$
declare
  ref text;
  year_val integer;
  counter_val bigint;
begin
  year_val := extract(year from now());
  loop
    select coalesce(max(id), 0) + 1 into counter_val
    from event_registrations;
    ref := format('SCF-EVT-%s-%s', year_val, lpad((counter_val % 1000000)::text, 6, '0'));
    exit when not exists (
      select 1 from event_registrations where registration_reference = ref
    );
  end loop;
  return ref;
end;
$$ language plpgsql;

-- Function: Check if a user can register for an event
create or replace function can_register_for_event(
  p_user_id uuid,
  p_event_id uuid,
  p_email text
)
returns table (can_register boolean, reason text) as $$
declare
  v_event events%rowtype;
  v_status text;
  v_count int;
begin
  -- Get event
  select * into v_event from events where id = p_event_id;

  if not found then
    return query select false, 'Event not found'::text;
    return;
  end if;

  -- Check if published
  if v_event.status != 'PUBLISHED' then
    return query select false, 'Event is not published'::text;
    return;
  end if;

  -- Check registration enabled
  if not v_event.registration_enabled then
    return query select false, 'Registration is currently disabled'::text;
    return;
  end if;

  -- Check registration deadline
  if v_event.registration_deadline is not null and now() > v_event.registration_deadline then
    return query select false, 'Registration has closed'::text;
    return;
  end if;

  -- Check capacity
  if v_event.capacity is not null then
    select count(*) into v_count
    from event_registrations
    where event_id = p_event_id
      and status in ('REGISTERED', 'CHECKED_IN');
    if v_count >= v_event.capacity then
      return query select false, 'This event is full'::text;
      return;
    end if;
  end if;

  -- Check for duplicate registration
  if p_user_id is not null then
    select count(*) into v_count
    from event_registrations
    where event_id = p_event_id
      and user_id = p_user_id
      and status in ('REGISTERED', 'CHECKED_IN');
    if v_count > 0 then
      return query select false, 'You have already registered for this event'::text;
      return;
    end if;
  end if;

  -- Check by email
  select count(*) into v_count
  from event_registrations
  where event_id = p_event_id
    and email = p_email
    and status in ('REGISTERED', 'CHECKED_IN');
  if v_count > 0 then
    return query select false, 'This email has already been registered for this event'::text;
    return;
  end if;

  return query select true, ''::text;
end;
$$ language plpgsql;
