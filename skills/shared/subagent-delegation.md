# Subagent Delegation

> **Shared guide** (not a standalone skill). Read when a skill says to delegate
> work to subagents. It is the single source of truth for: capability
> detection, agent selection, the lead contract, concurrency, and
> fallback on failure or quota exhaustion. **How** to delegate lives here;
> **whether** to lives in [subagent-gate.md](subagent-gate.md), and the answer
> there is the user's.

The main model is a **lead**, not a worker. Its job is to hold the plan, split
the work into tasks, dispatch them, and judge what comes back. Bulk reading,
bulk writing, and bulk searching belong to subagents — their context is
throwaway, the lead's is not.

## Step 1: Capability Check (before anything else)

Delegation is only available when the host actually exposes a subagent
mechanism. Check, once, at the start of the skill:

| Host | Mechanism | Available when |
|---|---|---|
| Claude Code | `Task` / `Agent` tool | the tool appears in the tool list |
| Codex | subagent / delegate tool | the tool appears in the tool list |
| Pi | subagent tool | the tool appears in the tool list |
| Oh-My-Pi (omp) | agent roles | role dispatch is exposed |
| CommandCode | subagent tool | the tool appears in the tool list |

**If no such tool is exposed, stop reading this guide and do the work
inline.** Never simulate a subagent by role-playing one in your own context,
and never claim work was delegated when it was not.

If the capability exists, it is available — not chosen. **Whether this run
delegates is the user's call: take the proposal to
[subagent-gate.md](subagent-gate.md) and get their answer before anything is
dispatched.** Inline until they choose subagents. Once they have, the rest of
this guide governs and the gate is not revisited.

A change to the **workspace** (a new branch or worktree) needs its own explicit
consent, owned by the skill that needs it.

## Step 1.5: Failure Policy (ask once, before the first dispatch)

Subagents can die on you — the agent errors out, the quota runs out, the
mechanism stops responding. The user may have walked away by then, so the
answer cannot wait until it happens: **ask before the first dispatch, then
never ask again in this session.**

Ask exactly this, as one question with two options:

> Delegating to subagents. If they fail (agent error or quota exhausted, and
> one retry fails too), should I **(A) stop and report**, or
> **(B) take over and finish the work myself**?

- **(A) Stop** — halt at the failed unit, leave completed work committed, and
  report what is done, what failed, and what remains. The session ends in a
  state the user can resume from.
- **(B) Take over** — the lead does the remaining work inline, at the lead's
  own token cost, and says so plainly in the final report.

Record the choice at the top of your todo list or progress ledger so it
survives compaction. Apply it without asking again.

**If the user does not answer** — they are away, which is exactly the case
this question exists for — default to **(A) stop and report**. Never leave a
task hanging on an unanswered question: a stopped task with a clear report is
recoverable, a silent hang is not.

Whichever policy applies, a failure is always reported. It is never absorbed
into the lead without the user learning that the delegation failed.

## Step 2: Agent Selection

Every dispatch runs on a named **agent** — an agent type, named agent, or role
the host exposes to you in this session. This guide defines no roles and no
models of its own: the agent's own definition decides how it runs. Pick the
agent per kind of work (implementer, reviewer, researcher, searcher), before
the first dispatch:

1. **Match by name.** Read the agents the host actually exposes. When one's
   name — backed by its description — fits the work (`code-reviewer` for a
   review, `Explore` for a codebase search, `Plan` for design work), that agent
   does the work. Name it in the gate proposal so the user sees it.
2. **No match → the user picks from a menu.** List the agents you can observe,
   each with a one-line note on what it is good for, mark one recommendation,
   and ask — in the same message as the gate proposal and the Step 1.5 failure
   policy. One stop, all the answers.

```
Agent — no agent here is named for <kind of work>, pick one:
  A. <name>  — <one line: what it is good for>   <- recommended
  B. <name>  — <one line>
Run on A? (ok / B / ...)
```

Present it in Vietnamese, like everything else you say to the user; the shape
above is the shape, not the wording. One candidate is still a menu — name it
and ask for a yes. List only agents you have seen exposed in this session;
never invent one. A menu, not an open "which agent do you want?": the user
cannot see the host's roster, so an open question stalls the run.

**If the user does not answer the agent question, run inline** and say why,
exactly as an unanswered gate does. **If the host exposes the mechanism but
names no agents at all**, say so and dispatch on its default agent, naming it
in the proposal.

Once settled, the choice holds for the rest of the session: that agent on every
dispatch of that kind of work, and Step 6 / Step 7 use it without asking again.
Pass the agent explicitly on every dispatch, and leave its model to its own
definition.

## Step 3: The Lead Contract

The lead does exactly five things:

1. Reads the source document (spec, plan, bug report) **once**.
2. Splits the work into tasks and writes them into the todo list.
3. Writes a dispatch prompt per task and dispatches it.
4. Reads what comes back and judges it against the requirement.
5. Integrates, commits, and reports.

