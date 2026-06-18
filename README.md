# JangaRoo — Multi-Tenant Dance Studio Booking Platform

JangaRoo is an open-source, multi-studio booking platform for dance schools. Students browse teachers, pick a time slot, and submit a booking request. The studio manager receives an email with one-click approve/reject links. On approval, both the teacher and student are notified. The entire workflow is orchestrated by n8n, keeping business logic outside the app.

---

## Architecture

```
Student
  │
  │  fills out booking form
  ▼
Booking UI (Next.js 14)
  │
  │  POST /api/bookings  (inserts row, status='pending')
  ▼
Supabase (Postgres + RLS)
  │
  │  triggers n8n webhook  (action='new_booking')
  ▼
n8n Workflow
  │
  │  sends approval email
  ▼
Manager Email
  │
  ├─── clicks "Approve" link ──► PATCH /api/bookings/[id]/approve
  │                                  │
  │                                  ▼
  │                             n8n (action='approved')
  │                                  │
  │                        ┌─────────┴────────────┐
  │                        ▼                      ▼
  │                 Email → Teacher        Email → Student
  │
  └─── clicks "Reject" link ───► PATCH /api/bookings/[id]/reject
                                     │
                                     ▼
                                n8n (action='rejected')
                                     │
                                     ▼
                              Email → Student
```

---

## Quickstart

### 1. Clone the repo

```bash
git clone https://github.com/your-org/jangaroo.git
cd jangaroo
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor**.
3. Paste and run `packages/db/migrations/001_initial_schema.sql`.
4. Then paste and run `packages/db/migrations/002_seed_demo.sql` to load demo data.
5. Copy your **Project URL** and **anon key** from *Project Settings → API*.

### 3. Import the n8n workflow

1. Install [n8n](https://n8n.io) (self-hosted or cloud).
2. In n8n, go to **Workflows → Import** and upload `packages/n8n/workflows/booking-approval.json`.
3. Configure SMTP credentials in n8n for the Send Email nodes.
4. Activate the workflow and copy the webhook URL.
5. In Supabase SQL Editor run:
   ```sql
   update studios
   set n8n_webhook_url = 'https://your-n8n-instance.com/webhook/booking-event'
   where slug = 'rhythm';
   ```

### 4. Configure environment variables

```bash
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local and fill in your values
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_DEFAULT_STUDIO_SLUG` | Studio slug for the default `/book` route |
| `N8N_WEBHOOK_SECRET` | Optional secret to verify n8n webhook requests |

### 5. Install dependencies

```bash
npm install
```

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Adding a New Studio

1. Insert a row into the `studios` table:

```sql
insert into studios (slug, name, contact_email, manager_email, n8n_webhook_url)
values (
  'salsa-kings',
  'Salsa Kings Dance Studio',
  'info@salsaking.com',
  'owner@salsaking.com',
  'https://your-n8n.com/webhook/booking-event'
);
```

2. Insert teachers, rooms, and availability slots referencing the new studio's `id`.

3. Students can book at `/book/salsa-kings`.

That's it — no code changes needed.

---

## Folder Structure

```
jangaroo/
├── apps/
│   └── web/                        # Next.js 14 application
│       ├── app/
│       │   ├── page.tsx            # Landing page
│       │   ├── layout.tsx          # Root layout with Navbar
│       │   ├── book/
│       │   │   ├── page.tsx        # Default studio booking page
│       │   │   └── [studioSlug]/   # Multi-studio booking page
│       │   ├── admin/
│       │   │   ├── dashboard/      # Booking management dashboard
│       │   │   └── teachers/       # Teacher management
│       │   └── api/
│       │       └── bookings/       # REST API routes
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── BookingForm.tsx     # Multi-step booking wizard
│       │   ├── BookingCalendar.tsx # FullCalendar view of bookings
│       │   └── BookingCard.tsx     # Admin card with approve/reject
│       └── lib/
│           ├── supabase.ts         # Supabase client helpers
│           ├── n8n.ts              # n8n webhook trigger helper
│           └── types.ts            # Shared TypeScript types
├── packages/
│   ├── db/
│   │   ├── migrations/             # SQL migration files
│   │   └── schema.ts               # TypeScript type definitions
│   └── n8n/
│       ├── README.md               # n8n setup guide
│       └── workflows/
│           └── booking-approval.json  # Importable n8n workflow
└── package.json                    # Workspace root
```

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Database**: Supabase (Postgres) with Row Level Security
- **Automation**: n8n (webhook-driven email notifications)
- **Calendar**: FullCalendar (React)
- **Notifications**: SMTP via n8n, optional Twilio SMS

---

## License

MIT
