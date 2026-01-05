# ALL8 Webworks

ALL8 Webworks is a high-performance, production-ready web platform built to showcase modern full-stack development practices for service-based businesses.

The project demonstrates my ability to design, build, secure, and deploy fast, SEO-focused web applications with real-world infrastructure, integrations, and operational concerns in mind.

---

## Tech Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- HeroUI

**Backend / Server**
- Next.js Server Actions
- Node.js
- Zod (schema validation)

**Infrastructure**
- DigitalOcean (Droplet)
- Nginx (reverse proxy)
- PM2 (process management)
- Cloudflare (DNS, firewall, edge protection)

**Data & Integrations**
- Sanity Studio (CMS)
- Upstash (rate limiting)
- HubSpot (CRM integration)
- Google Sheets (lead capture)
- Bravio (transactional email)
- CAPTCHA verification

---

## Key Features

- Fast, mobile-first UI with a focus on Core Web Vitals
- Reusable component and layout system
- Dynamic service pages driven by structured content
- Automated SEO metadata and structured data
- Optimized image delivery
- Blog system with performance-focused layouts
- Secure server-side contact and intake forms
- Analytics and event tracking

---

## Secure Intake & Form Handling

ALL8 includes a hardened server-side intake pipeline designed for real-world production use:

- Schema-validated server actions
- Honeypot-based bot detection
- Server-side CAPTCHA verification
- Rate limiting to prevent abuse
- Asynchronous background processing for integrations
- Clean separation between user response and third-party services

This ensures fast user feedback while safely handling CRM, email, and data exports in the background.

---

## Security & Production Setup

- Cloudflare in front of production infrastructure
- Server access restricted to Cloudflare IPs
- Nginx reverse proxy with HTTPS
- Environment-based configuration
- No client-side secrets

---

### Design System

- Blueprint-inspired UI with technical, structured layouts
- Typography: Orbitron (display), DM Sans (body)
- Brand color system:
  - Primary blue: #0047BB
  - Accent blue: #0076FF
  - Danger: #D00000
  - Warning: #D33F49
  - Neutrals: #0B0F1A, #1C1C1C, #BFBFBF
- Semantic theming via HeroUI (light and dark modes)
- Token-driven colors and spacing for consistency


## Project Structure

app/ → Next.js App Router (routes, layouts, pages)
app/(site)/ → Public-facing site routes
actions/ → Server actions (form handling, integrations)
api/ → API routes (internal + external integrations)
studio/ → Sanity Studio configuration
config/ → Application and environment configuration
data/ → Static and structured content sources
hooks/ → Reusable React hooks
lib/ → Utilities, validation, rate limiting, SEO helpers
public/ → Static assets (images, icons, fonts)
schemas/ → Zod schemas for validation and type safety
styles/ → Global styles and Tailwind configuration
types/ → Shared TypeScript types

---

## Form Intake & Server Actions

The project uses **Next.js Server Actions** for secure form handling and business logic.

Key characteristics:
- Schema validation using Zod
- Honeypot detection for bots
- Server-side CAPTCHA verification
- Rate limiting to prevent abuse
- Fire-and-forget background tasks for integrations

This design ensures:
- Fast user responses
- No client-side secrets
- Safe handling of third-party services

---

## Integrations & Background Processing

Form submissions trigger asynchronous background tasks that may include:

- CRM submission (HubSpot)
- Data export (Google Sheets)
- Transactional email delivery (Bravio)
- Analytics and event tracking

All integrations are handled server-side and isolated from the user response path.

---

## Security & Production Architecture

- Cloudflare sits in front of production infrastructure
- Server access restricted to Cloudflare IP ranges
- HTTPS termination via Nginx
- Environment-based configuration
- No secrets exposed to the client

This setup reflects a real-world production deployment rather than a demo environment.

---

## Development

npm install
npm run dev
npm run build
npm start

---

## Deployment
Configured for:
- DigitalOcean Droplet  
- Nginx reverse proxy  
- PM2 process manager  

## License
Proprietary project.
Source available for evaluation and portfolio review.
