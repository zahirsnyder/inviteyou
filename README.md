# InviteYou

A premium animated wedding invitation web app — couples create a cinematic wedding
website, share it with guests via link or QR code, collect RSVPs and guestbook wishes,
and manage everything from a dashboard.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4** with a custom luxury design system (gold / cream / night palette)
- **Framer Motion** for cinematic animations
- **Prisma** ORM — SQLite for local dev, PostgreSQL-ready
- **Zod** validation, server actions throughout
- **jose** JWT session cookies + bcryptjs password hashing
- **qrcode** for QR code generation

## Getting Started

```bash
npm install
npx prisma migrate dev   # creates dev.db and runs the seed
npm run dev
```

Open http://localhost:3000.

**Demo accounts (from seed):**

| Role | Email | Password |
| --- | --- | --- |
| Couple | demo@inviteyou.com | demo1234 |
| Admin | admin@inviteyou.com | admin1234 |

**Sample invitation:** http://localhost:3000/invite/amir-aisyah

## Features (MVP)

- Register/login with session cookies
- Couple dashboard with project list and stats (visits, QR scans, RSVP breakdown, wishes)
- Create/edit wedding project — names, date, story, quote, cover image, music, gift details
- Event schedule management (Akad Nikah, reception, …)
- Photo gallery (image URLs; file upload storage is a planned integration)
- Public animated invitation at `/invite/[slug]` — **Dark Cinematic Gold** theme:
  opening reveal, parallax hero, live countdown, story, events, gallery, RSVP form,
  guestbook, gift section, closing
- RSVP with attendance / pax / meal preference + CSV export
- Guestbook wishes with visibility moderation
- QR code generation and download (`?src=qr` visits tracked as QR scans)
- Publish/unpublish control; unpublished invitations 404 for guests

## Switching to PostgreSQL

1. In `prisma/schema.prisma`, change the datasource provider to `postgresql`.
2. Set `DATABASE_URL` in `.env` to your Postgres connection string.
3. Re-create migrations: `npx prisma migrate dev --name init`.

(Enum-like fields are plain strings so the schema works on both engines.)

## Environment Variables

See `.env.example`. Required: `DATABASE_URL`, `SESSION_SECRET`, `NEXT_PUBLIC_APP_URL`.

## Roadmap (per spec)

- Theme system with more themes (Royal Malay Classic, Minimal Luxury White, Garden Floral — already seeded)
- Guest management with unique invite links and CSV import
- File uploads (UploadThing / S3)
- Payments (ToyyibPay / Stripe) and plan limits
- Admin panel and advanced analytics charts
