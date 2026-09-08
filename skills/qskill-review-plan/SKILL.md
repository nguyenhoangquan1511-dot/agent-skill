---
name: qskill-review-plan
description: Review and continuously improve a Plan or Specification through iterative review cycles. Use after writing a plan/spec, before or during implementation.
---

# Skill: Review Plan

**Ngôn ngữ:** Viết review report bằng tiếng Việt — Problem, Recommendation, Response, và mọi phần diễn giải.
**Ngôn ngữ:** Trao đổi với user bằng tiếng Việt. Giữ nguyên code, identifier, đường dẫn file, câu lệnh, tên type, Issue ID và các giá trị Status (OPEN / RESOLVED / DISCUSS) ở dạng gốc.

## Objective

Review and continuously improve a Plan or Specification through iterative review cycles.

This skill has three execution modes:

- review
- feedback
- scan

The Plan Review Report is a living document.

Never recreate, overwrite, remove, or renumber existing issues.
Always update the existing review report.

---

# Execution Modes

## review

Responsibilities

- Analyze the current Plan.
- Detect new issues.
- Re-evaluate all existing issues.
- Synchronize issue status with the current Plan.
- Update the review report only.

Review MUST NEVER modify the Plan.

---

## feedback

Responsibilities

- Resolve review issues by updating the Plan.
- Synchronize the review report with every Plan change.
- Keep the Plan and review report consistent at all times.

Feedback MUST update BOTH the Plan and the review report.

---

## scan

Responsibilities

- Analyze the Plan as thoroughly as `review` (full depth, same evidence rules).
- Classify every finding using the Severity Scale.
- Summarize findings by severity count and list every High/Critical finding.
- Ask the user to choose exactly one next step: write the review report (`review`), or fix now (resolve directly, without requiring a report entry).

Scan MUST NEVER modify the Plan or the review report on its own. It ends with a question, not with a report or a Plan change.

---

# Scope

## review

Allowed

- Plan
- Specification
- Existing Plan Review Report

Must NOT modify

- Plan
- Source Code
- Tests
- Infrastructure
- Configuration

Updates only

- Plan Review Report

---

## feedback

Allowed

- Plan
- Specification
- Plan Review Report

Must NOT modify

- Source Code
- Tests
- Infrastructure
- Configuration

---

## scan

Allowed

- Plan
- Specification
- Existing Plan Review Report (for context only)

Must NOT modify

- Plan
- Specification
- Plan Review Report
- Source Code
- Tests
- Infrastructure
- Configuration

Scan only produces a severity summary and a decision question. Modifying anything requires continuing into `review` or `feedback`.

---

# Required Inputs

Required

- Plan path

Optional

- Existing Plan Review Report

If no review report exists, create one.

Otherwise update the existing report.

---

## Plan Resolution

The Plan may be supplied as an exact file path, a Specification, or a feature/topic name — it does not have to be a path.

When the given value is an existing file path, use it exactly as given — skip the steps below.

When the given value is not an existing file path

1. Inspect the most recent Git commits for files added/modified under `docs/superpowers/plans/` and `docs/superpowers/specs/` matching the given Specification/feature name — a Plan is normally committed right after being written, so this is the primary source.
2. If nothing matches, search the rest of `docs/` for a file whose name or content matches the given Specification/feature name.
3. If exactly one candidate matches, use it.
4. If multiple candidates match, list the candidates and ask the user to pick one. Never guess.
5. If nothing matches, ask the user to confirm the topic or provide the exact path.

Do not start `review`, `feedback`, or `scan` until the Plan file is confirmed.

---

## Scan Target Resolution

Applies to `scan` mode only, when the user runs `scan` without giving any input — no path, no Specification, no feature/topic name.