The lead does **not** do the task's own reading, searching, or writing when a
subagent could. If you catch yourself opening the fifth file to answer a
question a subagent was dispatched to answer, you have stopped being the lead.

**Exception — work too small to delegate.** Dispatching costs a prompt and a
round trip. A single-line edit, one file read you already know the path of, or
a question you can answer from what is already in context is done inline. Use
delegation for units of work worth their own context, not for every keystroke.

## Step 4: Concurrency

Two modes. The skill you are running says which one applies.

### Serial — one agent at a time

Used when the units of work touch the same files, or each depends on the state
the previous one left behind. **Plan execution is always serial**: parallel
implementers on one worktree corrupt each other's edits.

Dispatch one agent, wait for its report, judge it, then dispatch the next.

### Parallel fan-out — many agents at once

Used when the units are genuinely independent: separate research questions,
separate files to analyse, separate sections to draft, separate review axes.

- Dispatch them in one batch so they run concurrently. **One message, every
  dispatch in it** — that is what makes them concurrent, and it is also how you
  collect them: the whole batch blocks, and every report arrives together in
  that turn's results. No waiting step to write, no status to check.
- **Do not use background dispatch for a batch you need this turn.** Background
  dispatch hands you a name instead of a report, which leaves nothing to block
  on — and an agent with nothing to block on invents a sleep-and-check loop
  (forbidden in Step 6). Background dispatch is for work you will genuinely
  leave running while you do something else, not for fan-out you are about to
  read. If you catch yourself asking "how do I wait for these?", you dispatched
  them the wrong way: re-dispatch as one blocking batch.
- Keep the batch to a size you can actually adjudicate — roughly 3–6 at once.
  Beyond that the lead becomes the bottleneck and the reports blur together.
- Every parallel agent writes to a **different** output file. Two agents
  writing the same file is a lost report, not a merge.
- Independence is a property you check, not one you assume. If two units would
  edit the same file, they are not independent — run them serially.

## Step 5: Dispatch Prompt Contract

Every dispatch, in either mode, contains exactly these parts:

1. **One line of scene-setting** — where this unit fits in the whole.
2. **The requirement, as a file path** when it is longer than a few lines
   ("read this first — it is your requirements, use its values verbatim").
3. **What the subagent cannot know**: interfaces, decisions, and constraints
   established outside its unit.
4. **The output contract**: the exact file path to write its full result to,
   and what to return in the reply (status, one-line summary, blockers — not
   the full result).
5. **The agent** to run on (Step 2).

Never paste session history, prior-task summaries, or accumulated context into
a dispatch. A fresh agent needs its unit, its interfaces, and its constraints.
Nothing else.

## Step 6: Handling What Comes Back

### Waiting is an event, never a poll

A dispatched subagent reports back on its own. The host delivers that report —
as the tool result for a blocking dispatch, or as a completion notification for
a background one. **Waiting means doing nothing until that arrives.**

**Never sleep-then-check.** A `sleep 30` followed by a status read is not
waiting; it is a turn. Every such turn re-sends the whole conversation and
re-reads the dispatch you were trying to keep out of context, so a loop of them
costs more than the work being waited on — and it learns nothing the arriving
report would not have told you for free.

So, while a subagent is outstanding:

- Do not sleep, do not busy-wait, do not read its output file "to see how far it
  got", do not re-dispatch it because it feels slow.
- Do the independent work that does not depend on its result, or say plainly
  that you are waiting and stop.
- **Check status only when the user asks.** That is the one trigger. If they ask
  before the report lands, say it is still running — never guess at its result,
  and never write the notification yourself.

The single exception is a deadline the host cannot signal: work outside the
host's tracking (a CI run, a deploy, a remote queue) that emits no completion
event. There, one check timed to how fast that state actually changes — not a
tight loop.

Subagents report one of four statuses. Handle each:

- **DONE** — read the output file, judge it against the requirement, integrate.
- **DONE_WITH_CONCERNS** — read the concerns first. Correctness or scope
  concerns get resolved before the result is accepted; observations are noted.
- **NEEDS_CONTEXT** — supply exactly what is missing, re-dispatch the same unit.
- **BLOCKED** — assess: missing context → re-dispatch with it; too hard for the
  agent → re-dispatch on a stronger agent (Step 7, Round 2); too large →
  split; source document
  wrong → escalate to the user.
- **No report at all** (the agent errored, timed out, or the quota is gone) —
  retry once on the same agent with the same prompt, then apply the Step 1.5
  failure policy.

Never re-dispatch an identical prompt to an identical agent after a BLOCKED.
Something must change.

## Step 7: Escalation Ladder (wrong result, repeated)

Step 6 handles a subagent that *says* it failed. This step handles the more
expensive case: the subagent reports DONE, the result is wrong, the fix is
wrong again. "Repeat until approved" with no bound burns unbounded rounds while
nobody is watching.

