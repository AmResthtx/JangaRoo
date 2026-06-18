-- Demo seed data for Rhythm Dance Studio
-- Uses CTEs to reference inserted IDs cleanly

with studio_insert as (
  insert into studios (slug, name, contact_email, manager_email, n8n_webhook_url)
  values (
    'rhythm',
    'Rhythm Dance Studio',
    'info@rhythmdance.com',
    'manager@rhythmdance.com',
    null
  )
  returning id
),

room_a as (
  insert into rooms (studio_id, name, capacity)
  select id, 'Studio A', 12 from studio_insert
  returning id, studio_id
),

room_b as (
  insert into rooms (studio_id, name, capacity)
  select studio_id, 'Studio B', 8 from room_a
  returning id
),

teacher_sofia as (
  insert into teachers (studio_id, name, email, phone, bio)
  select id, 'Sofia Martinez', 'sofia@rhythmdance.com', '+1-555-0101',
    'Sofia has been dancing Latin styles for over 15 years. She specialises in Salsa, Bachata, and Cha-Cha, bringing warmth and precision to every lesson.'
  from studio_insert
  returning id
),

teacher_james as (
  insert into teachers (studio_id, name, email, phone, bio)
  select id, 'James Chen', 'james@rhythmdance.com', '+1-555-0102',
    'James is a former competitive ballroom dancer with a passion for teaching. He covers Waltz, Foxtrot, and Tango with a focus on technique and posture.'
  from studio_insert
  returning id
),

teacher_amara as (
  insert into teachers (studio_id, name, email, phone, bio)
  select id, 'Amara Okafor', 'amara@rhythmdance.com', '+1-555-0103',
    'Amara brings the energy of Afrobeats and contemporary dance to every class. She loves helping beginners find their rhythm and confidence on the dance floor.'
  from studio_insert
  returning id
),

-- Sofia availability: Mon-Fri 10:00-21:00 hourly private slots in Studio A
sofia_slots as (
  insert into availability_slots (teacher_id, room_id, day_of_week, start_time, end_time, slot_type)
  select
    teacher_sofia.id,
    room_a.id,
    d.day_of_week,
    (make_time(h, 0, 0))::time,
    (make_time(h + 1, 0, 0))::time,
    'private'
  from teacher_sofia, room_a,
    generate_series(1, 5) as d(day_of_week),
    generate_series(10, 20) as h
  returning id
),

-- James availability: Mon-Fri 10:00-21:00 hourly private slots in Studio B
james_slots as (
  insert into availability_slots (teacher_id, room_id, day_of_week, start_time, end_time, slot_type)
  select
    teacher_james.id,
    room_b.id,
    d.day_of_week,
    (make_time(h, 0, 0))::time,
    (make_time(h + 1, 0, 0))::time,
    'private'
  from teacher_james, room_b,
    generate_series(1, 5) as d(day_of_week),
    generate_series(10, 20) as h
  returning id
),

-- Amara availability: Mon-Fri 10:00-21:00 hourly private slots in Studio A
amara_slots as (
  insert into availability_slots (teacher_id, room_id, day_of_week, start_time, end_time, slot_type)
  select
    teacher_amara.id,
    room_a.id,
    d.day_of_week,
    (make_time(h, 0, 0))::time,
    (make_time(h + 1, 0, 0))::time,
    'private'
  from teacher_amara, room_a,
    generate_series(1, 5) as d(day_of_week),
    generate_series(10, 20) as h
  returning id
)

select 'Seed complete: Rhythm Dance Studio with 3 teachers, 2 rooms, and Mon-Fri availability 10:00-21:00' as result;
