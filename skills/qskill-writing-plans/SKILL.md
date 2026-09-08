---
name: qskill-writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

**Ngôn ngữ:** Viết tài liệu plan bằng tiếng Việt — tiêu đề, diễn giải, business rule, edge case, tên test case.
**Ngôn ngữ:** Trao đổi với user bằng tiếng Việt. Giữ nguyên code, identifier, đường dẫn file, câu lệnh và tên type ở dạng gốc.

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, the behavior to build in execution order, testing, docs they might need to check, how to test it. The plan carries the *skeleton* — files, signatures, behavior, test cases — not implementation code. See Plan Content Rules. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the qskill-writing-plans skill to create the implementation plan."

**Context:** If working in an isolated worktree, it should have been created at execution time following [using-git-worktrees](../qskill-executing-plans/references/using-git-worktrees.md).

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`
- (User preferences for plan location override this default)

**Git gate:** Before writing anything, run `git rev-parse --git-dir`. If this is not a Git repository, STOP and ask the user to initialize Git first — see [commit-convention](../qskill-executing-plans/references/commit-convention.md).

**Plan slug:** the plan filename minus the extension, **date included** — `YYYY-MM-DD-<feature-name>` (`docs/superpowers/plans/2026-09-03-user-auth.md` -> `2026-09-03-user-auth`). Every commit belonging to this plan — the plan commit itself, each task commit, each review commit — must start with `[2026-09-03-user-auth]` so the whole work stream is groupable from `git log --oneline`. Never strip the date: feature names repeat, and two plans named `user-auth` written months apart are different work streams. State the slug explicitly in the plan document header.

## Scope Check

If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for. This is where decomposition decisions get locked in.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If the codebase uses large files, don't unilaterally restructure - but if a file you're modifying has grown unwieldy, including a split in the plan is reasonable.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Task Right-Sizing

A task is the smallest unit that carries its own test cycle and is worth a
fresh reviewer's gate. When drawing task boundaries: fold setup,
configuration, scaffolding, and documentation steps into the task whose
deliverable needs them; split only where a reviewer could meaningfully
reject one task while approving its neighbor. Each task ends with an
independently testable deliverable.

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use the qskill-executing-plans skill to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> This plan is intentionally skeleton-level: it specifies files, signatures, behavior and test cases, NOT implementation code. Read the real files before writing each task's code.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Spec:** [path to the spec/design doc this plan implements — the plan
argues from the spec, so the spec travels with it; executors read both]

**Plan slug:** `YYYY-MM-DD-<feature-name>` — the plan filename minus the
extension; every commit for this plan starts with `[YYYY-MM-DD-<feature-name>]`
in its subject line (see Commit Convention)

## Global Constraints

[The spec's project-wide requirements — version floors, dependency limits,
naming and copy rules, platform requirements — one line each, with exact
values copied verbatim from the spec. Every task's requirements implicitly
include this section.]

---
```

## Plan Content Rules

The plan describes the skeleton. It does **not** contain implementation code.

Why: code written into a plan gets rewritten during implementation — double the
tokens. Worse, planning-time code is written blind, with no codebase open and no
test run, so it rarely matches reality and the implementer edits it anyway. Code
is only trustworthy at implementation time, against real files and a passing test.

| Content | Allowed? |
|---|---|
| Exact file paths (Create / Modify `path:line`) | Required |
| Function/class/component names with signatures (params, return types) | Required |
| Prose describing the required behavior, numbered, in execution order | Required |
| Edge cases and the expected outcome for each | Required |
| Test cases as a text checklist: `case name -> expected` | Required |
| Commands to run tests / build / commit | Required |
| New type / interface / schema / enum / config definitions | Yes — contracts, not implementation |
| Snippet of at most 10 lines for special logic settled during brainstorming | Yes — see below |
| Full function bodies, full component files, full test files | **Forbidden** |

### The only exception for writing code

Both must hold:

1. It is special logic **explicitly discussed and confirmed** during brainstorming
   or in the spec — a formula, rounding rule, regex, sort order, value mapping.
   Not "here is how I would write it."
2. Prose would be ambiguous, or longer than the snippet.

At most 10 lines, containing only the special part — no surrounding boilerplate.
If both are not true, write prose.

### Removing code does NOT mean writing less

This is the single most common way to get this rule wrong. Dropping the code is
only half the instruction. The other half is mandatory:

> **Replace every deleted code block with the same logic re-expressed in
> Business Analyst language — the flow, in order, in words a non-programmer on
> the product side could follow and verify.**

You are changing the *language* the logic is written in, not the *amount* of
logic. A plan with code removed and nothing put back is a worse plan, and it
will be rejected.

BA language means: numbered steps in execution order, the condition for each
branch, what happens on each branch, what the caller/user ends up with, and what
happens when it goes wrong. Field names and values are welcome — they are domain
vocabulary, not code. Loops, syntax, and framework calls are not.

```
Code (forbidden here):
    for row in rows:
        if row.status == "draft" and row.owner_id != user.id:
            continue
        yield row

Vague (equally forbidden — this is the mistake):
    "Filter the rows appropriately based on the user"

BA language (required):
    1. Go through the rows in the order received.
    2. Skip a row when it is BOTH a draft AND owned by someone other than the
       current user — drafts are private to their owner until published.
    3. Keep every other row, including drafts owned by the current user.
    4. The original order is preserved; the input is never modified.
    5. If the row list is empty, the result is an empty list, not an error.
```

The BA version is *longer* than the code. That is expected and correct: it
carries the reasoning ("drafts are private until published") and the edge case
(empty list) that the code left implicit.

### Tests are a checklist, not code

