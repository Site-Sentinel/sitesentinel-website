# Start locally with desktop Codex

Use a local checkout of this repository and a **Site Sentinel Website** project
in desktop Codex. Run the development site on your computer, then push a feature
branch to GitHub for a Netlify preview. No Cloud environment is needed.

Keep the durable instructions in `AGENTS.md`, the entry points in `README.md`,
and the approved website brief in `docs/homepage-brief-v1.md`. Start one new
coding chat per change and read the current repository instructions each time.

## 1. Install the tools once

The simplest cloning and GitHub sign-in route is [GitHub Desktop](https://desktop.github.com/).
Install it and sign in with an account authorised to push to this repository.
Also install the ChatGPT desktop app and sign in to use its Codex view.

GitHub Desktop supports macOS and Windows. On Windows, use the
[Windows download](https://desktop.github.com/download/) and the native desktop
Codex setup. A Linux environment is not needed for this static website.

Install these development tools, using the versions pinned in this repository:

- **Git:** needed by Codex for branches and commits. Check `git --version` in Terminal.
  On macOS, follow the developer-tools installation prompt if Git is missing.
  On Windows, install [Git for Windows](https://git-scm.com/downloads/win) if needed
  and allow it to be used from the command line. GitHub Desktop's own Git does not
  prove that Codex's shell can find Git.
- **Node.js:** install the version in `.node-version`, currently `24.11.1`, using
  the matching installer from the [official Node.js releases](https://nodejs.org/en/download/releases).
  If a Node version manager is already installed, use it instead.
- **pnpm:** after installing Node, run `npm install --global pnpm@9.15.0` in
  Terminal. Use the version in the `packageManager` field of `package.json` if it changes.

On Windows, use Command Prompt for these commands and reopen the desktop app
after installing tools so it picks up the updated PATH. If PowerShell blocks
`npm.ps1` or `pnpm.ps1`, use Command Prompt or the `npm.cmd` / `pnpm.cmd` commands
instead of changing system execution policies.

Confirm `node --version` and `pnpm --version` match the repository. If setup fails,
share the error with the assistant and fix it before starting a website change.
This static site needs no product database or production credentials.

## 2. Clone the website repository

In GitHub Desktop, choose **File > Clone Repository > URL** and enter:

```text
https://github.com/Site-Sentinel/sitesentinel-website
```

Choose a local folder you can find again, for example
`~/dev/site-sentinel/sitesentinel-website`, then clone. Clone the marketing
repository only, not the separate product application.

On Windows, choose a folder such as `%USERPROFILE%\dev\site-sentinel\sitesentinel-website`
in GitHub Desktop. The assistant should use the actual selected path, rather than
copying a macOS path. GitHub Desktop is the recommended route on either system.

Alternatively, on macOS with Git already installed, run:

```bash
mkdir -p ~/dev/site-sentinel
cd ~/dev/site-sentinel
git clone https://github.com/Site-Sentinel/sitesentinel-website.git
cd sitesentinel-website
```

If that folder already contains a checkout, open it rather than cloning over it.
Cloning a public repository does not prove you have permission to push. Use your
own authorised GitHub account; resolve sign-in or access errors without pasting
passwords or tokens into chat or repository files.

## 3. Open the checkout in desktop Codex

1. Select **Codex** in the desktop app and add or open the cloned repository folder
   as a local project. Name it **Site Sentinel Website**.
2. Make the repository folder the primary folder if the project has multiple folders.
   This is where Codex should discover `AGENTS.md` and perform Git operations.
3. Choose **This computer / Local** for the coding chat. Labels can vary by app
   version. A GitHub plugin connection does not attach a local checkout.
4. If the app asks whether you trust the folder, confirm the path is the checkout
   you just cloned before granting trust. Keep the usual permission controls.
5. Ask the assistant to read `AGENTS.md`, confirm the folder and current branch,
   check the pinned tool versions, install dependencies and verify the baseline:

```text
Set up this local Site Sentinel website checkout.
Read AGENTS.md and README.md. Confirm the repository folder and current branch.
Check Node and pnpm against .node-version and package.json.
Run pnpm install --frozen-lockfile, pnpm check and pnpm build.
Start pnpm dev and give me the actual local URL. Do not edit or publish the website.
Explain any setup errors in plain language.
```

The development page is normally at **http://localhost:4330**. Edits update it
while the development server is running. If the port is occupied, identify the
existing process before starting another server; do not stop an unrelated process.
Use the URL printed by the server if it differs.

Official guides: [Codex environments](https://learn.chatgpt.com/docs/environments/modes),
[Projects and local folders](https://learn.chatgpt.com/docs/projects) and
[Local environments](https://learn.chatgpt.com/docs/environments/local-environment).

## 4. Verify the publishing safeguards once

Ask the repository administrator to verify:

- GitHub protects `main`, prevents direct website pushes, requires pull requests
  and successful Checks, Architectural rules and the actual Netlify preview status check.
- Netlify is connected to this repository, builds production from `main`, and
  has pull request Deploy Previews enabled.
- The production URL is confirmed. The custom domain migration is a separate
  task; do not change DNS as part of an ordinary website edit.

The written instructions guide the assistant. Platform settings enforce the
publishing safeguards. Neither substitutes for reviewing the preview.

## 5. Make a change and review it locally

Start a new chat in the local website project and paste this prompt:

```text
Read AGENTS.md and README.md in this local checkout.
Make this change: [describe the exact change].
Preserve any existing uncommitted work. Fetch origin, start from current
origin/main and create a descriptive feature branch before editing.
Run pnpm dev so I can review locally, then run pnpm check and pnpm build.
Inspect desktop and phone layouts. Commit only this change, push the feature
branch to origin, and open a pull request targeting main.
Wait for successful checks and the Netlify preview, then give me both links.
Do not merge or publish production until I explicitly approve that version.
```

The assistant should manage the branch and explain the result in plain language.
GitHub Desktop can show the active branch and changed files throughout the task.
Review that list before committing or pushing; only the requested changes belong
in the PR.
You can review local changes immediately at http://localhost:4330 and ask for
corrections in the same chat. Localhost is only available on your computer; use
Netlify's preview link for phone review and sharing.

If the assistant cannot push or open the PR, use GitHub Desktop on the same
feature branch: **Publish branch** for the first push, or **Push origin** for
later commits, then **Create Pull Request**. Verify the PR targets `main`.
Never switch to `main` just to publish the changes.

## 6. Approve the preview and publish

A pushed branch and PR let Netlify build a shareable preview. Wait for successful
checks and review the latest preview on desktop and phone. If it needs changes,
continue on the same branch and PR, then review the updated preview.

When the current preview is right, explicitly approve that version for publishing.
The assistant should merge the PR, verify Netlify's production deployment and
inspect the deployed page before reporting the production link. If it lacks merge
access, it should guide you through the approved PR's merge on GitHub.

For the next change, fetch the latest `origin/main` and create a new branch. Keep
any unfinished work intact. Do not reset, delete branches or discard files to make
an update easier. After reviewing locally, stop the development server when it is
no longer needed.

Download [how-deploys-work.html](how-deploys-work.html) and open it in a browser
for the visual workflow. Preview links are shareable, not private storage.

## Optional: a ChatGPT Project for discussion

A separate ChatGPT Project can hold copy discussions and approved references.
It is not required for local Codex work. Do not assume its uploaded files,
instructions or conversations appear in a separate coding chat: explicitly supply
the agreed brief and references when needed.

Use approved public brand artwork and fictional-data product screenshots. Keep
enduring public guidance in the repository and confidential material out of it.
The local project must point to the actual Git checkout; creating an empty project
folder or connecting the GitHub plugin is not a substitute for cloning the site.
