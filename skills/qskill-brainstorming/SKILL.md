---
name: qskill-brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

# Brainstorming Ideas Into Designs

**Ngôn ngữ:** Viết tài liệu spec bằng tiếng Việt — tiêu đề, diễn giải, business rule, edge case, tên test case.
**Ngôn ngữ:** Trao đổi với user bằng tiếng Việt. Giữ nguyên code, identifier, đường dẫn file, câu lệnh và tên type ở dạng gốc.

Help turn ideas into fully formed designs and specs through natural collaborative dialogue.

Start by classifying how much process the request needs, then work
through your path: understand the context, refine the idea, present a
design, and get your human partner's approval.

<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any
project, or take any implementation action until you have told your
human partner what you intend and they have approved it. This applies
to EVERY task on EVERY path below — the ceremony scales with the task;
the approval gate never does.
</HARD-GATE>

## Four Paths

Before your first question, classify the request and say the
classification out loud — "this looks bounded, so I'll go straight to a
short plan instead of writing a spec" — so your human partner can
override it:

- **Spike** — a feasibility question ("can we...", "is it possible...",
  "quick and dirty is fine") whose output is an answer, not code you
  keep. Present the question and what you'll try in 2-3 sentences, get
  a nod, then find out as cheaply as correctness allows. No design
  doc, no spec file. Report findings as a recommendation; anything you
  built stays labeled throwaway.
- **Bug** — một hành vi sai: lỗi runtime, kết quả sai, test fail,
  regression, thứ từng chạy được mà nay không. Đừng brainstorm thiết
  kế cho triệu chứng. Dừng path này lại và gọi skill
  `qskill-systematic-debugging` để tìm root cause trước. Khi đã có root
  cause, quay lại đây phân loại bản fix (thường là bounded, là
  architectural nếu phải đổi cấu trúc) rồi đi tiếp theo path đó.
- **Bounded** — a well-scoped change to code that already exists in
  this repo: a new flag, a small endpoint, a one-file fix.
  Understanding the kind of app is not enough — bounded means the flow
  you are changing is already here to read. If there is no existing
  flow to change, the task is not bounded. Hỏi những câu clarifying
  thật sự cần; trong chat CHỈ nêu những điểm cần user quyết (câu hỏi,
  lựa chọn, đánh đổi), không trình bày lại toàn bộ thiết kế. Khi không
  còn câu hỏi nào, KHÔNG viết spec — gọi thẳng skill
  `qskill-writing-plans` để viết một plan ngắn; skill đó lo việc ghi
  file, commit và đưa user review (xem "Bounded Goes To writing-plans").
- **Architectural** — new projects, new subsystems, changes that
  restructure how components fit together or alter interfaces others
  depend on. Follow the full process: questions, approaches, sectioned
  design, written spec, then the writing-plans skill.

When in doubt between two paths, take the heavier one. The ratchet is
one-way: hidden complexity discovered mid-task upgrades the path —
stop, say so, and step up. Nothing downgrades mid-task.

## Commits Apply To Every Path

**Read this while you classify — the commit rules bind every path, not just
the architectural one.** Skipping the full spec does not skip the commit; a
bounded fix landing uncommitted is exactly the mess this rule exists to
prevent.

**Git gate, before any path starts:** run `git rev-parse --git-dir`. If this is
not a Git repository, STOP and ask the user to initialize Git. Do not probe, do
not implement, do not write a spec. Without version control, several tasks pile
up in one working tree and the commits that eventually get made are dirty.

**Slug per path** — the subject prefix `[<plan-slug>]` is required either way:

| Path | Slug | What gets committed |
|---|---|---|
| **Spike** | `chore-YYYY-MM-DD` | Nothing, if the probe was truly throwaway — delete it. Anything you keep (a script, a note, a dependency bump) gets committed before you report findings. |
| **Bug** | theo path bản fix | Bug path tự nó không commit gì; nó kết thúc ở root cause. Bản fix commit theo path mà nó được phân loại lại (bounded hoặc architectural). |
| **Bounded** | `YYYY-MM-DD-<feature>` từ tên file plan | Theo luật của qskill-writing-plans / qskill-executing-plans: plan document trước, rồi từng task. `Plan:` trailer trỏ tới file plan. |
| **Architectural** | `YYYY-MM-DD-<topic>` from the spec filename | The spec document, immediately after writing it (see After the Design). |