List each case as a readable sentence with
its expected result. No test functions, no assertions, no framework syntax.

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Interfaces:**
- Consumes: [what this task uses from earlier tasks — exact signatures]
- Produces: [what later tasks rely on — exact function names, parameter
  and return types. A task's implementer sees only their own task; this
  block is how they learn the names and types neighboring tasks use.]

- [ ] **Step 1: Write the failing tests**

Add to `tests/path/test.py`. Cases that must pass:

- rejects an end date earlier than the start date -> field error on `endDate`
- accepts an end date equal to the start date -> passes
- summary rows survive department filtering -> always kept

- [ ] **Step 2: Run tests to verify they fail**

Run: `pytest tests/path/test.py -v`
Expected: FAIL with "function not defined"

- [ ] **Step 3: Write minimal implementation**

Add `filter_by_department(rows: list[KpiRow], dept_id: str) -> list[KpiRow]`
to `src/path/file.py`.

Behavior, in order:
1. Keep a row when `row.department_id == dept_id`.
2. Always keep rows where `row.type == "summary"`, whatever the department.
3. Must not mutate the input list — return a new one.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pytest tests/path/test.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "[<plan-slug>] add specific feature

Plan: docs/superpowers/plans/<plan-file>.md
Task: 1"
```
````

## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures** — never write them:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" — list every test case by name with its expected result
- "Similar to Task N" — restate it; the engineer may be reading tasks out of order
- References to types, functions, or methods not defined in any task

Skeleton is not the same as vague. Removing code means the prose must get
*tighter*, not looser. Calibration:

```
Too vague:    "Update the service to filter by department"
Too detailed: [30 lines of full TypeScript service code]
Right level:
   Modify: `src/services/kpi.ts`
   - Add `filterByDepartment(rows: KpiRow[], deptId: string): KpiRow[]`
   - Keep a row when `row.departmentId === deptId`; always keep rows where
     `row.type === 'summary'` regardless of department
   - Must not mutate the input array
```

## Self-Review

After writing the complete plan, look at the spec with fresh eyes and check the plan against it. This is a checklist you run yourself — not a subagent dispatch.

**1. Spec coverage:** Skim each section/requirement in the spec. Can you point to a task that implements it? List any gaps.

**2. Placeholder scan:** Search your plan for red flags — any of the patterns from the "No Placeholders" section above. Fix them.

**3. Type consistency:** Do the types, method signatures, and property names you used in later tasks match what you defined in earlier tasks? A function called `clearLayers()` in Task 3 but `clearFullLayers()` in Task 7 is a bug.

**4. Code-bloat scan:** Sweep the whole plan. For each remaining code block — is it a
type / interface / schema / config, or special logic confirmed during brainstorming at
most 10 lines? Keep it. Otherwise delete it and replace it with a behavior description
plus the signature. Deleting code must not make the plan vaguer; if removing a block
leaves a requirement open to two readings, tighten the prose instead of restoring it.

If you find issues, fix them inline. No need to re-review — just fix and move on. If you find a spec requirement with no task, add the task.

## Commit Convention

Every task's Commit step in the plan must use this format — no exceptions:

```
[<plan-slug>] <short description of what changed>

<optional body: why it changed>

Plan: docs/superpowers/plans/<plan-file>.md
Task: <task number>
```

The plan commit itself follows the same rule:

```bash
git add docs/superpowers/plans/2026-09-03-user-auth.md
git commit -m "[2026-09-03-user-auth] Add implementation plan for JWT session handling

Plan: docs/superpowers/plans/2026-09-03-user-auth.md"
```

The slug carries the date; the full path stays in the `Plan:` trailer, never in
the subject — `git log --oneline` has ~80 columns and the directory prefix is
identical on every commit.

Commit the plan document as soon as it is written — do not leave it uncommitted
while implementation starts. Full rules: [commit-convention](../qskill-executing-plans/references/commit-convention.md).

## Plan Review Gate

**The plan is not a green light. Writing it and executing it are two turns,
separated by your human partner's approval.**

After the plan is saved and committed, STOP. Report the path and ask for a
review — do not create execution todos, do not open an implementation file,
do not invoke qskill-executing-plans in the same turn:

**"Plan complete and saved to `docs/superpowers/plans/<filename>.md` (committed as `[<plan-slug>]`). Please review it and tell me if you want changes before I start implementing."**

Then wait. If your partner asks for changes, make them, re-commit the plan, and
ask again. Only an explicit yes opens the gate.

The gate is skipped **only** when your human partner said so themselves in this
session ("write the plan and just do it", "khỏi review, làm luôn"). Their silence
is not that instruction, and neither is an approval they gave earlier to
something else — the brainstorming design, the classification, a previous plan.

## Execution Handoff

Once your partner approves the plan:

**"Plan approved. Continuing with qskill-executing-plans."**

- **REQUIRED SKILL:** Use qskill-executing-plans.
- Do not ask the user to choose an execution approach — that decision is not
  theirs to make here. This is about *how* to execute (inline, worktree,
  subagents), never about *whether* the plan was approved.
- qskill-executing-plans works inline on the current branch by default — no worktree, no new branch. If the current branch is `main`/`master` or otherwise unsuitable, it stops and asks the user before creating one; no extra confirmation is needed here.

## Red Flags

| Thought | Reality |
|---------|---------|
| "They approved the design, so the plan is approved" | The design and the plan are two documents. Each gets its own yes. |
| "The plan just restates what we agreed — no need to review it" | The plan is where the agreement turns into file paths and task order. That is exactly what gets reviewed. |
| "I'll start task 1 while they read the plan" | Starting is the thing the gate blocks. Stop after the plan and wait. |
| "They said 'go ahead' at the start, that covers execution" | It covers writing the plan. Execution needs a yes on the written plan. |
| "They didn't reply, so it must be fine" | Silence is not approval. Ask again if you need to. |
