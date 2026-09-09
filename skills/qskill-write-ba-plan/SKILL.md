---
name: qskill-write-ba-plan
description: Use when you have a spec or requirements for a multi-step task and the plan must be readable and verifiable by a non-programmer - behaviour only, no code, not even inline expressions
---

# Writing BA Plans

**Language:** Write plan documents in Vietnamese — headings, prose, business rules, edge cases, test case names.
**Language:** Talk to the user in Vietnamese. Keep identifiers, file paths, commands and domain field names in their original form.

## Overview

Write implementation plans that say **what the software must do**, never **what
to type**. Assume the engineer has zero context for our codebase: tell them
which files to touch for each task, the behaviour to build in execution order,
the edge cases, the test cases, how to verify. Assume a business analyst on the
product side will also read the plan, agree with it, and later check the built
software against it.

The plan carries **behaviour** — files, units, rules, outcomes, test cases. It
carries no code. See Plan Content Rules. Give the whole plan as bite-sized
tasks. DRY. YAGNI. TDD. Frequent commits.

**Announce at start:** "I'm using the qskill-write-ba-plan skill to create the implementation plan."

**Context:** If working in an isolated worktree, it should have been created at execution time following [using-git-worktrees](../qskill-executing-plans/references/using-git-worktrees.md).

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`
- (User preferences for plan location override this default)

**Git gate:** Before writing anything, run `git rev-parse --git-dir`. If this is not a Git repository, STOP and ask the user to initialize Git first — see [commit-convention](../qskill-executing-plans/references/commit-convention.md).

**Plan slug:** the plan filename minus the extension, **date included** — `YYYY-MM-DD-<feature-name>` (`docs/superpowers/plans/2026-09-03-user-auth.md` -> `2026-09-03-user-auth`). Every commit belonging to this plan — the plan commit itself, each task commit, each review commit — must start with `[2026-09-03-user-auth]` so the whole work stream is groupable from `git log --oneline`. Never strip the date: feature names repeat, and two plans named `user-auth` written months apart are different work streams. State the slug explicitly in the plan document header.

## Scope Check

If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for. This is where decomposition decisions get locked in.

- Design units with clear boundaries and well-defined responsibilities. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If the codebase uses large files, don't unilaterally restructure — but if a file you're modifying has grown unwieldy, including a split in the plan is reasonable.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Task Right-Sizing

A task is the smallest unit that carries its own test cycle and is worth a
fresh reviewer's gate. When drawing task boundaries: fold setup,
configuration, scaffolding, and documentation steps into the task whose
deliverable needs them; split only where a reviewer could meaningfully
reject one task while approving its neighbour. Each task ends with an
independently testable deliverable.

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- "Write the failing test" — step
- "Run it to make sure it fails" — step
- "Implement the minimal behaviour to make the test pass" — step
- "Run the tests and make sure they pass" — step
- "Commit" — step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use the qskill-executing-plans skill to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> This plan is intentionally written as behaviour only: it specifies files, units, rules, outcomes and test cases, NOT implementation code and NOT signatures. Read the real files before writing each task's code.

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

> Every line of a task describes observable behaviour, in the vocabulary of the
> problem domain. Nothing in the plan is written in the vocabulary of the
> programming language.

Domain vocabulary is welcome and encouraged: entity names, field names, status
values, error message text, screen names, exact numbers and units. Those are
facts about the product, and the engineer needs them. Language constructs are
not facts about the product.

| Content | Allowed? |
|---|---|
| Exact file paths (Create / Modify `path:line`) | Required |
| Unit names (function / class / component) as plain addresses | Required |
| What a unit takes, returns, and rules it obeys — stated in words | Required |
| Behaviour numbered in execution order, with every branch and its outcome | Required |
| Edge cases and the expected outcome for each | Required |
| Test cases as sentences: `situation -> expected outcome` | Required |
| Commands to run tests / build / commit | Required |
| Data shapes as a field table (name, meaning, required, allowed values) | Required when a payload is agreed |
| Signatures with parameter and return types | **Forbidden** — say it in words |
| Type / interface / schema / enum / config blocks | **Forbidden** — use the field table |
| Any expression inside prose (see below) | **Forbidden** |
| Full function bodies, full component files, full test files | **Forbidden** |

Why: code written at planning time is written blind — no codebase open, no test
run — so it rarely matches reality and gets rewritten during implementation,
costing the tokens twice. Behaviour written at planning time is the part that
survives, because it is the part the product actually promised.

### Inline code is code too

This is the failure this skill exists to prevent. A plan with no fenced code
block is still a code plan when its sentences are written as expressions.

| Forbidden inside behaviour prose | Why |
|---|---|
| Call syntax — `doThing(...)`, `foo.bar(x)` | It dictates typing, not behaviour |
| Callbacks and arrows — `(curr) => ...` | Same |
| Casts and generics — `x as SomeResponse`, `Foo<Bar>` | Implementation detail of one language |
| Member chains and optional chaining — `data?.data`, `res.body.items` | The wire shape belongs in the field table, not in a step |
| Enum / constant access — `MessageType.Error` | State the meaning: "an error notification" |
| Framework and state APIs — hooks, setters, lifecycle names | One behaviour, many valid implementations |
| Comparisons and null checks — `a === b`, `x != null` | Say the condition in domain terms |

### Removing code does NOT mean writing less

This is the single most common way to get this rule wrong. Dropping the code is
only half the instruction. The other half is mandatory:

> **Replace every deleted expression with the same logic re-expressed in
> Business Analyst language — the flow, in order, in words a non-programmer on
> the product side could follow and verify.**

You are changing the *language* the logic is written in, not the *amount* of
logic.

```
Written in code (forbidden):
    message({ content: formatErrorGroups(groups), type: MessageType.Error })
    - no T616 toast, no onSuccess?.(), no onClose()
    const batch = data?.data as GoalMemberCloneForMembersResponse | undefined
    setSelectedMemberIds((curr) => getRemainingSelectedIds(curr, batch))