Spike (chore slug, no document):

```bash
git add <files>
git commit -m "[chore-2026-09-03] Keep the token-expiry probe script

Throwaway spike kept at the user's request; no spec or plan document."
```

Bounded: không commit tay ở đây — skill `qskill-writing-plans` commit
plan document và `qskill-executing-plans` commit từng task, cùng slug lấy
từ tên file plan.

**Before reporting done on any path**, run `git status --porcelain`. Anything
still listed is unfinished work: commit it, or say explicitly what you left
uncommitted and why. Full rules:
[commit-convention](../qskill-executing-plans/references/commit-convention.md).

## Bounded Goes To writing-plans

Bounded không viết spec, nhưng vẫn phải để lại tài liệu — và tài liệu đó
là **plan**, không phải một loại file riêng.

Lý do: một task bounded vẫn có thể kéo dài nhiều session. Session sau mở
lên, user chạy `qskill-executing-plans` để làm tiếp; skill đó chỉ đọc
plan document ở `docs/superpowers/plans/`. Nếu thiết kế nằm trong một
file spec hay brief riêng thì không có gì để execute — nên bounded và
architectural cùng đổ về một dạng tài liệu duy nhất.

**Khi hết câu hỏi:** nói ngắn gọn rằng bạn chuyển sang viết plan, rồi
invoke skill `qskill-writing-plans`. Kể từ đó, mọi thứ — nội dung plan,
đường dẫn file, slug, commit, gate user review, bàn giao sang
`qskill-executing-plans` — theo đúng luật của skill đó. Đừng lặp lại hay
tự chế biến những luật đó ở đây.

**Khác biệt duy nhất so với architectural:** bounded không có spec
document, nên trong plan header, trường `Spec:` ghi `không có (bounded
task)` kèm một hai câu tóm tắt yêu cầu và lý do chọn cách làm này — đó là
mốc để sau này đọc lại và biết vì sao thay đổi được làm như vậy.

**Gate duyệt không đổi:** bạn không code trong lượt trình bày. Plan được
viết, được commit, user review plan, rồi mới implement.

## Anti-Pattern: "Too Simple To Need Approval"

Every path ends with your human partner approving your intent before
implementation. A todo list, a single-function utility, a config
change — the plan may be a few lines, but you MUST put it in front of
your human partner and get approval. "Simple" tasks are where unexamined assumptions
cause the most wasted work. What scales with simplicity is the
artifact, never the approval.

## Red Flags

| Thought | Reality |
|---------|---------|
| "This is too simple to need a design" | Simple means a short design, not no design. Một plan ngắn, rồi chờ duyệt. |
| "I'll call it bounded and skip the spec" | Reaching for a label to skip work IS the doubt — take the heavier path. |
| "Bounded nên khỏi ghi gì lại" | Bounded vẫn ra một plan qua qskill-writing-plans. Session sau còn có cái để execute. |
| "Thiết kế ngắn nằm trong chat rồi, khỏi viết plan" | Chat không tra cứu được sau ba tháng, và executing-plans không đọc được chat. |
| "Trình bày lại cả thiết kế trong chat cho chắc" | Chat chỉ để hỏi những gì user phải quyết. Thiết kế nằm trong plan. |
| "Bounded nhỏ nên tôi tự ghi file thiết kế riêng cho gọn" | Một dạng tài liệu duy nhất: plan. File riêng là file không skill nào chạy được. |
| "Nó chỉ là bug nhỏ, tôi đoán được chỗ sai" | Bug đi qua qskill-systematic-debugging trước. Đoán không phải root cause. |
| "It's bounded and the design is obvious — I'll start while they read it" | The gate is the approval, not the design's length. Present, then stop until you hear yes. |
| "I understand this kind of app, so it's bounded" | Bounded measures the repo, not your familiarity. A new project has no existing flow — it is architectural. |
| "The spike works, so I'll keep the code" | A spike's output is an answer. Keeping the code is a new request — classify it. |
| "It grew, but I'm almost done — no need to re-classify" | Hidden complexity upgrades the path mid-task. Stop and say so. |
| "They approved the spike, so the follow-up change is approved too" | Each task gets its own classification and its own approval. |
| "Không có spec nên không có slug để commit" | Spike dùng `chore-YYYY-MM-DD`; bounded dùng slug lấy từ tên file plan. Không có document không bao giờ nghĩa là không commit. |
| "It's a bounded one-file fix — the user can commit it" | The path that writes the file commits the file. Leaving it dirty is what makes later history unreadable. |
| "The spike code is throwaway, so I'll just leave it lying around" | Throwaway means deleted. Anything still on disk gets committed. |

