# Writing Research Docs (spike path only)

Read this when the brainstorming classification came out **spike** and the
probe is done. A spike's output is an answer, and an answer that lives only
in chat is lost by the next session — so the answer gets written down, the
same way a spec or a plan does.

Bounded and architectural tasks do not use this file: their record is the
plan (and the spec). A bug ends at a root cause and is re-classified; if the
investigation produced findings worth keeping beyond the fix, they belong in
the plan, not here.

**Language:** Write research documents in Vietnamese — headings, prose,
conclusions. Keep code, identifiers, file paths, commands, versions and
command output in their original form.

## Where it goes

**Save research docs to:** `docs/superpowers/research/YYYY-MM-DD-<topic>.md`
- (User preferences for research location override this default)

`<topic>` is the question being answered, not the technology alone —
`2026-09-08-jwt-refresh-feasibility.md`, not `2026-09-08-jwt.md`.

**Research slug:** the research filename minus the extension, **date
included** — `YYYY-MM-DD-<topic>`
(`docs/superpowers/research/2026-09-08-jwt-refresh-feasibility.md` ->
`2026-09-08-jwt-refresh-feasibility`). Every commit belonging to this spike
starts with `[YYYY-MM-DD-<topic>]`, exactly like a spec or plan slug, so
`git log --oneline --grep '\[2026-09-08-jwt-refresh-feasibility\]'` returns
the whole stream — including work that grows out of the spike later.

**Git gate:** it was already cleared when the path was classified. If it was
not, run `git rev-parse --git-dir` now and stop if this is not a repository.

## Document header

**Every research doc MUST start with this header:**

```markdown
# [Topic] Research

**Question:** [the one question this spike had to answer, in one sentence]

**Conclusion:** [the answer, in one or two sentences — readable without the rest]

**Research slug:** `YYYY-MM-DD-<topic>` — the research filename minus the
extension; every commit for this spike starts with `[YYYY-MM-DD-<topic>]`

**Probe code status:** [deleted | kept at `<path>`, labeled throwaway]

---
```

## Content rules

A research doc records **what you found and how you know it**. It is not a
design, not a plan, and it never grows into one — if the answer turns into
work, that work gets classified and gets its own plan.

| Content | In the research doc? |
|---|---|
| The question, and why it was worth asking | Required |
| What you tried — commands, files read, versions, environment | Required |
| Evidence: real command output, error messages, measured numbers | Required |
| The answer, stated plainly, including "no" and "it depends on X" | Required |
| What is still unknown, and what would settle it | Required |
| Recommendation: what you would do next, and what you would not | Required |
| Where the probe code went — deleted, or kept and labeled throwaway | Required |
| A design, an architecture, a task breakdown | **Forbidden** — that is a spec or a plan |

Trim the evidence to what carries the conclusion: the failing lines of a stack
trace, the version numbers that matter, the one timing number that decided it.
Pasting a whole log is not evidence, it is noise.

State negative results as plainly as positive ones. "It cannot be done with
the current version of the library, because X" is a complete, valuable spike
result — do not soften it into a plan for making it work anyway.

## Self-review

Before committing, read the doc once with fresh eyes:

1. **Answer check:** does `Conclusion` actually answer `Question`, on its own?
2. **Evidence check:** is every claim backed by something a reader can re-run
   or re-read? Remove or mark anything that is a guess.
3. **Placeholder scan:** any "TBD", "TODO", empty sections? Fix them.
4. **Scope check:** has a design or a task list crept in? Cut it — record only
   the recommendation.

Fix inline. No re-review.

## Commit

Commit the research doc immediately after writing it, before reporting
findings — together with anything from the probe that is being kept.
Throwaway probe code gets deleted first, not committed.

```bash
git add docs/superpowers/research/2026-09-08-jwt-refresh-feasibility.md
git commit -m "[2026-09-08-jwt-refresh-feasibility] Record the refresh-token spike findings

Plan: docs/superpowers/research/2026-09-08-jwt-refresh-feasibility.md"
```

Then run `git status --porcelain`. Anything still listed is unfinished: commit
it, or say explicitly what you left uncommitted and why.

Full rules: [commit-convention](../../qskill-executing-plans/references/commit-convention.md).

## If the spike turns into real work

The follow-up is a **new request** with its own classification and its own
approval — a spike being approved never approves the work it suggests.

When that work is planned, the plan's `Spec:` field reads
`none (spike)` followed by the path to this research doc and a sentence on
what it settled. The research doc is the reasoning record the plan argues
from, the way a spec would be.
