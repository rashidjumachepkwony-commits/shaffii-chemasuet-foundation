alter table event_registrations
  add column if not exists id_number text,
  add column if not exists sub_county text,
  add column if not exists ward text,
  add column if not exists location text,
  add column if not exists sub_location text;