Vague (equally forbidden — this is the other mistake):
    "Handle the partial-failure case appropriately and update the selection"

BA language (required):
    When the clone request finishes and at least one member failed:
    1. Show ONE error notification listing the failed members, grouped by
       reason for failing.
    2. Do NOT show the success toast (T616), do NOT run the caller's success
       follow-up, and keep the dialog open — the user must still see who
       failed and be able to retry them.
    3. Drop from the selection every member that succeeded; the members that
       failed stay selected, so pressing the action again retries exactly them.
    4. If the response carries no result at all, treat it as "nothing
       succeeded": the selection is left untouched and the notification says
       nothing was cloned.
```

The BA version is *longer* than the code. That is expected and correct: it
carries the reasoning (retry exactly the failures) and the edge case (empty
response) that the code left implicit.

### Naming units without writing signatures

The engineer still needs to know where the work goes and what the pieces are
called. Give that as a contract stated in words:

```markdown
**Unit:** `getRemainingSelectedIds` in `src/features/goal/members/selection.ts`
- Takes: the member ids currently selected, and the result of one clone batch
- Returns: the ids that must stay selected
- Rule: an id is dropped only when that member is listed as succeeded in the
  batch; ids the batch says nothing about are kept
- Never changes the list it was given
```

Names and file paths are addresses, not code — keep them. Parameter lists,
types and return-type syntax are code — say them in words as above.

### Data shapes are tables, not type blocks

When a task needs an agreed payload, write a field table: field name, meaning,
required or optional, allowed values. The engineer writes the real type at
implementation time, against the real API.

| Field | Meaning | Required | Values |
|---|---|---|---|
| `success` | members cloned successfully | yes | list of member ids, may be empty |
| `failed` | members that could not be cloned | yes | list of member id + reason |

### Behaviour recipe

Each behaviour block is numbered steps in execution order, and must answer:

1. What triggers it.
2. What happens on the normal path, step by step.
3. Every branch: the condition in domain terms, and the outcome on each side.
4. What the user or caller ends up with — screen state, stored data, message.
5. What happens when it goes wrong, and what is left untouched.
6. Which invariants hold throughout (ordering, nothing mutated, idempotency).

### Tests are sentences, not code

Each case is one readable line with its expected result. No test functions, no
assertions, no framework syntax.

```
- clone finishes with 3 succeeded and 2 failed -> one error notification listing the 2, no success toast, dialog stays open
- the 3 succeeded members lose their selection -> only the 2 failed remain selected
- clone returns an empty result -> selection unchanged, notification says nothing was cloned
```

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Interfaces:**
- Consumes: [what this task uses from earlier tasks — unit name, what it takes
  and returns, in words]
- Produces: [what later tasks rely on — unit names, what they take and return,
  in words. A task's implementer sees only their own task; this block is how
  they learn the vocabulary neighbouring tasks use.]

- [ ] **Step 1: Write the failing tests**

Add to `tests/path/test.py`. Cases that must pass:

- an end date earlier than the start date -> rejected, error shown on the end date field
- an end date equal to the start date -> accepted
- summary rows during department filtering -> always kept

- [ ] **Step 2: Run tests to verify they fail**

Run: `pytest tests/path/test.py -v`
Expected: FAIL with "function not defined"

- [ ] **Step 3: Build the behaviour**

Unit: `filter_by_department` in `src/path/file.py`
- Takes: the KPI rows and one department
- Returns: the rows to display

Behaviour, in order:
1. Keep a row when it belongs to the requested department.
2. Always keep summary rows, whatever department they belong to.
3. Keep the original order; never modify the list that was passed in.
4. No matching rows means an empty result, not an error.

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
- References to units, fields or values not defined in any task

Behaviour-level is not the same as vague. Writing without code means the prose
must get *tighter*, not looser. Calibration:

```
Too code-y:   "call filterByDepartment(rows, deptId) and return rows.filter(...)"
Too vague:    "filter the rows by department"
Right level:
   Modify: `src/services/kpi.ts`
   Unit: filterByDepartment — takes the KPI rows and one department, returns
   the rows to display.
   1. Keep a row when it belongs to the requested department.
   2. Always keep summary rows, whatever department they belong to.
   3. Keep the original order; never modify the list that was passed in.
   4. No matching rows means an empty result, not an error.
