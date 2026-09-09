# AGENTS.md

Working rules for this repository (`q-skill` — the skill package installed into
Codex / Claude / Pi / Oh-My-Pi / CommandCode).

## Language rule (violated most often — read it first)

**Skill files are written entirely in English.** Everything under `skills/`
— `SKILL.md`, every file under `references/`, every file under `shared/` — is
English: prose, instructions, tables, red flags, template labels, headings,
example commit subjects, comments inside code blocks. No Vietnamese anywhere in
`skills/`, not even in an example.

Why: skill files are prompts read by the model. English keeps them closest to
the model's instruction-following distribution and to the wording of the tools
they orchestrate.

**The documents the skills produce are written in Vietnamese** — spec, plan,
research doc, review report — and the agent talks to the user in Vietnamese.
That is stated by the `**Language:**` lines inside each skill; those lines are
themselves written in English.

So the split is:

| What | Language |
|---|---|
| Files under `skills/` | English, always |
| Spec / plan / research doc / review report the skill produces | Vietnamese |
| Chat with the user | Vietnamese |
| Code, identifiers, paths, commands, type names, Issue IDs, Status values | Original form, never translated |

`README.md` is user-facing documentation for this repo and stays in Vietnamese.

Check before committing:

```bash
grep -rn "[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]" skills/
```

Any hit is a bug.

## Repository layout

- `skills/<skill-name>/SKILL.md` — a skill the agent lists and invokes.
- `skills/<skill-name>/references/*.md` — files read only when that skill points
  at them; they do not appear in the agent's skill list.
- `skills/shared/*.md` — guides shared by several skills. No `SKILL.md` there on
  purpose, so it is never listed as a skill.
- `bin/`, `lib/` — the npx installer. It copies every directory under `skills/`
  into the target skill directory, so relative links between skills
  (`../shared/review-common.md`, `../qskill-executing-plans/references/...`)
  resolve on the user's machine too.

## Single source of truth

A rule that applies to more than one skill lives in exactly one file, and the
others link to it. Do not restate it — a duplicated rule is a rule that will
drift.

Current shared homes:

- `skills/shared/review-common.md` — everything `qskill-review-plan` and
  `qskill-review-code` have in common.
- `skills/qskill-executing-plans/references/commit-convention.md` — commit
  format and plan slug, for every skill that commits.
- `skills/qskill-brainstorming/references/` — path-specific guides
  (`writing-specs.md` for architectural, `writing-research.md` for spike).

When a skill grows a section that another skill would need verbatim, move it to
a shared file and link both — do not copy.

## Documentation

Update `README.md` when a skill, a reference file, or a shared file is added,
removed, or changes role. The reference tables there are the map users read.
