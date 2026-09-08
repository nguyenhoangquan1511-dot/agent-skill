---
name: qskill-review-code
description: Review and continuously improve source code implementation against an approved Plan through iterative review cycles. Use during or after implementation to detect issues.
---

# Skill: Review Code

**Ngôn ngữ:** Viết review report bằng tiếng Việt — Problem, Recommendation, Response, và mọi phần diễn giải.
**Ngôn ngữ:** Trao đổi với user bằng tiếng Việt. Giữ nguyên code, identifier, đường dẫn file, câu lệnh, tên type, Issue ID và các giá trị Status (OPEN / RESOLVED / DISCUSS) ở dạng gốc.

## Objective

Review and continuously improve source code implementation through iterative review cycles.

This skill has three execution modes:

- review
- feedback
- scan

The Code Review Report is a living document.

Never recreate, overwrite, remove, or renumber existing issues.
Always update the existing review report.

---

# Execution Modes

## review

Responsibilities

- Analyze the implementation.
- Compare implementation against the approved Plan.
- Detect new issues.
- Re-evaluate all existing issues.
- Synchronize issue status with the current code.
- Update the review report only.

Review MUST NEVER modify source code.

---

## feedback

Responsibilities

- Resolve review issues by updating the source code.
- Keep the implementation aligned with the approved Plan.
- Synchronize the review report with every code change.

Feedback MUST update BOTH the source code and the review report.

---

## scan

Responsibilities

- Analyze the implementation as thoroughly as `review` (full depth, same evidence rules).
- Compare implementation against the approved Plan.
- Classify every finding using the Severity Scale.
- Summarize findings by severity count and list every High/Critical finding.
- Ask the user to choose exactly one next step: write the review report (`review`), or fix now (resolve directly, without requiring a report entry).

Scan MUST NEVER modify source code or the review report on its own. It ends with a question, not with a report or a code change.

---

# Scope

## review

Allowed

- Approved Plan
- Source Code
- Existing Code Review Report

Must NOT modify

- Source Code
- Tests
- Infrastructure
- Configuration

Updates only

- Code Review Report

---

## feedback

Allowed

- Approved Plan
- Source Code
- Code Review Report

Must NOT modify

- Approved Plan
- Infrastructure
- Configuration

Tests may be updated only when required to keep implementation correct.

---

## scan

Allowed

- Approved Plan
- Source Code
- Existing Code Review Report (for context only)

Must NOT modify

- Approved Plan
- Source Code
- Code Review Report
- Tests
- Infrastructure
- Configuration

Scan only produces a severity summary and a decision question. Modifying anything requires continuing into `review` or `feedback`.

---

# Required Inputs

Required

- Approved Plan
- Source Code path

Optional

- Existing Code Review Report

If no review report exists, create one.
Otherwise update the existing report.

---

## Plan Resolution

The Approved Plan may be supplied as an exact file path, a Specification, or a feature/topic name — it does not have to be a path.

When the given value is an existing file path, use it exactly as given — skip the steps below.

When the given value is not an existing file path

1. Inspect the most recent Git commits for files added/modified under `docs/superpowers/plans/` and `docs/superpowers/specs/` matching the given Specification/feature name — a Plan is normally committed right after being written, so this is the primary source.
2. If nothing matches, search the rest of `docs/` for a file whose name or content matches the given Specification/feature name.
3. If exactly one candidate matches, use it.
4. If multiple candidates match, list the candidates and ask the user to pick one. Never guess.
5. If nothing matches, ask the user to confirm the topic or provide the exact path.

Do not start `review`, `feedback`, or `scan` until the Approved Plan file is confirmed.

---

## Scan Target Resolution

Applies to `scan` mode only, when the user runs `scan` without giving any input — no source path, no Approved Plan, no Specification, no feature/topic name.