1. Read today's Git log on the current branch — e.g. `git log --since=midnight --until=now --name-only`.
2. Collect the files those commits touched under `docs/superpowers/plans/` and `docs/superpowers/specs/`.
3. If today has no commit, or the commits touched no Plan/Spec file, list today's commits (short hash, subject, most recent one marked) and ask the user for the Plan path or topic. Do not fall back to another day on your own.
4. If exactly one Plan/Spec file was touched, propose it as the scan target.
5. If several commits touched Plan/Spec files, list those commits (short hash, subject, Plan/Spec files touched), mark the most recent one, and ask the user to pick one. Never guess.
6. Infer the main goal of the chosen commit yourself, from its message and its diff, and state it in one sentence. Ask the user to confirm or correct that sentence — do not ask them to write the goal from scratch.
7. Wait for the confirmation, then run the Scan Workflow using the confirmed Plan and the confirmed goal as the review baseline.

Do not start `scan` until both the Plan file and the goal are confirmed by the user.

---

# Review Report Location

The review report path is fixed. Never choose another location or name.

**Directory**

```
docs/superpowers/reviews/
```

This directory sits beside `docs/superpowers/plans/` and `docs/superpowers/specs/`.
Create it if it does not exist.

**File name**

```
YYYY-MM-DD-<topic>-review-plan.md
```

`YYYY-MM-DD` and `<topic>` are copied verbatim from the artifact under review
(the Plan file name), so every execution resolves to the same file.

Example

```
docs/superpowers/plans/2026-09-03-user-auth.md
docs/superpowers/reviews/2026-09-03-user-auth-review-plan.md
```

**Name rules**

- Separator is the hyphen `-` only. Never `.`, never `_`, never a space.
- The only `.` in the whole name is the one before `md`.
- All lowercase. `<topic>` keeps the exact spelling used by the artifact.
- Suffix is exactly `-review-plan` and always sits last, right before `.md`.

Valid

```
2026-09-03-user-auth-review-plan.md
```

Invalid

```
2026-09-03-user-auth.review-plan.md      (dot as separator)
2026_09_03-user-auth-review-plan.md      (underscore)
2026-09-03-review-plan-user-auth.md      (suffix not last)
2026-09-03-User-Auth-review-plan.md      (uppercase)
```

Never derive the date from today. A report created on day one keeps its original
name forever — the date identifies the artifact, not the review run.

Before creating a report, list `docs/superpowers/reviews/` and check whether the
resolved file already exists. If it does, update it. Creating a second report for
one artifact violates the living-document rule.

---

# Review Report

The review report is the single source of truth for all review issues.

It is a living document.

Never recreate it.

Never delete existing issues.

Never renumber Issue IDs.

Existing issues remain until explicitly resolved.

---

# Issue Structure

Every issue contains

- Issue ID
- Status
- Severity
- Category
- Location
- Problem
- Recommendation
- Created At
- Updated By
- Updated At
- Response

Mutable fields

- Status
- Updated By
- Updated At
- Response

All other fields are immutable.

---

# Severity Scale

| Severity | Criteria |
|----------|----------|
| Low | No effect on behavior/outcome — only violates a convention (style, wording, formatting...) |
| Medium | The current case behaves correctly, but an uncovered case/edge case could fail |
| High | Deviates from the direction already agreed in the Plan, or blocks the main flow within the scope of the current task |
| Critical | Impact extends beyond the current task/feature to the whole system: data loss, security vulnerability, breaking another feature. Assign carefully — never by default |

"High or above" means High + Critical.

---

# Issue Lifecycle

OPEN
│
├── feedback resolves issue
▼
RESOLVED

OPEN
│
├── human decision required
▼
DISCUSS

No other transitions are allowed.

---

# Status

OPEN

Issue requires action.

RESOLVED

Issue has been accepted and the Plan has already been updated.

DISCUSS

Human decision is required.

---

# Review Workflow

1. Load the Plan.
2. Load the existing review report if present.
3. Review the entire Plan.
4. Re-evaluate every existing issue.
5. Reuse existing Issue IDs.
6. Mark fixed issues as RESOLVED.
7. Keep unresolved issues OPEN.
8. Create Issue IDs only for newly discovered problems.
9. Update the review report.

