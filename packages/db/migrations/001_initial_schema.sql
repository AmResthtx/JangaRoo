-- Multi-studio config
create table studios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  logo_url text,
  contact_email text not null,
  manager_email text not null,
  n8n_webhook_url text,
  twilio_enabled boolean default false,
  created_at timestamptz default now()
);

create table teachers (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid references studios(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  bio text,
  photo_url text,
  active boolean default true,
  created_at timestamptz default now()
);

create table rooms (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid references studios(id) on delete cascade,
  name text not null,
  capacity int,
  active boolean default true
);

create table availability_slots (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references teachers(id) on delete cascade,
  room_id uuid references rooms(id) on delete cascade,
  day_of_week int check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_type text check (slot_type in ('class', 'private')) default 'private',
  active boolean default true
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid references studios(id),
  teacher_id uuid references teachers(id),
  room_id uuid references rooms(id),
  student_name text not null,
  student_email text not null,
  student_phone text,
  notify_via text[] default '{email}',
  booking_date date not null,
  start_time time not null,
  end_time time not null,
  lesson_type text check (lesson_type in ('class', 'private')) default 'private',
  status text check (status in ('pending','approved','rejected')) default 'pending',
  manager_notes text,
  n8n_run_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table studios enable row level security;
alter table teachers enable row level security;
alter table rooms enable row level security;
alter table bookings enable row level security;
alter table availability_slots enable row level security;

create policy "public read studios" on studios for select using (true);
create policy "public read teachers" on teachers for select using (active = true);
create policy "public read rooms" on rooms for select using (active = true);
create policy "public read availability" on availability_slots for select using (active = true);
create policy "public insert bookings" on bookings for insert with check (status = 'pending');
create policy "public read bookings" on bookings for select using (true);
create policy "service update bookings" on bookings for update using (true);

create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger bookings_updated_at before update on bookings
for each row execute function update_updated_at();