1. Read today's Git log on the current branch — e.g. `git log --since=midnight --until=now --stat`.
2. If today has no commit, say so and ask the user for the scan target. Do not fall back to another day on your own.
3. If today has exactly one commit, that commit is the scan target — the source files it touched are the scope.
4. If today has several commits, list them all (short hash, subject, changed files), mark the most recent one, and ask the user to pick one. Never guess which one.
5. Infer the main goal of the chosen commit yourself, from its message and its diff, and state it in one sentence. Ask the user to confirm or correct that sentence — do not ask them to write the goal from scratch.
6. If an Approved Plan matching that goal exists, resolve it with Plan Resolution and use it. If none exists, the confirmed goal replaces the Approved Plan as the review baseline, and the scan summary must say so.
7. Wait for the confirmation, then run the Scan Workflow on those files using the confirmed goal as the review baseline.

Do not start `scan` until both the target commit and the goal are confirmed by the user.

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
YYYY-MM-DD-<topic>-review-code.md
```

`YYYY-MM-DD` and `<topic>` are copied verbatim from the artifact under review
(the approved Plan file name that drove the implementation), so every execution resolves to the same file.

Example

```
docs/superpowers/plans/2026-09-03-user-auth.md
docs/superpowers/reviews/2026-09-03-user-auth-review-code.md
```

**Name rules**

- Separator is the hyphen `-` only. Never `.`, never `_`, never a space.
- The only `.` in the whole name is the one before `md`.
- All lowercase. `<topic>` keeps the exact spelling used by the artifact.
- Suffix is exactly `-review-code` and always sits last, right before `.md`.

Valid

```
2026-09-03-user-auth-review-code.md
```

Invalid

```
2026-09-03-user-auth.review-code.md      (dot as separator)
2026_09_03-user-auth-review-code.md      (underscore)
2026-09-03-review-code-user-auth.md      (suffix not last)
2026-09-03-User-Auth-review-code.md      (uppercase)
```

Never derive the date from today. A report created on day one keeps its original
name forever — the date identifies the artifact, not the review run.

Before creating a report, list `docs/superpowers/reviews/` and check whether the
resolved file already exists. If it does, update it. Creating a second report for
one artifact violates the living-document rule.

---

# Review Report

The review report is the single source of truth for implementation issues.

It is a living document.

Never recreate it.
Never delete existing issues.
Never renumber Issue IDs.

Existing issues remain until explicitly resolved.

---

# Issue Structure

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

---

# Severity Scale

| Severity | Criteria |
|----------|----------|
| Low | No effect on behavior/outcome — only violates a convention (style, naming, formatting...) |
| Medium | The current case behaves correctly, but an uncovered case/edge case could fail |
| High | Deviates from the direction already agreed in the Plan, or blocks the main flow within the scope of the current task |
| Critical | Impact extends beyond the current task/feature to the whole system: data loss, security vulnerability, breaking another feature. Assign carefully — never by default |

"High or above" means High + Critical.

---

# Issue Lifecycle

OPEN -> RESOLVED

OPEN -> DISCUSS

No other transitions are allowed.

---

# Status

OPEN

Implementation requires action.

RESOLVED

Implementation has been updated.

DISCUSS

Human decision is required.

---

# Review Workflow

1. Load the Approved Plan.
2. Load the Source Code.
3. Load the existing review report if present.
4. Review implementation against the Plan.
5. Re-evaluate every existing issue.
6. Reuse existing Issue IDs.
7. Mark fixed issues as RESOLVED.
8. Keep unresolved issues OPEN.
9. Create Issue IDs only for newly discovered problems.
10. Update the review report.

Review never modifies source code.

---

# Feedback Workflow

1. Load the Approved Plan.
2. Load the Source Code.
3. Load the review report.
4. Process every OPEN issue.
5. Never skip an OPEN issue.

For each OPEN issue

If the issue can be safely resolved

- Update the source code.
- Update tests if required.
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
1. Load the Approved Plan.
2. Load the Source Code.
3. Analyze the implementation with the same depth and evidence rules as `review` — do not hold back because the report will not be written yet.
4. Classify every finding using the Severity Scale. Do not create Issue IDs and do not write the review report at this stage.
5. Present a summary
   - Total count broken down by severity (Critical / High / Medium / Low).
   - If High + Critical > 0, list each one with its Location and a one-line Problem.
6. Ask the user to choose exactly one
   - Write the report — reuse the analysis just produced and continue with the `review` Workflow (create Issue IDs, write the report). Do not re-analyze from scratch.
   - Fix now — reuse the analysis just produced and resolve the findings directly in the source code, following the same per-issue resolution as `feedback` step 4, except creating an Issue ID and writing the review report is optional for this pass. An existing report for this artifact, if any, may optionally note the fix as a supplement to its latest round.
7. Continue with whichever path was chosen. Scan itself never modifies the source code or the review report.

---

# Feedback Transaction

Processing an issue is atomic.

The following operations must complete together.

- Update Source Code
- Update Tests (if required)
- Update Status
- Update Updated By
- Update Updated At
- Update Response

Updating only the code is invalid.

Updating only the review report is invalid.

---

# Synchronization Invariant

The implementation and its review report must always represent the same state.

Whenever the code changes,
the corresponding review issue must also be updated.

Whenever an issue becomes RESOLVED,
the required code change must already exist.

The task is incomplete if the implementation and review report are inconsistent.

Exception: a `scan` execution that ends in "fix now" is not required to create or update a review report entry for the issues it resolves (see Scan Workflow, step 6).

---

# Mandatory Issue Processing

Every OPEN issue encountered during feedback must end in exactly one state.

- RESOLVED
- DISCUSS

---

# Decision Matrix

RESOLVED

Use when

- the issue is valid
- the implementation has been updated

DISCUSS

Use when

- the Plan is ambiguous
- multiple valid implementations exist
- insufficient evidence exists
- human approval is required

---

# Completion Validation

Before finishing verify

For every RESOLVED issue

- the implementation contains the required change
- the implementation still conforms to the Approved Plan
- Updated By exists
- Updated At exists
- Response exists

For every DISCUSS issue

- Response exists

The review report matches the current implementation.

Report location

- the report lives in `docs/superpowers/reviews/`
- the file name matches `YYYY-MM-DD-<topic>-review-code.md`
- no duplicate report exists for the same artifact

If validation fails, continue updating.

---

# Evidence Rule

Every decision must be supported by evidence.

Evidence may include

- Approved Plan
- Existing architecture
- Project conventions
- Source code

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

- Updating code but leaving Status as OPEN.
- Updating code but not updating Response.
- Creating a new Issue ID for an existing issue.
- Ignoring an OPEN issue.
- Recreating the review report.
- Removing resolved issues.
- Implementing behavior not defined by the Approved Plan.

---

# Forbidden

Never

- modify source code during review mode
- modify source code or the review report during scan mode
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
- mark RESOLVED without updating the code
- update the code without updating the review report (except the `scan` "fix now" path — see Scan Workflow)
- implement functionality outside the Approved Plan without discussion

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

**Calibration**

Only flag what would cause a real problem for the next execution. A wrong Status,
a missing Response, a dangling Location, or an issue so vague it cannot be acted
on — those are problems. Wording preferences and formatting are not.

Fix any issue inline, then move on. Do not re-run the full review.

This check runs in both modes, and it runs before the Git commit.

---

# Completion Criteria

The task completes only when

- every required issue has been processed
- implementation and review report are synchronized
- implementation conforms to the Approved Plan
- all validation rules pass

---

# Chat Output

## review

Review completed successfully.

Updated Code Review Report

docs/superpowers/reviews/YYYY-MM-DD-<topic>-review-code.md

## feedback

Feedback completed successfully.

Updated Source Code

<source code path>

Updated Code Review Report

docs/superpowers/reviews/YYYY-MM-DD-<topic>-review-code.md

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