Review never modifies the Plan.

---

# Feedback Workflow

1. Load the Plan.
2. Load the review report.
3. Process every OPEN issue.
4. Never skip an OPEN issue.

For each OPEN issue

If the issue can be safely resolved

- Update the Plan.
- Update Status to RESOLVED.
- Update Updated By.
- Update Updated At.
- Update Response.

Otherwise

- Update Status to DISCUSS.
- Update Updated By.
- Update Updated At.
- Update Response.

---

# Scan Workflow

0. If the user gave no input, resolve the target first — see Scan Target Resolution.
1. Load the Plan.
2. Analyze the Plan with the same depth and evidence rules as `review` — do not hold back because the report will not be written yet.
3. Classify every finding using the Severity Scale. Do not create Issue IDs and do not write the review report at this stage.
4. Present a summary
   - Total count broken down by severity (Critical / High / Medium / Low).
   - If High + Critical > 0, list each one with its Location and a one-line Problem.
5. Ask the user to choose exactly one
   - Write the report — reuse the analysis just produced and continue with the `review` Workflow (create Issue IDs, write the report). Do not re-analyze from scratch.
   - Fix now — reuse the analysis just produced and resolve the findings directly in the Plan, following the same per-issue resolution as `feedback` step 4, except creating an Issue ID and writing the review report is optional for this pass. An existing report for this artifact, if any, may optionally note the fix as a supplement to its latest round.
6. Continue with whichever path was chosen. Scan itself never modifies the Plan or the review report.

---

# Feedback Transaction

Processing an issue is atomic.

The following operations must complete together.

- Update Plan
- Update Status
- Update Updated By
- Update Updated At
- Update Response

Updating only the Plan is invalid.

Updating only the review report is invalid.

---

# Plan Content Rules Apply To Every Edit

A fix must never lower the quality of the Plan.

Every edit written into the Plan during feedback MUST obey the Plan Content Rules
of the `qskill-writing-plans` skill. Read that section before editing if it is not
already in context.

The rules that get broken most often

- Full function bodies, full component files and full test files are forbidden in
  the Plan. Resolving an issue by pasting implementation code is not a fix.
- Test cases stay a text checklist `case name -> expected`. Never test code.
- Code is allowed only for contracts (type / interface / schema / enum / config),
  or for special logic already confirmed in the spec, at most 10 lines.
- Deleting a code block is only half of the fix. The same logic must be rewritten
  in Business Analyst language — numbered steps in execution order, the condition
  of each branch, the outcome of each branch, and the failure behaviour.
- Removing code must never make the Plan vaguer. "Handle it appropriately" is as
  invalid as a code dump.

Why: code written at planning time is written blind and gets rewritten during
implementation. A review that pushes code into the Plan makes the next execution
more expensive, not less.

When an issue seems to require implementation code to resolve

the issue is not resolvable in the Plan.

Set it to DISCUSS instead of dumping code.

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

# Synchronization Invariant

The Plan and its review report must always represent the same state.

Whenever the Plan changes

the corresponding review issue must also be updated.

Whenever an issue becomes RESOLVED

the required Plan change must already exist.

The task is incomplete if the Plan and review report are inconsistent.

Exception: a `scan` execution that ends in "fix now" is not required to create or update a review report entry for the issues it resolves (see Scan Workflow, step 5).

---

# Mandatory Issue Processing

Every OPEN issue encountered during feedback must end in exactly one state.

- RESOLVED
- DISCUSS

Leaving an OPEN issue unchanged after processing is not allowed.

---

# Decision Matrix

RESOLVED

Use when

- the issue is valid
- the Plan has been updated

DISCUSS

Use when

- business intent is unclear
- multiple valid solutions exist
- insufficient evidence exists
- human approval is required
- the only way to resolve it would be to write implementation code into the Plan

