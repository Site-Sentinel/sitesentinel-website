# Site Sentinel website

The public marketing site for [Site Sentinel](https://www.sitesentinel.com.au).

Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com),
deployed to Netlify as static HTML.

**Start here:** [Local Codex setup and your first change](docs/getting-started.md).
For the visual workflow, download [docs/how-deploys-work.html](docs/how-deploys-work.html)
and open it in a browser. It explains branches, previews, approval and publishing.

Clone this repository, open its folder in desktop Codex, and choose **This computer / Local**.
Run `pnpm dev` to review changes at http://localhost:4330. Push a feature branch
and open a pull request for a shareable Netlify preview before approving production.
The [setup guide](docs/getting-started.md) covers installation, sign-in and each step.
Use [GitHub Desktop](https://desktop.github.com/) on Windows or macOS to clone,
review and push branches through a visual interface.

## Quick start

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The site is then at http://localhost:4330.

## I just want to change some words

Open `src/content/homepage.ts`. Every word on the homepage is in that file.

Save it, and the page in your local browser updates. Work on a branch, then follow
the deployment workflow below to get a preview before publishing.

You do not need to touch anything in `src/components/`.

## Product screenshots

Use editable HTML/CSS with fictional data, captured through Chrome browser control.
Do not use imagegen for product screenshots or commit real customer records.
The [Platform dashboard source](docs/platform-dashboard-mockup.html) can be viewed
by running `node tools/serve-dashboard-mockup.mjs` and opening the printed URL.
Capture it at 1200 x 960 and save a new JPG filename under `public/images/`.
Update its reference and alt text in `src/content/homepage.ts`.

## Before you commit

```bash
pnpm check
```

This checks the content, the types, the formatting and the house style rules. If
it fails it tells you exactly what is wrong and where. Also run `pnpm build`.
Passing checks means the change is ready for the next review step, not deployed.

`pnpm fix` will fix formatting problems automatically.

## Working with an AI assistant

Point it at **`AGENTS.md`**. That file is the full ruleset for this repository:
what may and may not be changed, where things live, and how to verify work. It
is written for ChatGPT, Codex, Claude and anything else.

Use desktop Codex with a local checkout of this repository and **This computer / Local**
selected. Keep instructions here in `AGENTS.md`. A separate ChatGPT Project is
optional for discussion; explicitly supply its agreed brief to the coding chat.
Use browser control through the ChatGPT Chrome plugin/integration for page checks.
Playwright is prohibited. If Chrome is not connected, the assistant must ask you
to enable or connect it. The [setup guide](docs/getting-started.md) explains the steps.

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
checks that run locally plus architectural guardrails, when the integrations are enabled.

1. Fetch the latest `origin/main`, create a feature branch and make the requested change.
   Preserve any existing uncommitted work.
2. Use `pnpm dev` for local review. Run `pnpm check` and `pnpm build`, and inspect
   desktop and phone layouts.
3. Commit, push the branch to GitHub, and open a pull request into `main`.
4. Wait for successful GitHub checks and a Netlify Deploy Preview.
5. Open the preview link and review it. Request corrections on the same branch.
6. Explicitly approve publishing the reviewed version, then merge the pull request.
7. Wait for Netlify's production deployment and verify the deployed page.

Never push website changes directly to `main`. A request to change something does
not authorise publishing it. The assistant must provide a preview for approval first.

An administrator should protect `main` against direct pushes and require successful
Checks, Architectural rules and the Netlify preview check before merging. Verify
that Netlify uses `main` for production and has Deploy Previews enabled. These are
GitHub and Netlify settings; this repository cannot confirm they are enabled.

The [HTML diagram](docs/how-deploys-work.html) shows the same workflow. It is
documentation only and is not included in the published website.
