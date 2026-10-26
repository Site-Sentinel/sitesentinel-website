# Site Sentinel website

The public marketing site for [Site Sentinel](https://www.sitesentinel.com.au).

Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com),
deployed to Netlify as static HTML.

**Start here:** [Cloud setup and your first change](docs/getting-started.md).
Open Codex in the ChatGPT desktop app, connect GitHub, select this repository
and request your change. Use Cloud for work without a local checkout. No local
development tools are required on your computer.

Copy [prompt.txt](prompt.txt) into your chat and add the change you want.
The assistant checks repository access and runs the required checks. Review website changes using a shareable Netlify preview.
Publishing requires your explicit approval of the current preview.

Read [how publishing works](docs/how-deploys-work.md) for the visual workflow,
including previews, approval and publishing. The diagrams render directly on GitHub.

## I just want to change some words

Start a new cloud task and describe the change. The assistant edits
`src/content/homepage.ts`, where all homepage copy lives, and opens a pull request
for a Netlify preview. Ask for corrections in the same task before publishing.

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

Select this repository and read `AGENTS.md` each time. A separate
ChatGPT Project is optional for discussion; explicitly supply its agreed brief
to the coding task. Use Chrome browser control for preview checks where available.
Playwright is prohibited. If the cloud task cannot access Chrome, the maintainer
must review the preview on desktop and phone. Record who checked it and any
remaining limitations. The [setup guide](docs/getting-started.md) explains the steps.

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
2. Run `pnpm check` and `pnpm build` in the cloud workspace.
3. Commit, push the branch to GitHub, and open a pull request into `main`.
4. Wait for successful GitHub checks and a Netlify Deploy Preview.
5. Review the preview on desktop and phone. Request corrections on the same branch.
6. Explicitly approve publishing the reviewed version, then merge the pull request.
7. Wait for Netlify's production deployment and verify the deployed page.

Never push website changes directly to `main`. A request to change something does
not authorise publishing it. The assistant must provide a preview for approval first.

An administrator should protect `main` against direct pushes and require successful
Checks, Architectural rules and the Netlify preview check before merging. Verify
that Netlify uses `main` for production and has Deploy Previews enabled. These are
GitHub and Netlify settings; this repository cannot confirm they are enabled.

The [publishing guide](docs/how-deploys-work.md) shows the same workflow. It is
documentation only and is not included in the published website.
