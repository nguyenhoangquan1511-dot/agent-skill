---
name: qskill-review-code
description: Review and continuously improve source code implementation against an approved Plan through iterative review cycles. Use during or after implementation to detect issues.
---

# Skill: Review Code

## Step 0 — MANDATORY, NO EXCEPTIONS

**Before anything else, open and read [review-common](../shared/review-common.md) in full.**

Not after picking a mode. Not "if needed". Not from memory of a previous
session. Before you resolve the target, before you open the source code, before you
answer the user, before you write a single line.

Then announce: **"Read review-common. Running `<mode>` mode."** The user must
see that line; without it, you have not started this skill.

Skipping this step has exactly one outcome, and it has happened: you run the
wrong mode, because the mode workflows exist only in that file. `scan` in
particular looks like `review` from here and is not — it stops and asks the
user before anything is written.

| Excuse | Reality |
|---|---|
| "I know this skill already" | The workflows are not in this file. You do not know them from here. |
| "The mode is obvious from the scope table" | The scope table says what a mode may touch, never how it runs. |
| "It is a long file, I will read the part I need" | You cannot tell which part you need before reading it. Read it in full. |
| "I read it earlier in this session" | Then say so in the announcement and continue. Otherwise, read it. |

---

**Read this first — open it before running any mode:** [review-common](../shared/review-common.md) — it holds
every rule the two review skills share: the three modes, Plan Resolution, the
review report location and naming, Issue Structure, Severity Scale, the issue
lifecycle, the workflows, validation, Report Self-Review, Git and Commit
Message. This file records only what is **specific** to review-code. Where the two
appear to conflict, the specific rule here wins, and only within what it
actually covers. The workflow of each mode lives only in that file: reading this file alone is enough to know what a mode may touch, never enough to run it.

## Objective

Review and continuously improve a source code implementation against its
approved Plan, in three modes: `review`, `feedback`, `scan`.

---

# Bindings

Values for the placeholders used by [review-common](../shared/review-common.md):

| Placeholder | Value for this skill |
|---|---|
| **TARGET** | The source code implementation — what `feedback` edits |
| **BASELINE** | The Approved Plan (or, for a bare `scan` with no Plan, the goal confirmed by the user — see Scan Target Resolution) |
| **SUFFIX** | `-review-code` |

Report file name: `docs/superpowers/reviews/YYYY-MM-DD-<topic>-review-code.md`,
with `YYYY-MM-DD-<topic>` copied verbatim from the filename of the Approved Plan
that drove the implementation.

Required inputs: the Approved Plan (resolvable by name — see Plan Resolution in
review-common), the source code path, and optionally an existing review report.

---

# Scope

## review

Allowed: Approved Plan, Source Code, existing Code Review Report.

Must NOT modify: Source Code, Tests, Infrastructure, Configuration.

Updates only: the Code Review Report.

## feedback

Allowed: Approved Plan (read only), Source Code, Code Review Report.

Must NOT modify: Approved Plan, Infrastructure, Configuration.

Tests may be updated only when required to keep the implementation correct.

## scan

Allowed: Approved Plan, Source Code, existing Code Review Report (context only).

Must NOT modify: anything at all — Approved Plan, Source Code, review report,
Tests, Infrastructure, Configuration.

Scan only produces a severity summary and a decision question. Modifying
anything requires continuing into `review` or `feedback`.

**Scan ends with a question, never with a report.** After presenting the
severity summary, STOP and ask the user to choose exactly one: **write the
report** (continue into `review`), or **fix now** (resolve the findings
directly in TARGET). Until that answer arrives: no Issue ID, no report file,
no edit. Never map `scan` onto `review` on your own — they are different
modes, and `scan` is the one that asks first. Full steps: Scan Workflow in
review-common.

---

# Scan Target Resolution

Applies to `scan` mode only, when the user runs `scan` without giving any input
— no source path, no Approved Plan, no Specification, no feature/topic name.

1. Read today's Git log on the current branch — e.g.
   `git log --since=midnight --until=now --stat`.
2. If today has no commit, say so and ask the user for the scan target. Do not
   fall back to another day on your own.
3. If today has exactly one commit, that commit is the scan target — the source
   files it touched are the scope.
4. If today has several commits, list them all (short hash, subject, changed
   files), mark the most recent one, and ask the user to pick one. Never guess
   which one.
5. Infer the main goal of the chosen commit yourself, from its message and its
   diff, and state it in one sentence. Ask the user to confirm or correct that
   sentence — do not ask them to write the goal from scratch.
6. If an Approved Plan matching that goal exists, resolve it with Plan
   Resolution and use it. If none exists, the confirmed goal replaces the
   Approved Plan as BASELINE, and the scan summary must say so.
7. Wait for the confirmation, then run the Scan Workflow on those files using
   the confirmed goal as BASELINE.

Do not start `scan` until both the target commit and the goal are confirmed by
the user.

---

# Feedback Transaction Addition

On top of the common transaction, a resolved issue may also require a test
change. When it does, the test update belongs to the same atomic step:

- Update Source Code
- Update Tests (if required)
- Update Status / Updated By / Updated At / Response

Updating only the code, or only the review report, is invalid.

---

# Additions To The Common Rules

**Decision Matrix** — use DISCUSS when the Approved Plan is ambiguous, or when
several valid implementations exist and the Plan does not choose between them.

**Failure Cases** — in addition to the common list

- Implementing behavior not defined by the Approved Plan.

**Forbidden** — in addition to the common list

- implement functionality outside the Approved Plan without discussion
- modify the Approved Plan during any mode — a Plan defect is an issue for
  `qskill-review-plan`, not something this skill edits
