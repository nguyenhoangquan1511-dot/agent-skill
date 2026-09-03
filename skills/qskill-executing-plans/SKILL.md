---
name: qskill-executing-plans
description: Use when you have a written implementation plan to execute in a separate session with review checkpoints
---

# Executing Plans

## Overview

Load plan, review critically, execute all tasks, report when complete.

**Announce at start:** "I'm using the qskill-executing-plans skill to implement this plan."

**Note:** This workflow works much better when you have subagents (Claude Code, Codex CLI, Codex App, Copilot CLI, and Gemini CLI all qualify). If subagents are available, follow [references/subagent-driven-development.md](references/subagent-driven-development.md) instead of the process below, and tell your human partner why.

**Reference docs** (read on demand, they are not standalone skills):
- [references/subagent-driven-development.md](references/subagent-driven-development.md) — same-session execution via subagents
- [references/using-git-worktrees.md](references/using-git-worktrees.md) — isolated workspace setup
- [references/test-driven-development.md](references/test-driven-development.md) — TDD loop for each task
- [references/verification-before-completion.md](references/verification-before-completion.md) — evidence before claiming done
- [references/requesting-code-review.md](references/requesting-code-review.md) — dispatching a code reviewer
- [references/finishing-a-development-branch.md](references/finishing-a-development-branch.md) — merge / PR / cleanup

## The Process

### Step 1: Load and Review Plan
1. Work inline on the current branch by default - do NOT create a worktree or a new branch on your own. Only if the current branch is unsuitable (e.g. you are on `main`/`master`) do you pause, explain why, and ask the user for permission; wait for explicit approval before creating a worktree or branch (see "Workspace Rule" below).
2. Read plan file
3. Review critically - identify any questions or concerns about the plan
4. If concerns: Raise them with your human partner before starting
5. If no concerns: Create todos for the plan items and proceed

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

For each task:
1. Mark as in_progress
2. Follow each step exactly (plan has bite-sized steps)
3. Run verifications as specified
4. Mark as completed

### Step 3: Complete Development

After all tasks complete and verified:
- **REQUIRED REFERENCE:** Follow [references/finishing-a-development-branch.md](references/finishing-a-development-branch.md)
- Verify tests, present options, execute choice

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
- Never start implementation on main/master branch without explicit user consent
