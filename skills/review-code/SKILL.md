# Skill: Review Code

**Ngôn ngữ:** Viết review report bằng tiếng Việt — Problem, Recommendation, Response, và mọi phần diễn giải.
**Ngôn ngữ:** Trao đổi với user bằng tiếng Việt. Giữ nguyên code, identifier, đường dẫn file, câu lệnh, tên type, Issue ID và các giá trị Status (OPEN / RESOLVED / DISCUSS) ở dạng gốc.

## Objective

Review and continuously improve source code implementation through iterative review cycles.

This skill has two execution modes:

- review
- feedback

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

# Required Inputs

Required

- Approved Plan
- Source Code path

Optional

- Existing Code Review Report

If no review report exists, create one.
Otherwise update the existing report.

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
- update the code without updating the review report
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

---

# Git Integration

Every completed execution must end with exactly one Git commit.

This applies to both

- review
- feedback

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

Use a descriptive commit message.

The commit message should describe

- what changed
- why it changed

Avoid generic messages such as

- update
- fix
- changes

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
