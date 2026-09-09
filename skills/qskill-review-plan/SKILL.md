---
name: qskill-review-plan
description: Review and continuously improve a Plan or Specification through iterative review cycles. Use after writing a plan/spec, before or during implementation.
---

# Skill: Review Plan

**Read this first:** [review-common](../shared/review-common.md) — it holds
every rule the two review skills share: the three modes, Plan Resolution, the
review report location and naming, Issue Structure, Severity Scale, the issue
lifecycle, the workflows, validation, Report Self-Review, Git and Commit
Message. This file records only what is **specific** to review-plan. Where the two
appear to conflict, the specific rule here wins, and only within what it
actually covers.

## Objective

Review and continuously improve a Plan or Specification through iterative
review cycles, in three modes: `review`, `feedback`, `scan`.

---

# Bindings

Values for the placeholders used by [review-common](../shared/review-common.md):

| Placeholder | Value for this skill |
|---|---|
| **TARGET** | The Plan (or Specification) under review — what `feedback` edits |
| **BASELINE** | The Specification, the agreed direction, and the project conventions the Plan must respect |
| **SUFFIX** | `-review-plan` |

Report file name: `docs/superpowers/reviews/YYYY-MM-DD-<topic>-review-plan.md`,
with `YYYY-MM-DD-<topic>` copied verbatim from the Plan filename.

Required inputs: the Plan path (resolvable by name — see Plan Resolution in
review-common) and, optionally, an existing review report.

---

# Scope

## review

Allowed: Plan, Specification, existing Plan Review Report.

Must NOT modify: Plan, Source Code, Tests, Infrastructure, Configuration.

Updates only: the Plan Review Report.

## feedback

Allowed: Plan, Specification, Plan Review Report.

Must NOT modify: Source Code, Tests, Infrastructure, Configuration.

## scan

Allowed: Plan, Specification, existing Plan Review Report (context only).

Must NOT modify: anything at all — Plan, Specification, review report, Source
Code, Tests, Infrastructure, Configuration.

Scan only produces a severity summary and a decision question. Modifying
anything requires continuing into `review` or `feedback`.

---

# Scan Target Resolution

Applies to `scan` mode only, when the user runs `scan` without giving any input
— no path, no Specification, no feature/topic name.

1. Read today's Git log on the current branch — e.g.
   `git log --since=midnight --until=now --name-only`.
2. Collect the files those commits touched under `docs/superpowers/plans/` and
   `docs/superpowers/specs/`.
3. If today has no commit, or the commits touched no Plan/Spec file, list
   today's commits (short hash, subject, most recent one marked) and ask the
   user for the Plan path or topic. Do not fall back to another day on your own.
4. If exactly one Plan/Spec file was touched, propose it as the scan target.
5. If several commits touched Plan/Spec files, list those commits (short hash,
   subject, Plan/Spec files touched), mark the most recent one, and ask the user
   to pick one. Never guess.
6. Infer the main goal of the chosen commit yourself, from its message and its
   diff, and state it in one sentence. Ask the user to confirm or correct that
   sentence — do not ask them to write the goal from scratch.
7. Wait for the confirmation, then run the Scan Workflow using the confirmed
   Plan and the confirmed goal as the review baseline.

Do not start `scan` until both the Plan file and the goal are confirmed by the
user.

---

# Plan Content Rules Apply To Every Edit

A fix must never lower the quality of the Plan.

Every edit written into the Plan during feedback MUST obey the Plan Content
Rules of the `qskill-writing-plans` skill. Read that section before editing if
it is not already in context.

The rules that get broken most often

- Full function bodies, full component files and full test files are forbidden
  in the Plan. Resolving an issue by pasting implementation code is not a fix.
- Test cases stay a text checklist `case name -> expected`. Never test code.
- Code is allowed only for contracts (type / interface / schema / enum /
  config), or for special logic already confirmed in the spec, at most 10 lines.
- Deleting a code block is only half of the fix. The same logic must be
  rewritten in Business Analyst language — numbered steps in execution order,
  the condition of each branch, the outcome of each branch, and the failure
  behaviour.
- Removing code must never make the Plan vaguer. "Handle it appropriately" is as
  invalid as a code dump.

Why: code written at planning time is written blind and gets rewritten during
implementation. A review that pushes code into the Plan makes the next execution
more expensive, not less.

**When an issue seems to require implementation code to resolve**, the issue is
not resolvable in the Plan. Set it to DISCUSS instead of dumping code.

---

# Recommendation Content Rule

A Recommendation is an instruction for editing the Plan, so it lives under the
same rules as the Plan itself.

A Recommendation must describe

- which section of the Plan changes
- what behaviour, signature, edge case or test case must appear there

A Recommendation must NOT contain

- a function body the author is expected to copy into the Plan
- a ready-made test file

---

# Additions To The Common Rules

**Completion Validation** — on top of the common checks, for every RESOLVED
issue verify

- the Plan change obeys the Plan Content Rules — no full function body, no full
  component file, no test code
- any code block removed from the Plan has been replaced with Business Analyst
  language, not with a vague sentence

**Report Self-Review** — run one extra row of the common table:

| Category | What to look for |
|----------|------------------|
| Code bloat | Any code block written into the Plan or a Recommendation during this execution. Keep it only if it is a type / interface / schema / config, or confirmed special logic of at most 10 lines. Otherwise replace it with signature plus behaviour description |

Code bloat is always a real problem, never a formatting preference. Fix it.

**Failure Cases** — in addition to the common list

- Resolving an issue by writing the implementation into the Plan.
- Replacing a removed code block with a vague sentence instead of a numbered
  behaviour description.
- Turning a test checklist into test code while "clarifying" it.

**Forbidden** — in addition to the common list

- write a full function body, a full component file or a full test file into
  the Plan
- resolve an issue by pasting implementation code instead of describing
  behaviour
- delete a code block from the Plan without replacing it with Business Analyst
  language
- put implementation code inside a Recommendation
