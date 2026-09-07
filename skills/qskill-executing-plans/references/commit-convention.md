# Commit Convention

> **Reference doc** (not a standalone skill). Canonical commit rules for every
> qskill skill that creates a Git commit: brainstorming, writing-plans,
> executing-plans, review-plan, review-code.

## Why

Git history must be groupable **without reading commit bodies or diffs**. Every
commit therefore carries the plan (or spec) it belongs to, right in the subject
line, so `git log --oneline` alone shows which work stream a commit came from.

## Git Is Required — Hard Gate

Before doing any work that will produce files, verify the working directory is
a Git repository:

```bash
git rev-parse --git-dir
```

**If it is not a repository: STOP.** Ask the user to initialize Git (or point at
the right directory) and wait. Do not start work, do not write the spec, do not
write the plan, do not touch source code.

**Why:** without version control, several plans and several fixes pile up in one
undifferentiated working tree. The commits that eventually get made are dirty —
unrelated changes mixed together, impossible to group or revert per plan.

## Everything Ends Up Committed

Every file created or modified during an execution must be committed — during
the run or at the end, whichever the skill in use specifies. When a skill
finishes, nothing it produced is left uncommitted or untracked.

Before reporting completion, verify:

```bash
git status --porcelain
```

Empty output (or only files the repo deliberately ignores) is the pass
condition. Anything else is unfinished work — commit it or report it explicitly.

## Message Format

```
[<plan-slug>] <short description of what changed>

<optional body: why it changed, notable decisions>

Plan: docs/superpowers/plans/<plan-file>.md
Task: <task number or name>
```

Rules:

- `[<plan-slug>]` is **required** and comes first in the subject line.
- `Plan:` trailer is required whenever a plan or spec file exists.
- `Task:` trailer only when the commit implements one specific plan task.
- Subject after the prefix stays descriptive: what changed, and enough of why.
  Never `update`, `fix`, `changes`.

## Deriving the Plan Slug

**The slug is the plan filename with the date kept and only the extension
removed** — `YYYY-MM-DD-<feature-name>`:

| Artifact | Slug |
|---|---|
| `docs/superpowers/plans/2026-09-03-user-auth.md` | `2026-09-03-user-auth` |
| `docs/superpowers/specs/2026-09-03-user-auth-design.md` | `2026-09-03-user-auth` |
| No plan and no spec (chore, tooling, docs) | `chore-YYYY-MM-DD` |

**The date is part of the slug and must never be stripped.** Feature names
repeat across time — a second `user-auth` plan written three months later is a
different plan with different tasks. Without the date both work streams collapse
into one `git log --grep` result and grouping is worthless.

- Drop only the trailing `-design` from spec filenames, never the date.
- Spec-driven work uses the same slug as the plan it will become, so the spec
  commit and every implementation commit group together.
- The slug is stable for the whole work stream — it never changes between the
  spec commit, the plan commit, the implementation commits, and the review
  commits, even when those land weeks apart.

## Why the Path Lives in the Body, Not the Subject

The slug already identifies the plan uniquely, and the full path is derivable
from it. Repeating `docs/superpowers/plans/` in every subject line burns ~22
columns of the ~80 `git log --oneline` shows, pushing the actual description off
screen without adding any distinguishing information.

The `Plan:` trailer still earns its place in the body: it records the *real*
path, which separates a spec commit (`specs/...-design.md`) from a plan commit
(`plans/....md`), and stays correct when the user overrides the default
document location.

## Examples

Spec commit (brainstorming):

```
[2026-09-03-user-auth] Add design spec for JWT session handling

Plan: docs/superpowers/specs/2026-09-03-user-auth-design.md
```

Plan commit (writing-plans):

```
[2026-09-03-user-auth] Add implementation plan for JWT session handling

Plan: docs/superpowers/plans/2026-09-03-user-auth.md
```

Task commit (executing-plans):

```
[2026-09-03-user-auth] Rotate refresh token on every use

- issue a new refresh token per exchange
- invalidate the previous token immediately

Plan: docs/superpowers/plans/2026-09-03-user-auth.md
Task: 3
```

Review commit (review-plan / review-code):

```
[2026-09-03-user-auth] Resolve review findings on token rotation

- tighten the expiry rule in Task 3
- record the findings in the review report

Plan: docs/superpowers/plans/2026-09-03-user-auth.md
```

## Retrieving History

```bash
# every commit in one work stream (date included — a later plan with the
# same feature name does not collide)
git log --oneline --grep '\[2026-09-03-user-auth\]'

# every work stream that ever touched this feature name, across dates
git log --oneline --grep '\[[0-9-]*user-auth\]'
```
