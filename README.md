# InviteYou

A premium animated wedding invitation SaaS. Visitors browse **templates**, unlock
the one they want, then a guided wizard walks them through filling in every part —
names, date, story, cover, event schedule, gallery, and gift details — and publishes
a cinematic wedding website they share with guests via link or QR code. Couples
collect RSVPs and guestbook wishes and manage everything from a dashboard.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4** with a custom luxury design system (gold / cream / night palette)
- **Framer Motion** for cinematic animations
- **Prisma** ORM on **PostgreSQL** (Supabase in production)
- **Zod** validation, server actions throughout
- **jose** JWT session cookies + bcryptjs password hashing
- **qrcode** for QR code generation
- Deployed on **Netlify**

## Local Development

You need a PostgreSQL database. Use a local Postgres, or a free Supabase project.

```bash
npm install

# 1. Put connection strings + a session secret in .env  (see .env.example)
#    DATABASE_URL  -> Supabase transaction pooler, 6543 (app runtime)
#    DIRECT_URL    -> Supabase session pooler, 5432 (migrations)
#    SESSION_SECRET-> `openssl rand -hex 32`

# 2. Create the schema and seed templates + the sample invitation
npx prisma migrate dev
npx prisma db seed

# 3. Run it
npm run dev
```

Open http://localhost:3000.

### Seeded accounts

| Role  | Email                  | Password  | Notes                                        |
| ----- | ---------------------- | --------- | -------------------------------------------- |
| Owner | zahirsnyder@gmail.com  | zahirf12  | ADMIN. Owns the sample invitation.           |
| Couple| demo@inviteyou.com     | demo1234  | Test customer.                               |
| Admin | admin@inviteyou.com    | admin1234 | Test admin.                                  |

- **Marketplace:** http://localhost:3000/templates
- **Sample invitation:** http://localhost:3000/invite/zahir-nisa

> The seed always assigns the sample `zahir-nisa` project to `zahirsnyder@gmail.com`.
> Change the owner password after first login (or edit `prisma/seed.ts` before seeding).

## How it works

- **Templates** are `Theme` rows with a per-invitation price (`src/lib/templates.ts`).
- **One purchase = one invitation.** A `TemplatePurchase` is an *invitation credit*.
  It's "unused" while `projectId` is null; the wizard consumes exactly one credit by
  binding it to the new project (`createProjectFromTemplateAction`, in a
  transaction). Building another wedding — any couple — needs another credit. This
  is what stops one payment being reused for many weddings.
- **No payment gateway yet.** "Get this template" mints one `PAID` credit
  immediately (`claimTemplateAction`). An ADMIN can change a credit's status from
  **Dashboard → My Templates**. Wire a real gateway (Stripe / ToyyibPay) into
  `src/app/actions/templates.ts` + the `Payment` model later.
- **Identity lock.** On first publish a project is stamped `lockedAt`; after that
  `groomName` / `brideName` / `weddingDate` can't be edited (`updateProjectAction`
  rejects the change; the editor shows the fields read-only). A different wedding =
  a new invitation.
- **Expiry.** On first publish `expiresAt` is set to `weddingDate + 90 days`
  (`INVITATION_GRACE_DAYS` in `src/lib/constants.ts`). After that `/invite/[slug]`
  shows an "invitation has ended" page to guests (owner preview still works) and the
  page is `noindex`. **Dashboard → project** has an **Extend** button
  (`extendInvitationAction`, +180 days, writes a `Payment` audit row).
- **Watermark.** An invitation whose bound credit isn't `PAID` renders a
  "Made with InviteYou" badge (`InvitationData.watermark`). Everything is `PAID`
  today, so it never shows — the hook is there for when payments go live.
- **The wizard** (`src/components/dashboard/InvitationWizard.tsx`) posts one payload
  to `createProjectFromTemplateAction`, which re-checks the credit and writes the
  project + events + gallery.
- **Six templates, each its own renderer** in `src/components/invitation/themes/`:
  `CinematicJourneyTheme` (scroll journey), `RoyalMalayTheme` (ornate/symmetric),
  `MinimalLuxuryTheme` (editorial/left-aligned/light), `GardenFloralTheme`
  (organic/rounded), `SunsetTerracottaTheme` (arches/colour-bands),
  `MidnightSapphireTheme` (celestial/timeline). `InvitationRenderer` switches on
  `themeSlug`; `ClassicTheme` is the fallback for unknown slugs. Palette per
  template still comes from a preset (`themes/presets.ts`) applied as CSS custom
  properties. Shared bits in `themes/../parts/` (`RsvpForm`, `WishForm`,
  `useCountdown`, `useInvitationShell`).
- **Animated backgrounds** (`src/components/invitation/three/`): raw three.js.
  `ParticleField` (`drift` gold dust / `rise` embers / `fall` petals / `stars`
  parallax field with shooting stars) and `SunsetHaze` (animated gradient shader).
  Each honours `prefers-reduced-motion` and fully disposes on unmount.
- **Add a template:** new `Theme` row in `prisma/seed.ts` + a preset entry + a
  renderer component wired into `InvitationRenderer`.
- **Live demo per template:** `/preview/[slug]` renders the sample invitation
  content with that template's renderer (linked as "View live demo").

## Deploy to Netlify + Supabase

1. **Supabase** — create a project. In *Project Settings → Database → Connection
   string*, use the **pooler** host (`aws-0-<region>.pooler.supabase.com`) for both
   URLs — the `db.<ref>.supabase.co` direct host is IPv6-only and unreachable from
   Netlify's IPv4-only build servers:
   - **Transaction pooler**, port `6543` → `DATABASE_URL`
     (append `?pgbouncer=true&connection_limit=1`)
   - **Session pooler**, port `5432`, no `pgbouncer` → `DIRECT_URL`

2. **Local migration + seed** — with both URLs in `.env`:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
   (You can also run these later from any machine that has the env vars.)

3. **Push** the repo to GitHub.

4. **Netlify** — *Add new site → Import from Git*. Netlify detects Next.js and uses
   `netlify.toml` (it auto-installs `@netlify/plugin-nextjs`). Set environment
   variables under *Site settings → Environment variables*:

   | Key                 | Value                                        |
   | ------------------- | -------------------------------------------- |
   | `DATABASE_URL`      | Supabase transaction pooler (6543, pgbouncer) |
   | `DIRECT_URL`        | Supabase session pooler (5432, no pgbouncer)  |
   | `SESSION_SECRET`    | `openssl rand -hex 32`                       |
   | `NEXT_PUBLIC_APP_URL` | `https://<your-site>.netlify.app`          |

   Deploy. The build runs `prisma generate && prisma migrate deploy && next build`,
   so schema changes ship with the deploy.

5. **First run** — log in as `zahirsnyder@gmail.com`, change the password, confirm
   `/invite/zahir-nisa` renders. If you set a custom domain, update
   `NEXT_PUBLIC_APP_URL` and redeploy.

## Environment Variables

See `.env.example`. Required: `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET`,
`NEXT_PUBLIC_APP_URL`.

## Roadmap

- Real payments (Stripe / ToyyibPay) replacing the instant claim
- Per-template file uploads and richer motion polish
- File uploads (UploadThing / S3) instead of pasted image URLs
- Guest management with unique invite links and CSV import
- Admin panel and advanced analytics
