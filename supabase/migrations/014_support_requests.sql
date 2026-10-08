-- Support requests table for people requesting assistance from the foundation
create table if not exists public.support_requests (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  id_number text not null,
  phone_number text not null,
  alternative_phone text,
  email text,
  country text not null default 'Kenya',
  county text not null,
  sub_county text not null,
  ward text not null,
  location text not null,
  current_location text not null,
  support_type text not null,
  support_description text not null,
  urgency text not null check (urgency in ('Emergency', 'Urgent', 'Normal')),
  people_needing_support text,
  additional_information text,
  preferred_contact_method text,
  status text not null default 'New' check (status in ('New', 'Under Review', 'Approved', 'In Progress', 'Completed', 'Rejected', 'Closed')),
  internal_notes text,
  reference_number text unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_support_requests_status on public.support_requests(status);
create index if not exists idx_support_requests_urgency on public.support_requests(urgency);
create index if not exists idx_support_requests_support_type on public.support_requests(support_type);
create index if not exists idx_support_requests_county on public.support_requests(county);
create index if not exists idx_support_requests_created_at on public.support_requests(created_at desc);

alter table public.support_requests enable row level security;

create policy "Anyone can submit support requests"
  on public.support_requests for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view support requests"
  on public.support_requests for select
  to authenticated
  using (exists (
    select 1 from user_roles ur
    join roles r on ur.role_id = r.id
    join profiles p on ur.user_id = p.id
    where ur.user_id = auth.uid() and r.name in ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER', 'CONTENT_MANAGER')
  ));

create policy "Admins can update support requests"
  on public.support_requests for update
  to authenticated
  using (exists (
    select 1 from user_roles ur
    join roles r on ur.role_id = r.id
    join profiles p on ur.user_id = p.id
    where ur.user_id = auth.uid() and r.name in ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER', 'CONTENT_MANAGER')
  ))
  with check (exists (
    select 1 from user_roles ur
    join roles r on ur.role_id = r.id
    join profiles p on ur.user_id = p.id
    where ur.user_id = auth.uid() and r.name in ('SUPER_ADMIN', 'ADMIN', 'EVENT_MANAGER', 'CONTENT_MANAGER')
  ));

create sequence if not exists support_request_ref_seq start 1;

create or replace function set_support_request_fields()
returns trigger as 
begin
  if new.reference_number is null then
    new.reference_number := 'SCF-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('support_request_ref_seq'::regclass)::text, 6, '0');
  end if;
  new.updated_at := now();
  return new;
end;
 language plpgsql;

create trigger trg_set_support_request_fields
  before insert or update on public.support_requests
  for each row execute function set_support_request_fields();

