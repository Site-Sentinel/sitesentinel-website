# Site Sentinel website

The public marketing site for [Site Sentinel](https://www.sitesentinel.com.au).

Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com),
deployed to Netlify as static HTML.

## Quick start

```bash
pnpm install
pnpm dev
```

The site is then at http://localhost:4330.

## I just want to change some words

Open `src/content/homepage.ts`. Every word on the homepage is in that file.

Save it, and the page in your browser updates. When you are happy, commit.

You do not need to touch anything in `src/components/`.

## Before you commit

```bash
pnpm check
```

This checks the content, the types, the formatting and the house style rules. If
it fails it tells you exactly what is wrong and where. If it passes, the site
will deploy.

`pnpm fix` will fix formatting problems automatically.

## Working with an AI assistant

Point it at **`AGENTS.md`**. That file is the full ruleset for this repository:
what may and may not be changed, where things live, and how to verify work. It
is written for ChatGPT, Codex, Claude and anything else.

If you are using Claude Code, it reads `CLAUDE.md`, which defers to `AGENTS.md`.

## Commands

| Command        | What it does                                |
| -------------- | ------------------------------------------- |
| `pnpm dev`     | Local development server                    |
| `pnpm build`   | Production build into `dist/`               |
| `pnpm preview` | Serve the production build locally          |
| `pnpm check`   | Run every check. Do this before committing. |
| `pnpm fix`     | Auto-format and auto-fix what can be fixed  |

## Where things are

| Path                        | What it is                                                     |
| --------------------------- | -------------------------------------------------------------- |
| `src/content/homepage.ts`   | All homepage copy. Edit this to change words.                  |
| `src/content/schema.ts`     | The rules the copy must satisfy                                |
| `src/components/sections/`  | One file per homepage section                                  |
| `src/components/ui/`        | Shared building blocks                                         |
| `src/styles/global.css`     | Brand colours and type scale                                   |
| `public/images/`            | Photographs and logos                                          |
| `docs/homepage-brief-v1.md` | The approved copy and design brief                             |
| `docs/reference/`           | Capability statement (draft mockups are kept outside the repo) |

## Deployment

Netlify builds from `main` and publishes `dist/`. Configuration is in
`netlify.toml`.

Pull requests get a Netlify deploy preview, and GitHub Actions runs the same
checks that run locally.