---

# Completion Validation

Before finishing verify

For every RESOLVED issue

- the Plan contains the required change
- Updated By exists
- Updated At exists
- Response exists

- the Plan change obeys the Plan Content Rules — no full function body, no full
  component file, no test code
- any code block removed from the Plan has been replaced with Business Analyst
  language, not with a vague sentence

For every DISCUSS issue

- Response exists

The review report matches the current Plan.

Report location

- the report lives in `docs/superpowers/reviews/`
- the file name matches `YYYY-MM-DD-<topic>-review-plan.md`
- no duplicate report exists for the same artifact

If any validation fails

continue updating before completing.

---

# Evidence Rule

Every decision must be supported by evidence.

Never invent requirements.

---

# No Hallucination Rule

Never invent

- business rules
- architecture decisions
- undocumented behavior
- project conventions

When evidence is insufficient

use DISCUSS.

---

# Failure Cases

Invalid examples

- Updating the Plan but leaving Status as OPEN.
- Updating the Plan but not updating Response.
- Creating a new Issue ID for an existing issue.
- Ignoring an OPEN issue.
- Recreating the review report.
- Removing resolved issues.
- Resolving an issue by writing the implementation into the Plan.
- Replacing a removed code block with a vague sentence instead of a numbered behaviour description.
- Turning a test checklist into test code while "clarifying" it.

---

# Forbidden

Never

- modify the Plan during review mode
- modify the Plan or the review report during scan mode
- ignore an OPEN issue
- recreate the review report
- write the review report anywhere but `docs/superpowers/reviews/`
- rename the review report or derive its name from the current date
- use `.` or `_` as a separator in the report file name
- create a second report for an artifact that already has one
- commit before the Report Self-Review has run
- renumber Issue IDs
- delete issues
- modify immutable fields
- mark RESOLVED without updating the Plan
- update the Plan without updating the review report (except the `scan` "fix now" path — see Scan Workflow)
- write a full function body, a full component file or a full test file into the Plan
- resolve an issue by pasting implementation code instead of describing behaviour
- delete a code block from the Plan without replacing it with Business Analyst language
- put implementation code inside a Recommendation

---

# Report Self-Review

After updating the review report, read it back with fresh eyes and check it
yourself. This is an inline checklist — not a subagent dispatch.

| Category | What to look for |
|----------|------------------|
| Completeness | Placeholders, "TBD", empty Response fields, issues missing required fields |
| Consistency | Two issues contradicting each other; Status not matching what the artifact actually contains |
| Clarity | A Problem or Recommendation ambiguous enough that the reader would fix the wrong thing |
| Traceability | Every Location still points at something that exists in the current artifact |
| Scope | Issues that belong to a different artifact, or invented requirements with no evidence |
| Code bloat | Any code block written into the Plan or a Recommendation during this execution. Keep it only if it is a type / interface / schema / config, or confirmed special logic of at most 10 lines. Otherwise replace it with signature plus behaviour description |

**Calibration**

Only flag what would cause a real problem for the next execution. A wrong Status,
a missing Response, a dangling Location, or an issue so vague it cannot be acted
on — those are problems. Wording preferences and formatting are not.

Code bloat is always a real problem, never a formatting preference. Fix it.

Fix any issue inline, then move on. Do not re-run the full review.

This check runs in both modes, and it runs before the Git commit.

---

# Completion Criteria

The task completes only when

- every required issue has been processed
- the Plan and review report are synchronized
- all validation rules pass

---

# Chat Output

## review

Review completed successfully.

Updated Review Report

docs/superpowers/reviews/YYYY-MM-DD-<topic>-review-plan.md

## feedback

Feedback completed successfully.

Updated Plan

<plan path>

Updated Review Report

docs/superpowers/reviews/YYYY-MM-DD-<topic>-review-plan.md

## scan

Scan completed.

Summary: Critical: a, High: b, Medium: c, Low: d

