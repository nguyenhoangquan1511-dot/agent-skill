---
name: qskill-review-plan
description: Review and continuously improve a Plan or Specification through iterative review cycles. Use after writing a plan/spec, before or during implementation.
---

# Skill: Review Plan

**Ngôn ngữ:** Viết review report bằng tiếng Việt — Problem, Recommendation, Response, và mọi phần diễn giải.
**Ngôn ngữ:** Trao đổi với user bằng tiếng Việt. Giữ nguyên code, identifier, đường dẫn file, câu lệnh, tên type, Issue ID và các giá trị Status (OPEN / RESOLVED / DISCUSS) ở dạng gốc.

## Objective

Review and continuously improve a Plan or Specification through iterative review cycles.

This skill has two execution modes:

- review
- feedback

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

# Required Inputs

Required

- Plan path

Optional

- Existing Plan Review Report

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
- update the Plan without updating the review report
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
