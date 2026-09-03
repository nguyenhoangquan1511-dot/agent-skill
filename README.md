# Q-SKILL

`q-skill` là công cụ cài đặt tương tác giúp copy các skill có sẵn trong repo này vào đúng thư mục cấu hình của agent tool bạn đang dùng: Codex, Claude, Pi, Oh-My-Pi (omp), hoặc CommandCode.

## Cách dùng

```bash
npx q-skill
```

Lệnh sẽ hỏi lần lượt:

1. **Chọn agent tool** muốn cài skill (có thể chọn nhiều tool cùng lúc).
2. **Chọn phạm vi cài đặt**: Project (thư mục hiện tại) hay Global (home directory).

Sau đó toàn bộ skill sẽ được copy vào đúng thư mục đích, ghi đè nếu skill đã tồn tại.

## Test local trước khi publish

Trong thư mục repo:

```bash
npx .
```

hoặc dùng `npm link` để link package cục bộ rồi gọi `npx q-skill` như bình thường.

## Danh sách skill đi kèm

Chỉ 6 skill sau hiện trong danh sách skill của agent:

- `qskill-brainstorming` — làm rõ ý tưởng thành spec
- `qskill-writing-plans` — viết implementation plan từ spec
- `qskill-executing-plans` — thực thi plan (kèm toàn bộ reference doc của pha thực thi)
- `qskill-review-plan` — review và cải thiện plan/spec
- `qskill-review-code` — review code so với plan đã duyệt
- `qskill-systematic-debugging` — tìm root cause trước khi fix

Tất cả skill đều đổi tên với prefix `qskill-` (cả tên thư mục lẫn field `name:` trong frontmatter) để tránh trùng tên với skill khác đã có sẵn trên máy bạn.

### Reference doc (không hiện trong danh sách skill)

Các workflow phụ nằm trong `qskill-executing-plans/references/`, chỉ được đọc khi skill chính trỏ tới — nhờ vậy danh sách skill không bị rối:

| File | Nội dung |
|---|---|
| `subagent-driven-development.md` | Thực thi plan bằng subagent trong cùng session |
| `using-git-worktrees.md` | Tạo workspace cô lập |
| `test-driven-development.md` | Vòng lặp TDD (kèm `testing-anti-patterns.md`) |
| `verification-before-completion.md` | Bắt buộc có bằng chứng trước khi báo xong |
| `requesting-code-review.md` | Điều phối code reviewer (kèm `code-reviewer.md`) |
| `finishing-a-development-branch.md` | Merge / PR / dọn dẹp branch |
| `implementer-prompt.md`, `task-reviewer-prompt.md`, `scripts/` | Prompt template và script hỗ trợ subagent |

## Bảng path cài đặt

| Tool | Local (project) | Global (home directory) |
|---|---|---|
| Claude | `.claude/skills` | `~/.claude/skills` |
| Codex | `.codex/skills` | `~/.codex/skills` |
| Pi | `.pi/agent/skills` | `~/.pi/agent/skills` |
| Oh-My-Pi (omp) | `.agents/skills` | `~/.agents/skills` |
| CommandCode | `.commandcode/skills` | `~/.commandcode/skills` |
