# Thiết kế: Q-SKILL — npx installer cài skill cho nhiều agent tool

## Bối cảnh

Repo hiện chứa 5 skill dạng Markdown (`skills/*/SKILL.md`, format YAML frontmatter + nội dung). Người dùng muốn đóng gói repo này thành một package chạy qua `npx`, để có thể cài đặt các skill đó vào thư mục cấu hình của nhiều agent tool khác nhau (Codex, Claude, Pi, Oh-My-Pi, CommandCode) chỉ bằng một lệnh, không cần cài đặt global trước.

## Mục tiêu

- Chạy `npx q-skill` (không cần cài global) để cài đặt các skill có sẵn trong repo vào thư mục skill của (các) agent tool mà user chọn.
- User chọn agent tool(s) muốn cài qua prompt tương tác (multi-select).
- User chọn phạm vi cài đặt: project (thư mục hiện tại) hay global (home directory), áp dụng cho tất cả tool đã chọn trong lần chạy đó.
- Tránh nhầm lẫn tên skill với skill trùng tên có sẵn trên máy user: tất cả skill trong package đổi tên với prefix `qskill-`.

## Ngoài phạm vi (out of scope)

- Không cần convert format skill giữa các tool — đã xác nhận cả 5 tool (claude, codex, pi, omp, commandcode) dùng chung format `SKILL.md` với YAML frontmatter (`---\nname:\ndescription:\n---`).
- Không tái tạo cơ chế symlink mà commandcode dùng (`~/.agents/skills/<name>` + symlink) — copy trực tiếp file vào `.commandcode/skills/<name>/`.
- Không có bước build/bundler — CLI viết thẳng bằng Node.js, không cần TypeScript compile.
- Không hỗ trợ gỡ cài đặt (uninstall) trong phạm vi này.

## Danh sách skill được cài (đổi tên theo prefix)

| Tên hiện tại | Tên mới (thư mục + frontmatter `name:`) |
|---|---|
| `brainstorming` | `qskill-brainstorming` |
| `writing-plans` | `qskill-writing-plans` |
| `executing-plans` | `qskill-executing-plans` |
| `review-plan` | `qskill-review-plan` |
| `review-code` | `qskill-review-code` |

Cả tên thư mục lẫn field `name:` trong frontmatter của từng `SKILL.md` đều đổi theo prefix này, để agent tool liệt kê/gọi skill (vd `/qskill-brainstorming`) không bị nhầm với skill trùng tên khác đã có sẵn trên máy user.

## Path mapping theo agent tool

| Tool | Local (project, thư mục hiện tại) | Global (home directory) |
|---|---|---|
| Claude | `.claude/skills` | `~/.claude/skills` |
| Codex | `.codex/skills` | `~/.codex/skills` |
| Pi | `.pi/agent/skills` | `~/.pi/agent/skills` |
| Oh-My-Pi (omp) | *(dùng chung path với Pi)* | *(dùng chung path với Pi)* |
| CommandCode | `.commandcode/skills` | `~/.commandcode/skills` |

Nếu user chọn cả Pi và Oh-My-Pi trong cùng một lần chạy, cả hai đều ghi vào cùng một thư mục đích (không ghi trùng lặp — dedupe theo path thực tế trước khi copy).

## Luồng thực thi CLI

1. User chạy `npx q-skill`.
2. Prompt 1 — **Multi-select**: "Chọn agent tool muốn cài skill" với các lựa chọn Codex / Claude / Pi / Oh-My-Pi (omp) / CommandCode.
3. Prompt 2 — **Single-select**: "Cài vào Project (thư mục hiện tại) hay Global (home directory)?" — áp dụng cho toàn bộ tool đã chọn ở bước 2.
4. CLI tính danh sách target path duy nhất (dedupe) dựa trên bảng path mapping + phạm vi đã chọn.
5. Với mỗi target path: tạo thư mục nếu chưa có, sau đó copy đệ quy từng thư mục skill (`qskill-*`) từ package vào `<target>/<skill-name>/`, ghi đè nếu đã tồn tại.
6. In log kết quả: liệt kê skill nào đã cài vào path nào, tổng kết cuối cùng.

## Cấu trúc package

```
q-skill/
├── package.json          # bin: "q-skill" -> bin/cli.js, type: module
├── bin/
│   └── cli.js             # entry point, shebang #!/usr/bin/env node
├── lib/
│   ├── prompts.js          # gói prompt logic (chọn tool, chọn scope)
│   ├── tool-paths.js        # bảng mapping tool -> local/global path
│   └── install.js          # logic copy skill vào target path
└── skills/
    ├── qskill-brainstorming/SKILL.md
    ├── qskill-writing-plans/SKILL.md
    ├── qskill-executing-plans/SKILL.md
    ├── qskill-review-plan/SKILL.md
    └── qskill-review-code/SKILL.md
```

- `package.json`: tên `q-skill`, `bin: { "q-skill": "bin/cli.js" }`, `type: "module"`, dependency duy nhất là `prompts` (thư viện prompt nhẹ, không cần dependency phức tạp).
- `files` field trong `package.json` chỉ include `bin/`, `lib/`, `skills/` để giữ package nhỏ gọn khi publish.

## Xử lý lỗi / edge case

- Nếu user không chọn tool nào ở Prompt 1 → báo lỗi ngắn gọn, thoát không làm gì (exit code khác 0).
- Nếu target directory không có quyền ghi → in lỗi rõ ràng kèm tên path, tiếp tục xử lý các target còn lại (không dừng toàn bộ vì 1 path lỗi).
- Nếu skill đã tồn tại tại target → ghi đè, không hỏi xác nhận (hành vi cài/update transparent, giống các npx installer thông thường).

## Kiểm thử

- Test thủ công: chạy `node bin/cli.js` (hoặc `npm link` rồi `npx q-skill`) trong một thư mục tạm, chọn từng tổ hợp tool + scope, xác nhận đúng file được copy vào đúng path với tên đã đổi prefix.
- Không cần unit test tự động cho phạm vi này (CLI nhỏ, chủ yếu I/O filesystem) — có thể bổ sung sau nếu cần.