**A unit gets at most three rounds. Then it comes home to the lead.**

**Round 1 — fix.** Dispatch a fix subagent on the same agent, carrying the
findings verbatim. Normal loop.

**Round 2 — change one variable.** Re-dispatching the same prompt to the same
agent is forbidden. Change exactly one thing, and say which:
- the agent (another name-matched agent, or one the user picks from the
  Step 2 menu), or
- the size (split the unit), or
- the brief (rewrite it, when the ambiguity is in the requirement).

Two diagnostics pick the variable for you: the **same finding surviving two
rounds** means the brief is ambiguous — fix the brief, not the code. **New,
different findings every round** means the unit is too large — split it.

**Round 3 — goal-locked.** The last round is not a normal dispatch. It names a
single concrete, checkable goal — an exact output, an exact command that must
pass, an exact behaviour that must hold — and it binds the subagent to two
outcomes only:

- **DONE is allowed only when that goal is met.** A partial result, a "mostly
  working" result, or a result that changes the goalposts is not DONE.
- **Anything else is BLOCKED**, with what it got to and what stopped it.

Write the goal so a third party could check it without reading the diff. "Fix
the filter" is not a goal; "`npm test -- kpi.test.ts` passes, all 9 cases,
without changing the assertions" is.

**After Round 3 — the lead finishes it.** A BLOCKED at round 3 ends the
delegation for that unit. The lead does the work itself, inline, and:

- **runs to done without a reviewer** — there is no fourth round, no review
  loop, no further dispatch for this unit;
- **reports the takeover**: which unit, three rounds tried, what each changed,
  what the final blocker was;
- **hands the result to the user for review.** The user's review is the gate
  that replaces the subagent review loop. Say so explicitly when reporting.

**The takeover is scoped to that one unit.** The ladder counts per unit, not
per session: the lead finishes the blocked unit, and then **goes straight back
to dispatching** — the next unit starts at round 1, on the settled agent, like
nothing happened. One hard task does not turn the rest of the run into inline
work. The only thing that ends delegation for the whole session is the
mechanism itself dying (Step 1.5).

**Rounds are the real cost, not tokens per round.** A unit that reaches round 3
has cost an implementer, two to three reviews, and two fixes — several times
what implementing it once cost. If a run is burning quota, the loop is where it
went: a task a human would do in one pass does not consume a quota unless it
is being re-done. So treat a second round as a diagnosis, not a retry — it says
the brief was ambiguous or the unit too large, and fixing *that* is what stops
the burn. The three-round cap exists for exactly this reason; it is a spend
limit, not a patience limit.

**Relation to Step 1.5.** They cover different failures and do not compete:
Step 1.5 is the *mechanism* dying (agent error, quota gone — nothing ran); the
ladder is the mechanism working and producing wrong results. The ladder always
ends in lead takeover plus user review, whichever Step 1.5 policy is in force.

## File Handoffs

Everything pasted into a dispatch, and everything a subagent prints back,
stays in the lead's context for the rest of the session and is re-read on every
later turn. That is the cost delegation exists to avoid — so move bulk through
files:

- Requirements go in as a path.
- Results come back as a path.
- The reply carries status and a one-line summary only.

## Red Flags

**Never:**
- Delegate when the host exposes no subagent mechanism — do the work inline
  and say so.
- Claim work was delegated when it was done inline.
- Omit the agent on a dispatch.
- Pick an agent yourself when none is named for the work — list what you can
  see, recommend one, and let the user pick (Step 2).
- Ask the agent question open-endedly ("which agent do you want?") instead of
  offering named candidates with a marked recommendation.
- Name an agent you have not actually seen exposed in this session.
- Dispatch after the agent question went unanswered — unanswered means inline.
- Take over after a failure without the user's Step 1.5 policy saying so, or
  take over silently. Every failure is reported either way.
- Dispatch before the Step 1.5 failure policy has been asked.
- Leave the session hanging on an unanswered question — an unanswered failure
  policy defaults to stop-and-report.
- Run a fix/re-review loop past three rounds — round 3 is goal-locked, and a
  BLOCKED there means the lead finishes the unit itself (Step 7).
- Re-dispatch round 2 without changing the agent, the size, or the brief.
- Let a round-3 subagent report DONE without its named goal being met.
- Finish a lead takeover without telling the user it happened and that their
  review is now the only review that unit gets.
- Sleep, busy-wait, or poll a dispatched subagent's status. Wait for its
  report to arrive; check only when the user asks (Step 6).
- Run parallel agents that write to the same file, or that edit the same
  source file.
- Run plan execution in parallel.
- Paste prior-task history into a fresh dispatch.
- Dispatch before the user has chosen subagents for this run at
  [subagent-gate.md](subagent-gate.md) — availability is not a choice.
  (A new branch or worktree needs its own separate consent.)
