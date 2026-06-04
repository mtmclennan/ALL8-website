# AGENTS.md

## Project

ALL8 Webworks is a Next.js App Router + TypeScript website using Tailwind CSS and HeroUI-style components. The site sells web design, SEO, performance, hosting, and integration services for contractors and service businesses.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- HeroUI / NextUI-style components where used
- Sanity for blog content
- lucide-react for icons if needed

## Coding Rules

- Keep TypeScript strict.
- Avoid `any` unless there is a clear reason.
- Prefer small reusable components.
- Use server components by default.
- Use client components only when interactivity requires it.
- Keep diffs focused on the requested task.
- Do not redesign unrelated sections.
- Do not rename existing public routes unless explicitly asked.
- Preserve existing slugs and SEO URLs.

## Design Rules

- Mobile-first.
- Use clean spacing, rounded cards, strong headings, and clear CTAs.
- Keep focus states visible.
- Use semantic HTML.
- Keep one H1 per page.
- Use descriptive link text.

## SEO Rules

- Preserve canonical URLs.
- Use crawlable internal links.
- Avoid generic anchor text like "click here" or standalone "read more".
- Blog posts should link to related articles and relevant service pages.
- Service pages should link to relevant blog articles.
- Sitemap entries should use real updated dates when available.
- Do not add noindex unless explicitly requested.

## Commands

Use the actual project commands if different:

- npm run build
- npm run lint
- npm run typecheck

## Done Means

A task is complete only when:

- The requested behavior is implemented.
- The diff is focused.
- Existing routes still work.
- Build passes.
- Lint/typecheck passes if configured.
- A concise summary of changed files and reasoning is provided.
