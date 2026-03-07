# ALL8 Webworks

ALL8 Webworks is a production-grade, SEO-focused web platform for contractor and service businesses.

This project was intentionally built to demonstrate **real full-stack engineering competency**: performance-first frontend architecture, secure server-side workflows, typed content pipelines, and reliable third-party integrations that mirror real business operations.

---

## Why this project matters (for employers)

This codebase showcases practical experience with:

- Building and scaling a modern **Next.js App Router** architecture
- Designing a reusable, component-driven **frontend system**
- Implementing **secure lead-intake pipelines** with abuse protection
- Managing **content at scale** using hybrid static JSON + headless CMS
- Integrating external systems (HubSpot, Google Sheets, email providers)
- Shipping with production concerns in mind (SEO, analytics, reliability, deployment)

---

## Tech Stack

### Frontend

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- HeroUI

### Backend / Server

- Next.js Server Actions
- Next.js Route Handlers (`app/api/*`)
- Node.js runtime
- Zod for runtime schema validation

### Data & Integrations

- Sanity Studio (headless CMS for blog/editorial content)
- Upstash Redis (rate limiting)
- HubSpot (forms + CRM sync)
- Google Sheets API (lead export)
- Brevo / SMTP email pipeline
- Google reCAPTCHA verification

### Infrastructure / Ops

- DigitalOcean Droplet
- Nginx reverse proxy
- PM2 process management
- Cloudflare DNS + WAF/edge protection

---

## Architecture Overview

The application follows a layered architecture with clear responsibilities:

1. **Presentation Layer (UI + Routes)**  
   `app/` and `app/(site)/` hold route entry points, layouts, and page compositions.

2. **Domain + Application Layer (server workflows)**  
   `app/actions/` and `lib/leads/` orchestrate intake and lead-processing logic.

3. **Content Layer (typed content sources)**  
   `data/` stores structured JSON, validated through Zod schemas in `schemas/`.

4. **Integration Layer (external services)**  
   `lib/integrations/*` connects HubSpot, Google APIs, and email providers.

5. **Platform Layer (SEO, metadata, config, env)**  
   `lib/utils/`, `config/`, and framework metadata routes (`sitemap.ts`, `robots.ts`) manage discoverability and runtime configuration.

---

## Runtime Architecture (request flow)

### Public page request

1. Request hits Next.js route in `app/(site)/*`
2. Shared shell from `app/layout.tsx` applies:
   - global metadata defaults
   - consent bootstrap + GTM
   - provider wrappers (theme/UI)
   - global nav/footer and structured data scripts
3. Page-level data is sourced from:
   - typed static JSON loaders, and/or
   - Sanity queries (blog)
4. Next.js returns optimized HTML + hydration bundles

### Lead form submission

1. Form submits to a **Server Action** (`app/actions/*`)
2. Payload is validated with Zod
3. Security controls run:
   - honeypot check
   - IP rate limiting
   - server-side CAPTCHA verification
4. User gets immediate response
5. Background tasks run asynchronously:
   - HubSpot form submit
   - transactional email
   - Google Sheets append (dedupe guard)
   - HubSpot CRM enrichment (contact/deal/note/task)

This pattern keeps UX fast while isolating third-party latency/failures from the main response path.

---

## Project Structure

```txt
app/
  layout.tsx                 # Global app shell, SEO defaults, providers, GTM
  sitemap.ts                 # Dynamic sitemap (static pages + services + blog)
  robots.ts                  # Robots policy
  (site)/                    # Public website routes and reusable section components
  actions/                   # Server Actions (form handlers)
  api/                       # Route handlers for integration/auth callbacks
  studio/                    # Embedded Sanity Studio

config/                      # Site + environment-aware configuration

data/                        # Structured content (services, pages, brand, schema)
lib/
  intake/                    # CAPTCHA + rate-limit guards + intake schema
  leads/                     # Lead pipeline orchestration
  integrations/              # HubSpot, Google, and provider adapters
  utils/                     # Metadata, SEO helpers, safety utilities

schemas/                     # Zod schemas for typed runtime validation
styles/                      # Global/theme/animation styles
hooks/                       # Reusable frontend hooks
public/                      # Static assets
types/                       # Shared TypeScript declarations
```

---

## Content Architecture

The content model is intentionally hybrid:

- **Static JSON** powers marketing/service content that benefits from version control and code review.
- **Sanity CMS** powers editorial/blog workflows requiring non-developer authoring.
- **Zod schemas** validate static content at runtime to prevent invalid deployments.

Benefits:

- Fast build-time and runtime performance for core marketing pages
- Flexible editorial workflow for blog operations
- Strong type safety + guardrails against malformed content

---

## SEO & Discoverability Architecture

SEO is treated as a first-class concern:

- Shared global metadata and social defaults in root layout
- Route-level metadata for services/blog entries
- Canonical URL generation via environment-aware site configuration
- Structured data (JSON-LD) for organization + website entities
- Dynamic sitemap generation across static pages, services, and CMS posts
- Explicit robots rules to block non-indexable/internal paths

---

## Security & Reliability Design

### Security controls

- No client-exposed secrets
- Server-side validation for all critical intake payloads
- Honeypot bot filtering
- Server-side reCAPTCHA verification
- Multi-window IP rate limiting using Upstash Redis
- Environment validation and strict config boundaries

### Reliability patterns

- Asynchronous background processing for integrations
- Error isolation per integration step
- Partial-failure tolerance (one provider failure does not break all processing)
- Defensive metadata/content fallbacks for production resilience

---

## Deployment Topology

Production deployment is designed around common SMB SaaS patterns:

- Cloudflare in front of origin (DNS + security edge)
- Nginx reverse proxy for HTTPS routing
- PM2 for process supervision
- Next.js app running on a DigitalOcean droplet

This reflects practical deployment and operations knowledge beyond local development.

---

## Local Development

```bash
npm install
npm run dev
```

Build and run production mode locally:

```bash
npm run build
npm start
```

Lint:

```bash
npm run lint
```

---

## License

Proprietary portfolio project.  
Source is shared for evaluation and technical review.
