# Writing Specs (architectural path only)

Read this when the brainstorming classification came out **architectural**
and you are about to explore approaches, present the design, or write the
spec document. Bounded, bug and spike tasks never write a spec — they must
not read this file.

**Language:** Write spec documents in Vietnamese — headings, prose, business
rules, edge cases, test case names. Talk to the user in Vietnamese. Keep code,
identifiers, file paths, commands and type names in their original form.

## Exploring approaches

- Propose 2-3 different approaches with trade-offs
- Present options conversationally with your recommendation and reasoning
- Lead with your recommended option and explain why
- YAGNI ruthlessly - remove unnecessary features from every approach and design

## Presenting the design

- Once you believe you understand what you're building, present the design
- Scale each section to its complexity: a few sentences if straightforward, up to 200-300 words if nuanced
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

## Spec Content Rules

A spec is a **Business Analyst document**, not a code sketch. It answers *what*
and *why*, never *how to write it*.

### 1. Depth: explain the logic, step by step

The value of a spec is in the reasoning an implementer cannot recover from the
codebase. Go as deep as you can here — this is the part worth spending on.

| Content | In the spec? |
|---|---|
| Goal, scope, explicit non-goals (YAGNI) | Required |
| Business rules and *why* each one exists | Required |
| User flows and the processing steps in execution order, numbered | Required |
| Edge cases, and the expected outcome for each one | Required |
| Error handling: which errors, which fields, what the user sees | Required |
| Architecture: the units, each unit's responsibility, boundaries, how they talk | Required |
| Data contracts / shapes (fields, types, meaning) — as a table or a short type | Required |
| Decisions made, the reasoning, and the alternatives rejected | Required |
| Function bodies, full components, implementation files | **Forbidden** |

Write the steps so a reader who has never seen the codebase can follow the
business logic end to end. "Validate the input" is not a step. "Reject when
`endDate` is earlier than `startDate`; return field-level error on `endDate`"
is a step.

### 2. Code: the one exception

A snippet of at most 10 lines, only when **both** hold:

1. It is special logic **just settled in this discussion** and confirmed by the
   user — a formula, rounding rule, regex, precedence order, value mapping.
2. Prose would be ambiguous, or longer than the snippet.

Add one line stating why it was settled that way; that reasoning is what the
plan and the implementer actually need.

Why the limit: code written at spec time is written blind. There is no codebase
open and no test run, so it gets rewritten during implementation anyway — you
pay the tokens twice and the first version is usually wrong. Only at
implementation time, with the real files and a passing test, is code trustworthy.

If you want to write code to *explore* a solution, the decision is not settled.
Ask the user, settle it in prose, then write the spec.

### 3. Removing code does NOT mean writing less

This is the single most common way to get this rule wrong. Dropping the code is
only half the instruction. The other half is mandatory:

> **Replace every deleted code block with the same logic re-expressed in
> Business Analyst language — the flow, in order, in words a non-programmer on
> the product side could follow and verify.**

You are changing the *language* the logic is written in, not the *amount* of
logic. A spec with code removed and nothing put back is a worse spec, and it
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

### 4. Testing: name the cases, do not write them

State the testing strategy and list the cases as plain text a human can read:

```
- rejects an end date earlier than the start date -> field error on endDate
- accepts an end date equal to the start date -> passes
- summary rows survive department filtering -> always kept
```

No test functions, no assertions, no framework syntax. A case is a sentence:
condition, then expected result.

## After the Design

**Documentation:**

- Write the validated design (spec) to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
  - (User preferences for spec location override this default)
- Commit the design document to git — immediately, not later

The Git gate from "Commits Apply To Every Path" in the brainstorming skill has
already been cleared by this point — if it has not, stop and clear it now.

**Commit format:** the **plan slug** is the spec filename minus `-design` and the
extension, **with the date kept** — `YYYY-MM-DD-<topic>`
(`2026-09-03-user-auth-design.md` -> `2026-09-03-user-auth`). Never strip the
date: topic names repeat, and two `user-auth` specs written months apart are
different work streams. The spec commit, the plan commit, every implementation
commit and every review commit reuse this slug, so
`git log --oneline --grep '\[2026-09-03-user-auth\]'` returns the entire stream.

```bash
git add docs/superpowers/specs/2026-09-03-user-auth-design.md
git commit -m "[2026-09-03-user-auth] Add design spec for JWT session handling

Plan: docs/superpowers/specs/2026-09-03-user-auth-design.md"
```

The full path belongs in the `Plan:` trailer, not the subject — the slug already
identifies the document, and the directory prefix would eat the width
`git log --oneline` has for the description.

Full rules: [commit-convention](../../qskill-executing-plans/references/commit-convention.md).

**Spec Self-Review:**
After writing the spec document, look at it with fresh eyes:

1. **Placeholder scan:** Any "TBD", "TODO", incomplete sections, or vague requirements? Fix them.
2. **Internal consistency:** Do any sections contradict each other? Does the architecture match the feature descriptions?
3. **Scope check:** Is this focused enough for a single implementation plan, or does it need decomposition?
4. **Ambiguity check:** Could any requirement be interpreted two different ways? If so, pick one and make it explicit.
5. **Code-bloat scan:** Every remaining code block must be either a data contract or special logic that was settled with the user, at most 10 lines. Otherwise delete it and replace it with a behavior description. Removing code must not make the spec vaguer — if a requirement becomes readable two ways once the code is gone, tighten the prose instead of putting the code back.

Fix any issues inline. No need to re-review — just fix and move on.

**User Review Gate:**
After the spec review loop passes, ask the user to review the written spec before proceeding:

> "Spec written and committed to `<path>`. Please review it and let me know if you want to make any changes before we start writing out the implementation plan."

Wait for the user's response. If they request changes, make them and re-run the spec review loop. Only proceed once the user approves.

**Implementation:**

- Invoke the qskill-write-ba-plan skill to create a detailed implementation plan
- Do NOT invoke any other skill. write-ba-plan is the next step.
