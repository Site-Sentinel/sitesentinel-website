# CLAUDE.md

**Read `AGENTS.md` first. It is the primary ruleset for this repository and it
governs everything.**

This file contains only the notes that are specific to Claude Code and that
`AGENTS.md` does not cover. Where anything here appears to conflict with
`AGENTS.md`, `AGENTS.md` wins.

---

## Before you touch anything

Read `AGENTS.md` in full. In particular:

- Section 2, the rules that are not negotiable.
- Section 3, how to make the most common changes.
- Section 9, the definition of done.

The short version: copy lives in `src/content/homepage.ts`, colours live in
`src/styles/global.css`, no em dashes anywhere, and `pnpm check` must pass.

---

## Claude-specific notes

### Running commands

Node is pinned in `.node-version` and it is newer than the system default. If a
command fails with an engine or undici version error, you are on the wrong Node.

The package manager is pnpm. The Rails application in the sibling directory uses
yarn and declares a `packageManager` field, so running pnpm from the wrong
working directory produces a confusing corepack error. Always run from this
repository's root.

### Verifying your work

`AGENTS.md` section 9 requires that you actually look at the page before calling
a change done. You have browser tools: use them. Load the dev server and take a
screenshot at desktop width and at roughly 400px wide.

Do not skip the mobile check. This site has several full-bleed split layouts and
horizontal step flows, and those are exactly the things that break at phone
width while looking perfect on a laptop.

Use `astro preview` after a build rather than a long-running `astro dev`, which
does not survive a backgrounded shell reliably here.

### Do not invent artwork

If you need a logo, an icon set, or a brand asset, find the real one. The Site
Sentinel brand mark exists as real vector artwork and is already in this repo at
`public/images/logo-mark.svg`, copied from the SSA app repository. Other Site
Sentinel repositories under `~/dev/site-sentinel/` contain further assets, and
`docs/reference/Site_Sentinel_Capability_Statement_v2.pdf` contains the real
photography and client logos, which can be extracted with `pdfimages`.

Never hand-build an SVG approximation of a real logo and present it as the brand
mark. It will be wrong, and wrong in a way that is hard to notice and
embarrassing in front of a customer.

If no real asset exists, leave the placeholder in place and say so plainly.

### Editing this repository's documentation

`AGENTS.md` is the file that the maintainer's own AI assistant will read. If you
learn something in a session that would have saved you time, add it there, not
here. Keep this file short.

---

## Related repositories

| Path                                        | What it is                                 |
| ------------------------------------------- | ------------------------------------------ |
| `~/dev/site-sentinel/site-sentinel`         | The Rails application. Serves the product. |
| `~/dev/site-sentinel/site-sentinel-SSA-APP` | Flutter app. Source of the real logo SVG.  |
| `~/dev/site-sentinel/site-sentinel-ios`     | iOS app.                                   |
| `~/dev/site-sentinel/site-sentinel-android` | Android app.                               |
| `~/dev/tributech/owr-apps/owr-website`      | The Astro site this one is modelled on.    |

The Rails application currently serves the `www` landing page that this site
replaces. See `AGENTS.md` section 7 for how the domains move.
