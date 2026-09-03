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

- `qskill-brainstorming`
- `qskill-writing-plans`
- `qskill-executing-plans`
- `qskill-review-plan`
- `qskill-review-code`

Tất cả skill đều đổi tên với prefix `qskill-` (cả tên thư mục lẫn field `name:` trong frontmatter) để tránh trùng tên với skill khác đã có sẵn trên máy bạn.

## Bảng path cài đặt

| Tool | Local (project) | Global (home directory) |
|---|---|---|
| Claude | `.claude/skills` | `~/.claude/skills` |
| Codex | `.codex/skills` | `~/.codex/skills` |
| Pi | `.pi/agent/skills` | `~/.pi/agent/skills` |
| Oh-My-Pi (omp) | `.agents/skills` | `~/.agents/skills` |
| CommandCode | `.commandcode/skills` | `~/.commandcode/skills` |
