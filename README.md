# TWIST

Premium Arabic RTL storefront for custom embroidery and print on apparel.

متجر عربي (RTL) لبراند **TWIST** — تطريز وطباعة على الملابس.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Auth, Postgres, Storage)

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin).

Without Supabase credentials the storefront still renders a **demo catalog** (products, categories, gallery, hero, testimonials). Writes (orders, contact, uploads, admin edits) need a real Supabase project.

## Environment

Copy `.env.example` to `.env.local`. Never commit `.env.local`.

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_WHATSAPP_NUMBER=962790000000
NEXT_PUBLIC_CURRENCY=₪
```

WhatsApp number is international digits only (no `+`). It can later be changed from **إعدادات الموقع** in admin.

Use the **anon** key only. Do not put the service role key in this app.

## Supabase

### Cloud (recommended without Docker)

1. Create a project at [supabase.com](https://supabase.com).
2. Fill `.env.local` from Project Settings → API (URL + anon key).
3. Run SQL in the dashboard **SQL Editor** in this order (or `npx supabase db push` after `npx supabase link`):

| File | Purpose |
| --- | --- |
| `supabase/migrations/0001_init.sql` | Tables, RLS, storage buckets `products` / `gallery` / `designs` |
| `supabase/migrations/0002_seed.sql` | Demo categories and products |
| `supabase/migrations/0003_designs.sql` | Designs (needed if `0001` was applied before this existed) |
| `supabase/migrations/0004_cms.sql` | Site settings, hero slides, testimonials, featured products, `hero` bucket |
| `supabase/migrations/0005_category_images.sql` | Category cover photos (`image_url`) for homepage cards |

4. Authentication → Users → Add user (admin email + password).
5. Grant admin access:

```sql
insert into public.admins (email) values ('your-admin@email.com');
```

Without a row in `admins`, a signed-in user still cannot open the admin panel.

6. Restart `npm run dev` after changing `.env.local`.

### Local (Docker Desktop)

```bash
npx supabase start
```

Copy **API URL** and **anon key** from the CLI output into `.env.local` (usually `http://127.0.0.1:54321`). Migrations apply on start.

```bash
npx supabase db reset   # migrations + seed
```

Then add an Auth user in local Studio and insert that email into `public.admins`.

## Store routes

`/` · `/products` · `/products/[id]` · `/cart` · `/wishlist` · `/checkout` · `/about` · `/contact`

## Admin

Auth is Supabase Auth. `proxy.ts` (Next.js 16 replacement for `middleware.ts`) sends unauthenticated `/admin/*` visits to login.

| Path | Role |
| --- | --- |
| `/admin/login` | Sign in |
| `/admin/dashboard` | Overview |
| `/admin/homepage` | Hero slides + home copy + featured products |
| `/admin/products` | Catalog CRUD |
| `/admin/categories` | Categories |
| `/admin/orders` | Orders and status |
| `/admin/gallery` | Work gallery |
| `/admin/testimonials` | Reviews |
| `/admin/about` | About page content |
| `/admin/messages` | Contact inbox |
| `/admin/settings` | Store name, logo, WhatsApp, phone, address, social |

CMS tables live in `0004_cms.sql`: `site_settings`, `hero_slides`, `testimonials`, `products.is_featured`, `categories.icon`, and the `hero` storage bucket.
