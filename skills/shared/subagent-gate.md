# Subagent Gate

> **Shared guide** (not a standalone skill). The entry door to
> [subagent-delegation.md](subagent-delegation.md): that file is the single
> source of truth for **how** to delegate, this one for **whether** to. Every
> skill passes through here before its first dispatch.

**Whether this run uses subagents is the user's decision, never the agent's.**
The capability check in Step 1 of the delegation guide says delegation is
*possible*. It never says it is chosen. Until the user chooses it, the work
runs inline.

A dispatch spends the user's tokens on a context they cannot see and reports
back a summary instead of the work. Choosing that shape silently hands them a
result whose cost and method they never agreed to. An available tool is not
permission to use it.

## The rule

Dispatch only when one of these is true **in the current run**:

- the user asked for subagents, parallel agents, or a specific agent by name;
- the user approved your proposal at this gate.

Anything else — inline. Approval given in an earlier run, an earlier plan, or
for an earlier task does not carry over. Silence is not approval.

## The proposal

Run the capability check first (delegation guide, Step 1). No mechanism, no
proposal: work inline and say so. With a mechanism, and with work actually
worth delegating, propose **once** — the split you intend, not an abstract
offer — and stop:

```
Proposing subagents: <why this work splits well, one sentence>
  Dispatch: <n> subagents, <serial | parallel> — <what each one does, one line each>
  Role/model: <the named default/backup pair, when this host has one;
               otherwise the candidates you can see, with your recommended
               default and backup, as a question>
  Workspace: <inline on the current branch | which worktree>

Subagents or inline? (subagents / inline)
```

Present it in Vietnamese, like everything else you say to the user; the labels
above are the shape, not the wording. Ask the Step 1.5 failure policy in the
same message, as a further question — **one stop, all the answers**, so an
approval leads straight into dispatching.

The Role/model line is an assertion only on a host this guide names both roles
for (omp: `task` / `tiny`). On every other host it is a **question**: which
model runs as default and which as backup is the user's to confirm, from the
candidates you can actually see. See Step 2 of the delegation guide — an
unanswered model question means inline, exactly like an unanswered gate.

Declined, or unanswered, means inline: proceed inline and do not propose that
dispatch again this run. Stopping here is never a reason to stop the work.

## What approval covers

| Approved | Covers |
|---|---|
| A named proposal | Exactly the dispatch described in it. A different unit of work, a different agent count, or a different workspace is a new proposal. |
| "Use subagents for this skill / this execution" | The whole run, including its follow-up dispatches (fix agents, reviewer agents) and the re-dispatches of the escalation ladder. |

Once approved, the delegation guide governs everything after: roles,
concurrency, the dispatch contract, the escalation ladder, the lead takeover.
None of those steps comes back here — the gate is crossed once per run.

A subagent executing a dispatched task follows the task it was given; this gate
binds the agent talking to the user.

## Never

- treat "the work looks parallel", an exposed agent tool, or a skill's own
  Delegation section as approval
- dispatch a subagent to decide whether to dispatch subagents
- state a role/model in the proposal as if it were settled, on a host with no
  named default/backup pair — offer the candidates you can see, with a marked
  recommendation, never pick quietly and never ask an open "which model?"
- create a worktree or a branch to host a dispatch the user has not approved
- report that work was done by subagents after the fact
