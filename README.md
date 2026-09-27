# Customs Wise website

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Node.js runtime.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | Type check (works on a fresh clone, before any build) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |

Requires Node.js 20.9 or later.

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical origin for metadata, sitemap and schema. Defaults to `https://www.customswise.ie`. |
| `ENQUIRY_WEBHOOK_URL` | **Yes, to receive enquiries** | Enquiries are POSTed here as JSON. Point it at your email service, CRM, automation tool (Zapier/Make) or an internal API. Without it, the form tells visitors online enquiries aren't connected yet and shows the phone number and email. Nothing is sent or stored. |
| `NEWSLETTER_WEBHOOK_URL` | **Yes, to collect sign-ups** | Newsletter sign-ups are POSTed here as `{ type, receivedAt, email, source }`, e.g. to your mailing-list provider. Without it, the form says sign-up isn't open yet. The website never claims a subscription that didn't happen. |
| `NEWSLETTER_WEBHOOK_SECRET` | Optional | Bearer token for the newsletter webhook. |
| `ENQUIRY_WEBHOOK_SECRET` | Optional | Sent as `Authorization: Bearer <secret>` so the receiver can verify requests. |
| `CONTACT_EMAIL` | Optional | Recipient address included in the payload. |

Webhook payload:

```json
{
  "type": "website_enquiry",
  "receivedAt": "2026-09-25T10:00:00.000Z",
  "to": "info@customswise.ie",
  "enquiry": { "name": "", "company": null, "email": "", "phone": null, "service": "food", "serviceLabel": "", "message": "" }
}
```

## Site features

- **Header scroll behaviour:** hides when scrolling down (slides out with `translateY(-100%)`), reappears when scrolling up, and is always visible at the top of the page. It never hides while the mobile menu is open. No background or shadow is added. One passive, frame-throttled scroll listener in `components/navigation/navbar.tsx`. **Readability option:** the header is transparent with white text, so when it reappears mid-page over light sections its text has low contrast. Set `SOLID_WHEN_REVEALED_MID_PAGE = true` in that file to give it the brand Overnight background only when shown below the top (off by default, per the approved spec).
- **Header:** Home, About, Services, Food Customs, Industries, Insights, then **Call Us** (`tel:` link to the verified number; full button from 1280px, compact icon at 1024–1279px and on mobile) and **Get an Enquiry** (`/contact#enquiry`).
- **Footer:** official brand icons for X, YouTube, Facebook and LinkedIn (`components/icons/social-icons.tsx`), URLs in `lib/site.ts` (`site.social`).
- **Quick contact button** (`components/layout/quick-contact.tsx`): fixed bottom-right, opens a panel with Get an Enquiry, Call Us, Email Us and Contact Us. It fades out of the way whenever a button, link or form field sits underneath it, and is always shown when keyboard-focused.
- **Newsletter** (`components/sections/newsletter-section.tsx`): on the homepage and Insights page.
- **Insights:** articles are grouped by category (`insightCategories` in `lib/content/index.ts`). To publish an article, add its page under `app/` and an entry to the relevant list.
- **Motion:** subtle trade-route background (pure SVG/CSS), short page entrance (`app/template.tsx`), scroll reveals (`components/layout/reveal-observer.tsx`). All static with `prefers-reduced-motion`; content is fully visible without JavaScript.

## Enquiry security

- Zod schema shared by client (instant feedback) and server action (authoritative): `lib/validation/enquiry.ts`.
- Server action `lib/enquiry/actions.ts` re-validates, applies a honeypot and rate-limits to 5 enquiries per 10 minutes per client IP.
- The rate limiter is in-memory and per instance, and keys on `x-forwarded-for`. Deploy behind a proxy/CDN that sets this header (Vercel, Netlify, Cloudflare, nginx). On multi-instance or serverless hosting, replace it with a shared store or platform WAF rules.
- Delivery code is guarded with `server-only`; no secrets reach the browser.

## Project structure

```
app/                  Routes (App Router), metadata files (sitemap, robots, manifest, icons), fonts
components/
  content/            Long-form guides (POAO, CATCH, fresh produce, CBAM, EUDR, Incoterms)
  footer/ navigation/ Site chrome
  forms/              Enquiry form (React Hook Form + Zod)
  layout/             Breadcrumbs, article layout
  sections/           Page sections (hero, cards, FAQ, process, CTA…)
  ui/ icons/          Primitives: Button (cva), Accordion (Radix), Logo, JSON-LD, brand icons
lib/
  site.ts             Verified business facts, offices, hours, navigation
  content/            Services, industries, guides, FAQs, image registry
  seo/ structured-data/ validation/ enquiry/ utils/
public/               images/, logos/, icons/, opengraph-image.png
```

## Design system

Brand tokens live in `app/globals.css` (`@theme`). Tailwind's default palette is removed, so only Customs Wise colours exist:
Overnight `#000315`, Ship `#0A3542`, Sea Breeze `#4A6876`, Atlantic `#176A90`, Cargo `#F9ED32`, Freight `#F79420`, Haul `#FBB03A`, Holyhead `#2EACB1`, Transit `#3EB661`, Starlight `#BDCCD4`, Pebble `#747576`, Salt `#FFFFFF`. The CLEARANCE gradient (135°) is `.bg-clearance`.

### Typography: action needed
The brand guide specifies **Gobold / Gobold Thin**, but no Gobold font file exists in the supplied brand assets. **Oswald** (SIL OFL, self-hosted in `app/fonts/`) is used as the closest condensed stand-in. To switch once a Gobold web licence is obtained, add the `.woff2` to `app/fonts/` and change the one `localFont` declaration for the display face in `app/layout.tsx`.

### UI primitives
Components follow the shadcn/ui pattern (Radix primitives + `cva` + `cn`) and were authored directly, as the shadcn CLI registry could not be reached from the build environment. They are fully restyled to the brand.

## Content still to supply
- Port Fees and BCP Inspections insight articles (drafts not yet written)
- Forestry/Horticulture industry copy
- Team photos; higher-resolution service photography (several supplied photos are under 600px wide)
- Blog posts (the Insights index is ready to receive them)
