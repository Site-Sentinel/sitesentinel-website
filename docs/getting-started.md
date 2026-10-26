# Edit the website with ChatGPT desktop

Open ChatGPT desktop, connect GitHub, select the website repository and request
your change. Use Cloud so the work runs without a local checkout or development
tools on your Windows PC or Mac. Review changes through Netlify preview links.

![Website editing workflow: ChatGPT desktop, connect GitHub, select the repository, request changes, review the preview and approve publication](cloud-workflow.svg)

## 1. Open ChatGPT desktop

Sign in and select **Codex** from the top-left mode menu. Start a new chat and
use **Cloud** for this workflow. Labels may vary by app version.

## 2. Connect GitHub and select the repository

Connect your own GitHub account when prompted, then select:

<https://github.com/Site-Sentinel/sitesentinel-website>

Use an account with permission to push changes to this repository. Reading a
public repository does not prove you can push or merge. If access is missing,
ask the repository owner for help. Never paste passwords or tokens into chat.

You do not need to clone the repository, install developer tools, run setup
commands or manually create and publish an environment. If the app reports a
specific setup problem, ask the assistant to explain and resolve that problem.

## 3. Request your change

Copy [prompt.txt](../prompt.txt) into the chat and add what you want changed.
For example: "Change the main heading to [your wording]."

The assistant reads the repository rules, makes the change on a separate branch,
runs checks and opens a pull request. Netlify builds a preview so you can see it.
The assistant handles development commands; you do not need to run them.
This static website needs no production secrets or shared Netlify password.

Each maintainer follows the same steps with their own ChatGPT and GitHub accounts.
Keep corrections to an existing change in the same chat and branch.

## 4. Check publishing safeguards once

Ask the repository administrator to verify:

- GitHub protects `main` against direct pushes and requires pull requests plus
  successful Checks, Architectural rules and the actual Netlify preview check.
- Netlify is connected to this repository, builds production from `main`, and
  has pull request Deploy Previews enabled.
- The production address and who may approve and merge changes are agreed.

These are external settings. Written repository rules do not enforce them.
Do not change DNS or the product application's configuration during a website edit.

## 5. Review the preview

Open the latest Netlify preview on your computer and phone. Check the changed
wording, images, buttons and layout. Ask for corrections in the same cloud task;
the same branch and PR receive the updates. Wait for checks and review again.

Chrome browser control is the approved tool for assistant visual checks.
Playwright is prohibited. A cloud task may not have access to your local Chrome.
If it cannot inspect the preview, review it yourself and report the result.
The assistant must state who checked which preview and what remains incomplete.
Passing source checks alone does not prove the page looks right.

Preview links are shareable, not private storage. Use approved public artwork
and fictional data. Do not upload real customer screenshots or private records.

## 6. Approve and publish

When you are happy with the current preview and checks have passed, say:

```text
I have reviewed this preview on desktop and phone. I approve publishing this
version. Merge the PR, verify the production deployment for the merged commit,
and give me the production link and any remaining limitations.
```

The assistant may merge only with that explicit approval and sufficient access.
If it cannot merge, an authorised maintainer can merge the approved PR on GitHub.
Netlify then builds production. A merge alone is not proof of deployment: check
that the deployment succeeded and inspect the deployed result.

Keep corrections in the same task until complete. For a separate change, start a
new task from current main. Do not let two people edit the same branch at once.
A separate ChatGPT Project can hold discussions, but supply the agreed brief to
the coding task rather than assuming other chats or uploaded files are available.

Read the [visual publishing guide](how-deploys-work.md) for the full flow.
Its diagram and instructions render directly on GitHub.
