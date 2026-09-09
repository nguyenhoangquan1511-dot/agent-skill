# Review Common Rules

Shared rules for the review skills — `qskill-review-plan` and
`qskill-review-code`. Both skills run the same engine: three modes
(`review`, `feedback`, `scan`), one living review report, the same issue
model, the same Git rules. Only the artifact under review differs.

**This file is the single source of truth for everything below.** A rule that
applies to both skills is changed here, once. A skill's own SKILL.md carries
only what is genuinely specific to it.

**Language:** Write the review report in Vietnamese — Problem, Recommendation,
Response and every explanatory passage. Talk to the user in Vietnamese. Keep
code, identifiers, file paths, commands, type names, Issue IDs and Status
values (OPEN / RESOLVED / DISCUSS) in their original form.

---

# Bindings

The rules below are written against three placeholders. Each skill defines
them in its own "Bindings" section, and every occurrence here reads as that
skill's value.

| Placeholder | Meaning |
|---|---|
| **TARGET** | The artifact `feedback` edits to resolve issues — the Plan for review-plan, the source code for review-code. |
| **BASELINE** | What the review is judged against — the Specification and agreed direction for review-plan, the Approved Plan for review-code. |
| **SUFFIX** | The review report filename suffix — `-review-plan` or `-review-code`. |

---

# Execution Modes

Three modes. The user names one; never run two in a single execution.

## review

- Analyze TARGET against BASELINE.
- Detect new issues.
- Re-evaluate all existing issues.
- Synchronize issue status with the current state of TARGET.
- Update the review report only.

Review MUST NEVER modify TARGET.

## feedback

- Resolve review issues by updating TARGET.
- Synchronize the review report with every change to TARGET.
- Keep TARGET and the review report consistent at all times.

Feedback MUST update BOTH TARGET and the review report.

## scan

- Analyze TARGET as thoroughly as `review` (full depth, same evidence rules).
- Classify every finding using the Severity Scale.
- Summarize findings by severity count and list every High/Critical finding.
- Ask the user to choose exactly one next step: write the review report
  (`review`), or fix now (resolve directly, without requiring a report entry).

Scan MUST NEVER modify TARGET or the review report on its own. It ends with a
question, not with a report or a change to TARGET.

---

# Required Inputs

Required

- BASELINE
- TARGET

Optional

- Existing review report

If no review report exists, create one. Otherwise update the existing report.

---

# Plan Resolution

The Plan (or Specification) may be supplied as an exact file path, or as a
feature/topic name — it does not have to be a path.

When the given value is an existing file path, use it exactly as given — skip
the steps below.

When the given value is not an existing file path

1. Inspect the most recent Git commits for files added/modified under
   `docs/superpowers/plans/` and `docs/superpowers/specs/` matching the given
   Specification/feature name — a Plan is normally committed right after being
   written, so this is the primary source.
2. If nothing matches, search the rest of `docs/` for a file whose name or
   content matches the given Specification/feature name.
3. If exactly one candidate matches, use it.
4. If multiple candidates match, list the candidates and ask the user to pick
   one. Never guess.
5. If nothing matches, ask the user to confirm the topic or provide the exact
   path.

Do not start `review`, `feedback`, or `scan` until the file is confirmed.

When the skill defines its own Scan Target Resolution, that resolution runs
first for a bare `scan`, and this section resolves whatever Plan it points at.

---

# Review Report Location

The review report path is fixed. Never choose another location or name.

**Directory**

```
docs/superpowers/reviews/
```

This directory sits beside `docs/superpowers/plans/` and
`docs/superpowers/specs/`. Create it if it does not exist.

**File name**

```
YYYY-MM-DD-<topic>SUFFIX.md
```

`YYYY-MM-DD` and `<topic>` are copied verbatim from the artifact under review
(the Plan file name), so every execution resolves to the same file.

Example, with SUFFIX = `-review-plan`

```
docs/superpowers/plans/2026-09-03-user-auth.md
docs/superpowers/reviews/2026-09-03-user-auth-review-plan.md
```

**Name rules**

- Separator is the hyphen `-` only. Never `.`, never `_`, never a space.
- The only `.` in the whole name is the one before `md`.
- All lowercase. `<topic>` keeps the exact spelling used by the artifact.
- SUFFIX always sits last, right before `.md`.

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

Never derive the date from today. A report created on day one keeps its
original name forever — the date identifies the artifact, not the review run.

Before creating a report, list `docs/superpowers/reviews/` and check whether
the resolved file already exists. If it does, update it. Creating a second
report for one artifact violates the living-document rule.

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
| Low | No effect on behavior/outcome — only violates a convention (style, naming, wording, formatting...) |
| Medium | The current case behaves correctly, but an uncovered case/edge case could fail |
| High | Deviates from the direction already agreed in BASELINE, or blocks the main flow within the scope of the current task |
| Critical | Impact extends beyond the current task/feature to the whole system: data loss, security vulnerability, breaking another feature. Assign carefully — never by default |

