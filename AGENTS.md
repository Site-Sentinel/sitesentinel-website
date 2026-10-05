# AGENTS.md

**This file is the primary ruleset for any AI assistant working in this repository.**
ChatGPT, Codex, Claude, Copilot: all of them. Read it fully before changing anything.

If you are Claude Code, also read `CLAUDE.md`, but treat it as a small set of
Claude-specific notes layered on top of this file. This file wins on every conflict.

> **This repository is currently PUBLIC on GitHub.** Anyone on the internet can read
> every file and every commit. Read rule 2.6 before you commit anything.

---

## 1. What this repository is

The public marketing website for **Site Sentinel** (https://www.sitesentinel.com.au),
an access control and contractor management company for construction, mining,
infrastructure and industrial projects.

It is a **static website**. It has no database, no user accounts, no server, and no
secrets. It is built by Astro into plain HTML and served by Netlify. The repository
itself is public (see rule 2.6).

The actual Site Sentinel product (the thing customers log into) is a **separate Rails
application** in a different repository. It is not here and must not be added here.

### Who maintains this

The primary maintainer is **not a software engineer**. They will mostly operate this
repository by asking an AI assistant to make changes. That fact shapes every rule below.

Your job is therefore not only to make the change asked for. It is to leave the
repository in a state where the next person cannot easily break it, and where a mistake
is caught by a machine rather than discovered by a customer.

---

## 2. The rules that are not negotiable

### 2.1 Never use em dashes or en dashes

The characters `U+2014` and `U+2013` are banned everywhere in this repository:
code, comments, commit messages, documentation and above all website copy.

Use a colon, a comma, a full stop, or brackets instead. Restructure the sentence if none
of those fit. A plain hyphen `-` is fine.

This is enforced by `tools/check-dashes.mjs` and the build will fail. Do not attempt to
weaken, skip or work around that check. Large language models produce these characters
constantly, which is precisely why it is a hard gate.

### 2.2 Never edit copy inside a component

All words that appear on the website live in **`src/content/homepage.ts`**.

If someone asks you to change a heading, a button label, a paragraph or a list of
features, you edit that file and nothing else. If you find yourself typing English prose
into a `.astro` file, stop: you are doing it wrong.

### 2.3 Never inline a colour

Every colour is a token defined in the `@theme` block of `src/styles/global.css`.

Do not write `text-[#0b2a4a]`, `bg-blue-600`, `style="color: navy"` or any other literal
colour. Use the token classes: `bg-navy`, `text-cyan`, `border-hairline` and so on.

If a design genuinely needs a colour that does not exist, add it to `@theme` with a name
and a comment explaining where it is used. Do not smuggle it into a component.

**Magenta is reserved for primary calls to action.** It is the loudest colour on the page
and it stops working the moment it becomes decorative. At most one magenta button per
section.

### 2.4 Never run the checks with a bypass

`pnpm check` must pass before you say you are finished. Do not use `--no-verify`, do not
comment out a rule, do not add a file to an ignore list to make an error go away, and do
not disable a lint rule without a comment explaining why on the line above.

If a check fails, the check is almost always right.

### 2.5 Never add a dependency without being asked

Every package added is a package the maintainer now has to keep updated and secure. This
site is deliberately plain: no React, no client framework, no animation library, no UI
kit. Astro plus Tailwind is the whole stack.

If you believe a dependency is genuinely required, say so and explain the tradeoff first.
Do not install it and mention it afterwards.

### 2.6 This repository is public: never commit anything private

The GitHub repository is public so that Netlify can deploy it. Everything committed can
be read by anyone, forever. Deleting a file in a later commit does not remove it: it is
still in the history, and it may already have been copied.

Never commit any of the following:

- Passwords, API keys, tokens, `.env` files, or credentials of any kind.
- Pricing, quotes, invoices, rates, or anything about what the work costs.
- Customer or contractor data, or screenshots of the live product that show real
  people, real sites or real records.
- Internal conversations, meeting notes, draft plans, links to private chats or
  shared documents, or personal names beyond what the public website already shows.
- Details of the Rails application's internals, infrastructure or security setup.

Private material goes in **`docs/private/`**, which is gitignored. Never commit it, never
force-add it with `git add -f`, and never remove it from `.gitignore`.

If you are unsure whether something is private, treat it as private and ask. If you
discover something private has already been committed, stop and tell the maintainer
immediately rather than trying to fix it quietly: a secret that reached GitHub must be
rotated, not just deleted.

---

## 3. How to make the most common changes

### Change wording on the page

Edit `src/content/homepage.ts`. Run `pnpm check:content` for quick feedback, then
follow the full checks and preview workflow below before publishing.

The content is validated as you build: text that is too long, a missing image
description, a forbidden character or an unknown icon all stop the build with a message
naming the exact field. A failed build is safe. A broken live site is not.

### Change or add an icon

Icons are named as strings in `src/content/homepage.ts`. Browse the real names at
https://lucide.dev/icons. Write them in PascalCase here: the site `shield-check` becomes
`ShieldCheck`. An unknown name fails `pnpm check:content` with a clear message.

### Add a photograph

Drop the file into `public/images/` at the path the content file names, then the grey
placeholder disappears by itself. Run `pnpm check:content` to list every image still
missing.

Use `.jpg` for photographs, `.svg` for logos, `.png` only when transparency is needed.
Keep photographs under about 400KB: resize before committing, do not commit a 5MB
camera original.

Every image needs real alt text describing what is in it, for screen readers and for
search engines. "image" or "photo" is not alt text and the schema will reject it.

### Add a whole new section to the homepage

1. Add its content to `src/content/homepage.ts` and its shape to `src/content/schema.ts`.
2. Create `src/components/sections/YourSection.astro`, composing the existing primitives
   from `src/components/ui/`. Do not hand-roll padding, headings or buttons.
3. Add it to `src/pages/index.astro` in the correct narrative position (see section 5).
4. Run `pnpm check`.

### Add a new page

Create `src/pages/your-page.astro`, wrap the content in `<Layout>`, and give the layout a
`title` and `description`. Put its content in a new file under `src/content/`, validated
by a schema, exactly like the homepage.

---

## 4. Project structure

```
src/
  content/
    schema.ts          The rules every piece of content must satisfy
    homepage.ts        ALL homepage copy. Edit this to change words.
  components/
    ui/                Primitives. Reused everywhere. Change with care.
      Button.astro       Three variants, no more
      Section.astro      Owns vertical rhythm and background tone
      SectionHeading.astro
      FeatureCard.astro
      Icon.astro         Resolves a Lucide icon from a string name
      Figure.astro       Image that degrades to a labelled placeholder
      Chip.astro, Eyebrow.astro, Logo.astro, Signature.astro,
      DiagonalSlash.astro, Placeholder.astro
    sections/          One file per homepage section, in page order
    Nav.astro          Fixed header, transparent over the hero
    Footer.astro
  layouts/
    Layout.astro       The HTML document: meta tags, fonts, structured data
  pages/
    index.astro        The homepage: composes the sections in order
    404.astro
  styles/
    global.css         Design tokens. The only place colours are defined.
tools/
  check-dashes.mjs     Bans em and en dashes
  check-content.ts     Validates content, icons and images
docs/
  homepage-brief-v1.md The approved copy and design brief. The source of truth.
  reference/           The capability statement PDF.
  private/             Gitignored. Private notes and mockups. Never commit, never force-add.
public/
  images/              Photographs and logos
```

---

## 5. The narrative order of the homepage

The section order is an argument, not a list. It runs:

> We secure the physical entrance. > We manage the people. > We manage it in the cloud. >
> We connect your existing systems. > We automate access decisions. > We can deploy almost
> anywhere. > We deliver the project outcome. > Expectations. Delivered.

Concretely: Hero, Trust, Pillars, Platform, Flagship, Intelligent Access, Integrations,
Breath Testing, Autonomous, Outcomes, Industries, Final CTA.

The Platform section exists specifically so a reader does not file Site Sentinel as a
turnstile supplier. Do not move it later or drop it.

Reordering these sections breaks the argument. If asked to reorder, say what the change
costs before doing it.

---

## 6. Design tokens

Defined in the `@theme` block of `src/styles/global.css`, sourced from the capability
statement in `docs/reference/`.

| Token                                                             | Use                                                             |
| ----------------------------------------------------------------- | --------------------------------------------------------------- |
| `navy`, `navy-deep`, `navy-soft`                                  | The anchor colour. Hero scrim, platform, outcomes, CTA, footer. |
| `cyan`, `cyan-soft`                                               | Second headline line, icon circles, arrows, small accents.      |
| `brand-blue`, `brand-blue-dark`                                   | Secondary buttons, icon fills, links.                           |
| `magenta`, `magenta-dark`                                         | Primary calls to action ONLY. Never decorative.                 |
| `brand-green`                                                     | Sustainability and autonomous sections only.                    |
| `surface`, `surface-soft`, `surface-muted`                        | Backgrounds. `soft` is the alternating band.                    |
| `ink`, `ink-soft`, `ink-muted`, `ink-on-dark`, `ink-on-dark-soft` | Text.                                                           |
| `hairline`, `hairline-dark`                                       | Borders.                                                        |

Three type utilities carry the whole page: `eyebrow`, `display` and `display-sm`. Use
them rather than picking font sizes per section, or the page loses its rhythm.

Sections alternate white and `surface-soft`, punctuated by full navy bands. That rhythm is
deliberate. Two navy sections in a row, or four white ones, both read as a mistake.

---

## 7. Domains, and why they matter here

| Host                      | Serves                          | Status               |
| ------------------------- | ------------------------------- | -------------------- |
| `www.sitesentinel.com.au` | This Astro site on Netlify      | The target           |
| `app.sitesentinel.com.au` | The Rails application on Heroku | Being migrated to    |
| `sitesentinel.com.au`     | Currently the Rails application | Will redirect to www |

The Rails application is moving from `www` to `app` so that `www` can point at Netlify.
Until every mobile app and turnstile client has been migrated to `app`, both hosts must
keep working.

`netlify.toml` already forwards `/users/*`, `/admin/*` and `/api/*` to the `app`
subdomain. As more application paths are discovered, add them there. Do not add a
catch-all proxy: that would silently swallow genuine 404s on this site.

---

## 8. Commands

```bash
pnpm install        # once, and after any dependency change
pnpm dev            # local site at http://localhost:4330
pnpm build          # production build into dist/
pnpm preview        # serve the production build locally

pnpm check          # EVERYTHING. Run this before you finish.
pnpm check:content  # content, icons and image validation
pnpm check:dashes   # the em dash ban
pnpm check:types    # astro check, TypeScript in strict mode
pnpm check:lint     # eslint
pnpm check:format   # prettier, check only

pnpm fix            # auto-format and auto-fix what can be fixed
```

Node version is pinned in `.node-version`. Use it. The build will not run on an older Node.

---

## 9. Definition of done

### Coding setup and context

The recommended maintainer setup is desktop Codex with a local Git checkout of
this marketing repository, opened as the primary project folder, with This computer /
Local selected. Run `pnpm dev` for local review and push feature branches to GitHub
for Netlify previews. No Cloud environment is required. A separate ChatGPT Project is optional for discussion and
references. Do not assume its instructions, sources or chat history are available
to a separately started coding task. Ask for the agreed brief or missing references
when needed, and use current repository files for durable guidance.

The assistant must establish repository access and the available coding tools
before promising edits, checks or publication. Cloud, Local and Remote are execution
options, not interchangeable consequences of connecting the GitHub plugin.

### Branch, preview, approval, production

Every website change follows this path, including small wording changes:

1. Fetch `origin` and start from current `origin/main` on a descriptive feature branch. Never commit or push
   website changes directly to `main`. Preserve any existing uncommitted work.
2. Make only the requested changes. Run `pnpm dev` for local review, give the
   maintainer the actual URL (normally http://localhost:4330), and run `pnpm check`
   and `pnpm build`. Inspect the result at desktop and phone widths. Reuse an
   existing server only after confirming it serves this checkout; do not terminate
   unrelated processes to free the port. Localhost is not a shareable preview link.
3. Commit the changes, push the branch to GitHub, and open a pull request targeting
   `main`. This asks Netlify to build a Deploy Preview; it does not publish production.
4. Wait for GitHub's Checks and Architectural rules jobs and the Netlify preview
   to succeed. Fix failures on the same branch and push again.
5. Give the maintainer the pull request and actual preview links, explain what
   changed, and invite them to review the preview on desktop and phone.
6. Stop at the preview until the maintainer explicitly approves publishing that
   version. A request to make a change is not permission to merge it. Further
   changes after approval need another preview review and approval.
7. After approval, merge the pull request into `main`. Netlify then builds and
   publishes the production deployment, provided its Git integration is configured.
8. Verify the production deploy succeeded for the merged commit and inspect the
   deployed site. Report the production URL and any remaining limitations.

Do not claim that a pushed branch is a preview, or that a merge is a successful
deployment. Verify each stage. If a tool cannot edit, run checks, push, open a pull
request or inspect a deployment, explain the limitation and guide the maintainer
through the missing step. Never imply that an action happened when it did not.

The visual guide is [docs/how-deploys-work.html](docs/how-deploys-work.html).
Open it in a browser. The setup guide is
[docs/getting-started.md](docs/getting-started.md).

GitHub branch protection and Netlify configuration are external settings. Do not
assume these rules are enforced by the platforms just because they are written here.

### Verification

Before you tell the maintainer a change is finished, all of these must be true:

1. `pnpm check` passes with no errors.
2. `pnpm build` completes.
3. You have actually looked at the page, at desktop AND at phone width. A change that
   only works on a laptop is not finished. The mobile breakpoint is where section layouts
   most often break.
4. Copy changes went into `src/content/`, not into a component.
5. You have said plainly what you changed, and named anything you could not finish.

Do not report success on work you have not verified. If you could not run the checks, say
so rather than assuming.

Before approval, describe the result as "ready for preview review", not published.
Only report it as live after the production verification above.

---

## 10. Working with a non-technical maintainer

- **Explain in plain language.** Say "the page will not build because the button label is
  too long" rather than pasting a stack trace.
- **Never silently change scope.** If you were asked to change a heading, change the
  heading. Do not also restructure the section because you thought it would be better.
  Suggest it separately.
- **When a check fails, read it out and fix the cause.** The error messages in this repo
  are written to be understood. Do not disable the check.
- **If you are unsure whether something is a design decision or an accident, ask.**
  Several things that look odd here are deliberate and documented above.
- **Say when you are guessing.** Especially about brand colours, client logo usage, or
  anything a customer will see.