<Location + one-line Problem for each High/Critical finding, if any>

Which do you want?

1. Write the review report
2. Fix now

---

# Git Integration

Git is mandatory. Before starting an execution, run `git rev-parse --git-dir`.
If the working directory is not a Git repository, STOP and ask the user to
initialize Git before any review or feedback work begins. Without version
control, several plans and fixes accumulate in one working tree and the
resulting commits cannot be separated per work stream.

Every completed execution must end with exactly one Git commit.

This applies to

- review
- feedback
- scan, only when it continues into `review` or `feedback` — a scan left pending on the user's choice produces no commit

The commit must include every artifact modified during the execution.

Examples

Review

- Review Report

Feedback

- Plan / Source Code
- Tests (if modified)
- Review Report

Do not create multiple commits for a single execution.

Do not create a commit if

- validation fails
- unresolved work remains
- the task is incomplete

Nothing produced by the execution may be left uncommitted. Before reporting
completion, run `git status --porcelain` — anything still listed is unfinished
work: commit it or report it explicitly.

---

# Git Baseline

Before starting a new execution,

identify the latest Git commit.

Review the latest commit message to understand the purpose of the previous execution.

Use Git diff against the latest commit to

- identify modified files
- understand previous changes
- optimize the review process

Git diff is an optimization only.

The final validation must still review the complete artifact.

---

# Commit Message

Every commit must carry the **plan slug** in its subject line so Git history can
be grouped without reading commit bodies or diffs.

Format

```
[<plan-slug>] <short description of what changed>

<optional body: why it changed>

Plan: docs/superpowers/plans/<plan-file>.md
```

The plan slug is the plan filename with the date kept and only the extension
removed — `YYYY-MM-DD-<feature-name>`.

- `docs/superpowers/plans/2026-09-03-user-auth.md` -> `2026-09-03-user-auth`
- `docs/superpowers/specs/2026-09-03-user-auth-design.md` -> `2026-09-03-user-auth`
- no plan and no spec -> `chore-YYYY-MM-DD`

**Never strip the date.** Feature names repeat across time; two `user-auth`
plans written months apart are different work streams and must not collapse
into one `git log --grep` result. Drop only the trailing `-design` from spec
filenames.

The slug is identical to the one used by the spec commit, the plan commit and
every implementation commit of the same work stream, so
`git log --oneline --grep '\[2026-09-03-user-auth\]'` returns all of them.

The full document path stays in the `Plan:` trailer, not the subject — the slug
already identifies the plan, and repeating the directory in every subject eats
the width `git log --oneline` has for the actual description.

Example

```
[2026-09-03-user-auth] Resolve review findings on token rotation

- tighten the expiry rule in Task 3
- record the findings in the review report

Plan: docs/superpowers/plans/2026-09-03-user-auth.md
```

After the prefix, the message must still describe

- what changed
- why it changed

Avoid generic messages such as

- update
- fix
- changes

Full rules: [commit-convention](../qskill-executing-plans/references/commit-convention.md).

---

# Cross-Artifact Consistency

Feedback must maintain consistency across all related project artifacts.

When resolving an issue, identify every artifact affected by the change.

Examples include

- Specifications
- Requirements
- Design Documents
- Architecture Documents
- Plans
- API Documents
- Source Code
- Tests
- Review Reports

If an artifact becomes inconsistent because of the change, update it during the same feedback execution.

Do not leave related artifacts out of sync.

---

# Impact Analysis

Before applying a fix, analyze the impact of the change.

Determine

- which artifacts are affected
- which documents require updates
- whether implementation must change
- whether tests must change

Feedback is complete only after every affected artifact has been updated.

---

# Consistency Invariant

Every project artifact must describe the same system.

Feedback must never leave the project in a partially updated state.

If one artifact changes, every dependent artifact must be reviewed and updated if necessary.

The task is incomplete until all affected artifacts are consistent.
