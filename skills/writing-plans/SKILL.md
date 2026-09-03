---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, the behavior to build in execution order, testing, docs they might need to check, how to test it. The plan carries the *skeleton* — files, signatures, behavior, test cases — not implementation code. See Plan Content Rules. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Context:** If working in an isolated worktree, it should have been created via the `superpowers:using-git-worktrees` skill at execution time.

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`
- (User preferences for plan location override this default)

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

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> This plan is intentionally skeleton-level: it specifies files, signatures, behavior and test cases, NOT implementation code. Read the real files before writing each task's code.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Spec:** [path to the spec/design doc this plan implements — the plan
argues from the spec, so the spec travels with it; executors read both]

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
git commit -m "feat: add specific feature"
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

## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `docs/superpowers/plans/<filename>.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?"**

**If Subagent-Driven chosen:**
- **REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development
- Fresh subagent per task + two-stage review

**If Inline Execution chosen:**
- **REQUIRED SUB-SKILL:** Use superpowers:executing-plans
- Batch execution with checkpoints for review