## Checklist

Classify first, announce the path, then create a task for each item on
your path and complete them in order.

**Spike:**
1. **Explore project context** — enough to frame the probe
2. **Present question + probe plan** — 2-3 sentences
3. **Get approval** — a nod on the probe is enough
4. **Investigate** — as cheaply as correctness allows
5. **Commit or delete what you built** — throwaway probes get deleted; anything kept is committed as `[chore-YYYY-MM-DD]`, then `git status --porcelain` must be clean
6. **Report findings** — a recommendation; label anything built as throwaway

**Bug:**
1. **Invoke `qskill-systematic-debugging`** — trước mọi thứ khác; không đoán, không vá triệu chứng
2. **Report root cause** — nói rõ nguyên nhân thật và bằng chứng
3. **Re-classify the fix** — bounded hay architectural, rồi chạy đúng checklist của path đó (kể cả gate duyệt và tài liệu plan)

**Bounded:**
1. **Explore project context** — check files, docs, recent commits
2. **Ask clarifying questions** — one at a time, the ones that matter
3. **Chỉ nêu trong chat những điểm cần user quyết** — câu hỏi mở, lựa chọn phương án, đánh đổi; không trình bày lại toàn bộ thiết kế
4. **Invoke qskill-writing-plans** — khi hết câu hỏi; plan ngắn, `Spec:` ghi `không có (bounded task)` kèm tóm tắt yêu cầu và lý do chọn cách làm
5. **Từ đây theo luật của skill đó** — nó lo file plan, slug, commit, gate user review plan, rồi bàn giao sang qskill-executing-plans

**Architectural:**
1. **Explore project context** — check files, docs, recent commits
2. **Ask clarifying questions** — one at a time, understand purpose/constraints/success criteria
3. **Propose 2-3 approaches** — with trade-offs and your recommendation
4. **Present design** — in sections scaled to their complexity, get user approval after each section
5. **Write design doc** — save to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and commit it as `[<plan-slug>] ...` (see After the Design)
6. **Spec self-review** — quick inline check for placeholders, contradictions, ambiguity, scope (see below)
7. **User reviews written spec** — ask user to review the spec file before proceeding
8. **Transition to implementation** — invoke writing-plans skill to create implementation plan

## Process Flow

```dot
digraph brainstorming {
    "Classify: spike / bug / bounded / architectural" [shape=diamond];
    "Invoke qskill-systematic-debugging" [shape=box];
    "Report root cause; re-classify the fix" [shape=box];
    "Present question + probe (2-3 sentences)" [shape=box];
    "Ask clarifying questions (bounded)" [shape=box];
    "Nêu điểm cần user quyết" [shape=box];
    "Invoke writing-plans skill (bounded)" [shape=doublecircle];
    "Human approves probe?" [shape=diamond];
    "Investigate; report recommendation" [shape=doublecircle];
    "Explore project context" [shape=box];
    "Ask clarifying questions" [shape=box];
    "Propose 2-3 approaches" [shape=box];
    "Present design sections" [shape=box];
    "User approves design?" [shape=diamond];
    "Write design doc" [shape=box];
    "Spec self-review\n(fix inline)" [shape=box];
    "User reviews spec?" [shape=diamond];
    "Invoke writing-plans skill" [shape=doublecircle];
    "Hidden complexity? Upgrade path" [shape=box];

    "Classify: spike / bug / bounded / architectural" -> "Present question + probe (2-3 sentences)" [label="spike"];
    "Classify: spike / bug / bounded / architectural" -> "Invoke qskill-systematic-debugging" [label="bug"];
    "Classify: spike / bug / bounded / architectural" -> "Ask clarifying questions (bounded)" [label="bounded"];
    "Classify: spike / bug / bounded / architectural" -> "Explore project context" [label="architectural"];
    "Invoke qskill-systematic-debugging" -> "Report root cause; re-classify the fix";
    "Report root cause; re-classify the fix" -> "Classify: spike / bug / bounded / architectural";
    "Present question + probe (2-3 sentences)" -> "Human approves probe?";
    "Ask clarifying questions (bounded)" -> "Nêu điểm cần user quyết";
    "Nêu điểm cần user quyết" -> "Invoke writing-plans skill (bounded)" [label="hết câu hỏi"];
    "Human approves probe?" -> "Investigate; report recommendation" [label="yes"];
    "Hidden complexity? Upgrade path" -> "Classify: spike / bug / bounded / architectural";
    "Explore project context" -> "Ask clarifying questions";
    "Ask clarifying questions" -> "Propose 2-3 approaches";
    "Propose 2-3 approaches" -> "Present design sections";
    "Present design sections" -> "User approves design?";
    "User approves design?" -> "Present design sections" [label="no, revise"];
    "User approves design?" -> "Write design doc" [label="yes"];
    "Write design doc" -> "Spec self-review\n(fix inline)";
    "Spec self-review\n(fix inline)" -> "User reviews spec?";
    "User reviews spec?" -> "Write design doc" [label="changes requested"];
    "User reviews spec?" -> "Invoke writing-plans skill" [label="approved"];
}
```

