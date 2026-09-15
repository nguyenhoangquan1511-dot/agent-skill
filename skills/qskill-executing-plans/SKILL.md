---
name: qskill-executing-plans
description: Use when you have a written implementation plan to execute in a separate session with review checkpoints
---

# Executing Plans

## Overview

Load plan, review critically, execute all tasks, report when complete.

**Announce at start:** "I'm using the qskill-executing-plans skill to implement this plan."

**Default:** Run the process below inline, on the current branch. Delegating it to subagents is offered, never assumed — see [Step 0.5: Delegation Gate](#step-05-delegation-gate); the user's answer there decides the shape. Either way the workspace rule holds: current branch, no worktree without explicit user approval.

**Reference docs** (read on demand, they are not standalone skills):
- [../shared/subagent-gate.md](../shared/subagent-gate.md) — **required before any dispatch**: subagents or inline is the user's call
- [../shared/subagent-delegation.md](../shared/subagent-delegation.md) — **required once delegation is approved**: capability check, role selection, lead contract
- [references/subagent-driven-development.md](references/subagent-driven-development.md) — same-session execution via subagents
- [references/using-git-worktrees.md](references/using-git-worktrees.md) — isolated workspace setup
- [references/test-driven-development.md](references/test-driven-development.md) — TDD loop for each task
- [references/verification-before-completion.md](references/verification-before-completion.md) — evidence before claiming done
- [references/requesting-code-review.md](references/requesting-code-review.md) — dispatching a code reviewer
- [references/finishing-a-development-branch.md](references/finishing-a-development-branch.md) — merge / PR / cleanup
- [references/commit-convention.md](references/commit-convention.md) — **required**: Git gate + commit message format

## The Process

### Step 0: Git Gate

**REQUIRED REFERENCE:** [references/commit-convention.md](references/commit-convention.md).

Run `git rev-parse --git-dir`. If the working directory is not a Git repository,
STOP and ask the user to initialize Git before any work starts. Do not execute
the plan without version control.

### Step 0.5: Delegation Gate

**REQUIRED REFERENCES:** [../shared/subagent-gate.md](../shared/subagent-gate.md)
first, then [../shared/subagent-delegation.md](../shared/subagent-delegation.md)
once the user has chosen delegation.

Check whether the host exposes a subagent mechanism (Claude `Task`/`Agent`
tool, Codex / Pi / CommandCode subagent tool, Oh-My-Pi agent roles).

- **Not available →** execute inline yourself, following the process below.
  Say so in one line and do not raise the question again.
- **Available →** propose delegation at the gate and **stop for the answer**.
  Name the split you intend: one implementer per plan task, serial, on the
  current branch, on which role. Availability is not the decision; the user's
  answer is.
  - **User chooses subagents →** you are the lead: you read the plan, keep the
    todos and the ledger, dispatch one implementer per task, and judge every
    report. You do not write the task's code yourself. Follow
    [references/subagent-driven-development.md](references/subagent-driven-development.md)
    for the per-task loop, with the two overrides below.
  - **User chooses inline, or does not answer →** execute inline yourself. Do
    not propose it again this execution.

**Failure policy.** Ask the Step 1.5 question from
[../shared/subagent-delegation.md](../shared/subagent-delegation.md) in the
same message as the gate proposal — if the subagents fail outright, stop and
report, or take over inline? Ask the Step 2 model question there too when this
host names no default/backup pair — one stop, all the answers. Record the answers in the
progress ledger so it survives compaction, and apply it without asking again.
Unanswered defaults to stop-and-report: the user may be away, and a hung
execution they discover hours later is the worst outcome.

**Escalation ladder.** A task's fix/re-review loop is bounded at three rounds
(Step 7 of the shared guide): round 2 must change the role, the size, or the
brief; round 3 is goal-locked — the implementer may report DONE only if the
named, checkable goal is met, otherwise BLOCKED. A BLOCKED at round 3 ends the
delegation for that task: you implement it yourself, inline, with no further
review loop, then report the takeover — the user's review is the gate that
replaces it. **The takeover covers that task only** — the next task goes back
to a normal dispatch. Only a dead mechanism (Step 1.5) ends delegation for the
whole run.

**Override 1 — workspace.** `subagent-driven-development.md` assumes an
isolated workspace per task. That does not apply here: every implementer works
**inline on the current branch**, in the same working directory. The Workspace
Rule below governs, and a worktree or a new branch still needs explicit user
approval.

**Override 2 — serial only.** Plan execution is serial. One implementer at a
time: dispatch, wait for the report, review it, mark the task complete, then
dispatch the next. Never run two implementers at once — they would edit the
same working tree.

**Role selection.** On Oh-My-Pi, dispatch every implementer and reviewer on
role `task`, with role `tiny` as the backup used only when `task` errors or
runs out of quota. On other hosts, pick the role per the table in
[../shared/subagent-delegation.md](../shared/subagent-delegation.md).

### Step 1: Load and Review Plan
0. Derive the **plan slug** from the plan filename — extension removed, **date kept** (`docs/superpowers/plans/2026-09-03-user-auth.md` -> `2026-09-03-user-auth`) — and use it in every commit of this execution. Never strip the date; feature names repeat across plans.
1. Work inline on the current branch by default - do NOT create a worktree or a new branch on your own. Only if the current branch is unsuitable (e.g. you are on `main`/`master`) do you pause, explain why, and ask the user for permission; wait for explicit approval before creating a worktree or branch (see "Workspace Rule" below).
2. Read plan file
3. Confirm the plan was approved. If it was written in this same session, your human partner must have reviewed it and said yes (see the Plan Review Gate in qskill-write-ba-plan). If you cannot point to that yes, STOP and ask for it before anything else.
4. Review critically - identify any questions or concerns about the plan
5. If concerns: Raise them with your human partner before starting
6. If no concerns: Create todos for the plan items and proceed

### Workspace Rule (inline-first)

**Default: implement inline, right on the branch you are currently standing on.**

- Never create a git worktree, never create a new branch, never switch branches on your own initiative.
- If you are on `main`/`master` (or any branch where direct work is inappropriate), STOP and ask the user:
  - state which branch you are on and why working there is risky
  - propose the option (worktree or new branch) with a concrete name
  - wait for explicit user approval
- Only after the user agrees do you use [using-git-worktrees](references/using-git-worktrees.md). If the user declines, continue inline on the current branch.
- If a worktree is approved, place it under `.claude/worktrees/` with a descriptive name.

### Step 2: Execute Tasks

When delegating (Step 0.5), this loop belongs to the dispatched implementer —
you dispatch it, review its report, and record the result. When executing
inline, you run it yourself.

For each task:
1. Mark as in_progress
2. Follow each step exactly (plan has bite-sized steps)
3. Run verifications as specified
4. Commit the task's work with the plan slug in the subject (see Commit Convention below)
5. Mark as completed

### Step 3: Complete Development

After all tasks complete and verified:
- Run `git status --porcelain` — nothing produced by this execution may be left uncommitted or untracked
- **REQUIRED REFERENCE:** Follow [references/finishing-a-development-branch.md](references/finishing-a-development-branch.md)
- Verify tests, present options, execute choice

## Commit Convention

Every commit made during execution carries the plan slug so history can be
grouped from `git log --oneline` alone:

```
[<plan-slug>] <short description of what changed>

<optional body: why it changed>

Plan: docs/superpowers/plans/<plan-file>.md
Task: <task number>
```

`<plan-slug>` = plan filename with the extension removed and the date kept
(`2026-09-03-user-auth`). The full path stays in the `Plan:` trailer, not the
subject. Full rules, including the Git gate and the "nothing left uncommitted"
check, live in [references/commit-convention.md](references/commit-convention.md).

## When to Stop and Ask for Help

**STOP executing immediately when:**
- Hit a blocker (missing dependency, test fails, instruction unclear)
- Plan has critical gaps preventing starting
- You don't understand an instruction
- Verification fails repeatedly

**Ask for clarification rather than guessing.**

## When to Revisit Earlier Steps

**Return to Review (Step 1) when:**
- Partner updates the plan based on your feedback
- Fundamental approach needs rethinking

**Don't force through blockers** - stop and ask.

## Remember
- Review plan critically first
- Follow plan steps exactly
- Don't skip verifications
- Reference skills when plan says to
- Stop when blocked, don't guess
- Work inline on the current branch by default; never create a worktree or branch on your own
- Run inline unless the user chose subagents at the Delegation Gate — see [subagent-gate](../shared/subagent-gate.md); when they did, delegate one implementer at a time on the current branch
- Never start implementation on main/master branch without explicit user consent
- Stop before any work if the directory is not a Git repository
- Every commit starts with `[<plan-slug>]` (date included); nothing is left uncommitted at the end