"High or above" means High + Critical.

---

# Issue Lifecycle

```
OPEN -> RESOLVED     (feedback resolved it; TARGET has been updated)
OPEN -> DISCUSS      (human decision required)
```

No other transitions are allowed.

# Status

**OPEN** — the issue requires action.

**RESOLVED** — the issue has been accepted and TARGET has already been updated.

**DISCUSS** — a human decision is required.

---

# Review Workflow

1. Load BASELINE.
2. Load TARGET.
3. Load the existing review report if present.
4. Review TARGET in full against BASELINE.
5. Re-evaluate every existing issue.
6. Reuse existing Issue IDs.
7. Mark fixed issues as RESOLVED.
8. Keep unresolved issues OPEN.
9. Create Issue IDs only for newly discovered problems.
10. Update the review report.

Review never modifies TARGET.

---

# Feedback Workflow

1. Load BASELINE.
2. Load TARGET.
3. Load the review report.
4. Process every OPEN issue.
5. Never skip an OPEN issue.

For each OPEN issue

If the issue can be safely resolved

- Update TARGET.
- Update Status to RESOLVED.
- Update Updated By.
- Update Updated At.
- Update Response.

Otherwise

- Update Status to DISCUSS.
- Update Updated By.
- Update Updated At.
- Update Response.

When the execution ends, present every DISCUSS issue in chat — see Presenting
DISCUSS Issues. Do not end on a bare count.

---

# Scan Workflow

0. If the user gave no input, resolve the target first — see the skill's Scan
   Target Resolution.
1. Load BASELINE and TARGET.
2. Analyze TARGET with the same depth and evidence rules as `review` — do not
   hold back because the report will not be written yet.
3. Classify every finding using the Severity Scale. Do not create Issue IDs and
   do not write the review report at this stage.
4. Present a summary
   - Total count broken down by severity (Critical / High / Medium / Low).
   - If High + Critical > 0, list each one with its Location and a one-line
     Problem.
5. Ask the user to choose exactly one
   - **Write the report** — reuse the analysis just produced and continue with
     the Review Workflow (create Issue IDs, write the report). Do not
     re-analyze from scratch.
   - **Fix now** — reuse the analysis just produced and resolve the findings
     directly in TARGET, following the same per-issue resolution as the
     Feedback Workflow, except creating an Issue ID and writing the review
     report is optional for this pass. An existing report for this artifact, if
     any, may optionally note the fix as a supplement to its latest round.
6. Continue with whichever path was chosen. Scan itself never modifies TARGET
   or the review report.
7. Whichever path was chosen, any finding that cannot be resolved without a
   human decision is presented in chat — see Presenting DISCUSS Issues. A
   "fix now" pass that leaves such findings behind must present them, not just
   count them.

---

# Feedback Transaction

Processing an issue is atomic. These operations must complete together.

- Update TARGET
- Update Status
- Update Updated By
- Update Updated At
- Update Response

Updating only TARGET is invalid. Updating only the review report is invalid.

---

# Synchronization Invariant

TARGET and its review report must always represent the same state.

Whenever TARGET changes, the corresponding review issue must also be updated.

Whenever an issue becomes RESOLVED, the required change in TARGET must already
exist.

The task is incomplete if TARGET and the review report are inconsistent.

Exception: a `scan` execution that ends in "fix now" is not required to create
or update a review report entry for the issues it resolves (see Scan Workflow).

---

# Mandatory Issue Processing

Every OPEN issue encountered during feedback must end in exactly one state.

- RESOLVED
- DISCUSS

Leaving an OPEN issue unchanged after processing is not allowed.

---

# Decision Matrix

**RESOLVED** — use when

- the issue is valid
- TARGET has been updated

**DISCUSS** — use when

- business intent is unclear, or BASELINE is ambiguous
- multiple valid solutions exist
- insufficient evidence exists
- human approval is required
- the skill's own rules forbid the only edit that would resolve it

---

# Completion Validation

Before finishing verify

For every RESOLVED issue

- TARGET contains the required change
- TARGET still conforms to BASELINE
- Updated By exists
- Updated At exists
- Response exists

For every DISCUSS issue

- Response exists

The review report matches the current state of TARGET.

Report location

- the report lives in `docs/superpowers/reviews/`
- the file name matches `YYYY-MM-DD-<topic>SUFFIX.md`
- no duplicate report exists for the same artifact

If any validation fails, continue updating before completing.

---

# Evidence Rule

Every decision must be supported by evidence.

Evidence may include

- BASELINE
- Existing architecture
- Project conventions
- The current content of TARGET

Never invent requirements.

---

# No Hallucination Rule

Never invent

- business rules
- architecture decisions
- undocumented behavior
- project conventions

When evidence is insufficient, use DISCUSS.

---

# Failure Cases