```

## Self-Review

After writing the complete plan, look at the spec with fresh eyes and check the plan against it. This is a checklist you run yourself — not a subagent dispatch.

**1. Spec coverage:** Skim each section/requirement in the spec. Can you point to a task that implements it? List any gaps.

**2. Placeholder scan:** Search your plan for red flags — any of the patterns from the "No Placeholders" section above. Fix them.

**3. Vocabulary consistency:** Do the unit names, field names and status values used in later tasks match what earlier tasks introduced? A unit called `clearLayers` in Task 3 but `clearFullLayers` in Task 7 is a bug, and so is a field called `success` in one task and `succeeded` in another.

**4. Code sweep:** Search the plan for `(`, `=>`, `?.`, ` as `, `===`, `!==`, `null`, `undefined`, `interface`, `type `, and for CamelCase words followed by a dot. Every hit outside a file path, a unit name, or a shell command is a violation — rewrite that line in domain terms. Rewriting must not make the plan vaguer; if removing an expression leaves a requirement open to two readings, tighten the prose.

**5. BA readability:** Read each task as if you were the product owner. Any sentence you could not confirm or reject without opening the codebase is not behaviour — rewrite it.

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
session ("write the plan and just do it", "skip the review, go ahead"). Their silence
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
| "It's just one inline call, not a code block" | The rule is about language, not formatting. Rewrite it. |
| "The signature is the clearest way to say it" | Say takes / returns / rule in words. The engineer writes the signature. |
| "Removing the expression makes the plan vague" | Then the prose is unfinished. Tighten it; do not restore the code. |
| "The BA version is longer" | Expected. It carries reasoning and edge cases the code hid. |
| "The API field names are code" | Field names and values are domain vocabulary. Keep them. |
| "They approved the design, so the plan is approved" | The design and the plan are two documents. Each gets its own yes. |
| "I'll start task 1 while they read the plan" | Starting is the thing the gate blocks. Stop after the plan and wait. |
| "They didn't reply, so it must be fine" | Silence is not approval. Ask again if you need to. |