**Terminal states are path-bound.** Architectural: the ONLY skill you
invoke after brainstorming is qskill-writing-plans — never any other
implementation skill. Bounded: cũng kết thúc ở qskill-writing-plans —
chỉ khác là không có spec document đi trước. Spike: the terminal
state is a reported recommendation. Bug: the terminal state is a root
cause plus a re-classification — the fix runs on its own path.

## The Process

The subsections below serve the bounded and architectural paths (a
spike stops at "present the probe, get a nod"). Sections from
**Exploring approaches** onward are architectural-path depth — for
bounded work, context plus a few questions plus a short in-chat design
is the whole process.

**Understanding the idea:**

- Check out the current project state first (files, docs, recent commits)
- Before asking detailed questions, assess scope: if the request describes multiple independent subsystems (e.g., "build a platform with chat, file storage, billing, and analytics"), flag this immediately. Don't spend questions refining details of a project that needs to be decomposed first.
- If the project is too large for a single spec, help the user decompose into sub-projects: what are the independent pieces, how do they relate, what order should they be built? Then brainstorm the first sub-project through the normal design flow. Each sub-project gets its own spec → plan → implementation cycle.
- For appropriately-scoped projects, ask questions one at a time to refine the idea
- Prefer multiple choice questions when possible, but open-ended is fine too
- Only one question per message - if a topic needs more exploration, break it into multiple questions
- Focus on understanding: purpose, constraints, success criteria

**Exploring approaches:**

- Propose 2-3 different approaches with trade-offs
- Present options conversationally with your recommendation and reasoning
- Lead with your recommended option and explain why
- YAGNI ruthlessly - remove unnecessary features from every approach and design

**Presenting the design:**

- Once you believe you understand what you're building, present the design
- Scale each section to its complexity: a few sentences if straightforward, up to 200-300 words if nuanced
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify if something doesn't make sense

**Design for isolation and clarity:**

- Break the system into smaller units that each have one clear purpose, communicate through well-defined interfaces, and can be understood and tested independently
- For each unit, you should be able to answer: what does it do, how do you use it, and what does it depend on?
- Can someone understand what a unit does without reading its internals? Can you change the internals without breaking consumers? If not, the boundaries need work.
- Smaller, well-bounded units are also easier for you to work with - you reason better about code you can hold in context at once, and your edits are more reliable when files are focused. When a file grows large, that's often a signal that it's doing too much.

**Working in existing codebases:**

- Explore the current structure before proposing changes. Follow existing patterns.
- Where existing code has problems that affect the work (e.g., a file that's grown too large, unclear boundaries, tangled responsibilities), include targeted improvements as part of the design - the way a good developer improves code they're working in.
- Don't propose unrelated refactoring. Stay focused on what serves the current goal.

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

---

## After the Design (architectural path)

**Documentation:**

- Write the validated design (spec) to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
  - (User preferences for spec location override this default)
- Commit the design document to git — immediately, not later

The Git gate from "Commits Apply To Every Path" has already been cleared by
this point — if it has not, stop and clear it now.

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

Full rules: [commit-convention](../qskill-executing-plans/references/commit-convention.md).

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

- Invoke the writing-plans skill to create a detailed implementation plan
- Do NOT invoke any other skill. writing-plans is the next step.