Invalid examples

- Updating TARGET but leaving Status as OPEN.
- Updating TARGET but not updating Response.
- Creating a new Issue ID for an existing issue.
- Ignoring an OPEN issue.
- Recreating the review report.
- Removing resolved issues.
- Doing work that BASELINE does not call for.

---

# Forbidden

Never

- modify TARGET during review mode
- modify TARGET or the review report during scan mode
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
- mark RESOLVED without updating TARGET
- update TARGET without updating the review report (except the `scan` "fix now"
  path — see Scan Workflow)
- end an execution by reporting only the number of DISCUSS issues — every one of
  them is presented in the same message (see Presenting DISCUSS Issues)
- make the user ask a second time before you describe an issue they have to
  decide on

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

The skill may add rows to this table; run those too.

**Calibration**

Only flag what would cause a real problem for the next execution. A wrong
Status, a missing Response, a dangling Location, or an issue so vague it cannot
be acted on — those are problems. Wording preferences and formatting are not.

Fix any issue inline, then move on. Do not re-run the full review.

This check runs in every mode that writes something, and it runs before the Git
commit.

---

# Completion Criteria

The task completes only when

- every required issue has been processed
- every DISCUSS issue has been presented in chat, not just counted
- TARGET and the review report are synchronized
- TARGET conforms to BASELINE
- all validation rules pass

---

# Presenting DISCUSS Issues

Applies to `feedback`, and to the `scan` "fix now" path. Whenever an execution
ends with issues that need a human decision, **present them in chat, in the
same message that reports completion**. Never stop at "3 issues need
discussion" and wait for the user to ask what they are — the user cannot decide
anything from a count, and the extra round trip costs more than the presentation
would have.

For each DISCUSS issue, give the user what they need to answer without opening
the report:

1. **Issue ID + Severity + Location** — one line.
2. **Problem** — 1-2 sentences: what is wrong or undecided, concretely.
3. **Why it needs the user** — the missing piece: unclear business intent,
   several valid options, insufficient evidence, or a rule that forbids the only
   edit that would resolve it.
4. **Options** — the realistic options, one line each, with your
   recommendation and why. If there is genuinely one option and it just needs
   approval, say that instead.
5. **Question** — the exact question the user answers, phrased so a short reply
   settles it.

Aim for roughly 3-6 lines per issue: short enough to scan, complete enough to
decide on. Do not paste the report entry verbatim, and do not compress an issue
into a headline the user has to interpret.

Then close with one line offering more: say that the full entry (evidence,
affected locations, alternatives considered) is in the report and you can walk
through any issue in detail on request.

**When there are many DISCUSS issues**, present in full the Critical and High
ones, plus any Medium ones the user must resolve before work can continue —
capped at five presented in full. Summarize the rest in one line each (Issue ID,
Location, one-clause problem), and say the full presentation is available on
request.

---

# Chat Output

Report the outcome in the shape below; the skill fills in its own artifact
names.

**review**

```
Review completed successfully.

Updated Review Report
docs/superpowers/reviews/YYYY-MM-DD-<topic>SUFFIX.md
```

**feedback**

```
Feedback completed successfully.

Updated <TARGET path>

Updated Review Report
docs/superpowers/reviews/YYYY-MM-DD-<topic>SUFFIX.md

RESOLVED: <n> issues (Issue ID list)

Needs your decision (DISCUSS): <m> issues
<for each: the presentation described in Presenting DISCUSS Issues>

<one line: full entries are in the report; happy to go deeper on any of them>
```

If `<m>` is 0, drop the DISCUSS block entirely. If it is not 0, the block is
mandatory in this same message.

**scan**

```
Scan completed.

Summary: Critical: a, High: b, Medium: c, Low: d

<Location + one-line Problem for each High/Critical finding, if any>

Which do you want?
1. Write the review report
2. Fix now
```

If the "fix now" path runs and leaves findings that need a human decision, the
completion message for that pass carries the DISCUSS presentation too.

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
- scan, only when it continues into `review` or `feedback` — a scan left
  pending on the user's choice produces no commit

The commit must include every artifact modified during the execution.

Examples

- Review — the review report
- Feedback — TARGET, tests (if modified), the review report

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

Before starting a new execution, identify the latest Git commit.

Review the latest commit message to understand the purpose of the previous
execution.

Use Git diff against the latest commit to

- identify modified files
- understand previous changes
- optimize the review process

Git diff is an optimization only. The final validation must still review the
complete artifact.

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

Avoid generic messages such as `update`, `fix`, `changes`.

Full rules:
[commit-convention](../qskill-executing-plans/references/commit-convention.md).

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

If an artifact becomes inconsistent because of the change, update it during the
same feedback execution. Do not leave related artifacts out of sync.

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

If one artifact changes, every dependent artifact must be reviewed and updated
if necessary.

The task is incomplete until all affected artifacts are consistent.
