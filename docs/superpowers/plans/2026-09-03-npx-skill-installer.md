# Q-SKILL npx installer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans-custom` to implement this plan.
> This plan is intentionally skeleton-level: it specifies files, signatures, behavior and test cases,
> NOT implementation code. Read the real files before writing each task's code.

**Goal:** Đóng gói repo `agent-skill` thành npm package `q-skill`, chạy qua `npx q-skill`, cho phép user chọn agent tool(s) (Codex, Claude, Pi, Oh-My-Pi, CommandCode) và phạm vi (project/global) để cài các skill có sẵn vào đúng thư mục cấu hình của tool đó.

**Architecture:** CLI Node.js thuần (ESM, không build step) gồm 1 entry point (`bin/cli.js`) gọi 3 module lib tách biệt theo trách nhiệm: `tool-paths.js` (mapping tool → path), `prompts.js` (hỏi user), `install.js` (copy file). Dữ liệu nguồn là 5 thư mục skill trong `skills/`, đổi tên với prefix `qskill-` (cả tên thư mục lẫn frontmatter `name:`).

**Tech Stack:** Node.js (ESM, `type: module`), dependency duy nhất `prompts` (thư viện prompt nhẹ).

**Spec:** `docs/superpowers/specs/2026-09-03-npx-skill-installer-design.md`

## Global Constraints

- Package name npm: `q-skill`. Lệnh chạy: `npx q-skill`.
- Tất cả skill đổi tên với prefix `qskill-` — cả tên thư mục lẫn field `name:` trong frontmatter `SKILL.md`.
- Không convert format skill giữa các tool (tất cả dùng chung `SKILL.md` + YAML frontmatter).
- Không tái tạo symlink pattern của commandcode — copy trực tiếp file.
- Không có build step / TypeScript compile.
- Không cần unit test tự động — verify bằng chạy CLI thủ công (theo spec, mục "Kiểm thử").
- Path mapping (local / global):
  - claude: `.claude/skills` / `~/.claude/skills`
  - codex: `.codex/skills` / `~/.codex/skills`
  - pi: `.pi/agent/skills` / `~/.pi/agent/skills`
  - omp: dùng chung path với pi
  - commandcode: `.commandcode/skills` / `~/.commandcode/skills`
- Nếu skill đã tồn tại tại target → ghi đè, không hỏi xác nhận.
- Nếu 1 target path lỗi (vd không có quyền ghi) → log lỗi, tiếp tục xử lý các target còn lại, không dừng toàn bộ.
- Nếu user không chọn tool nào → báo lỗi ngắn gọn, exit code khác 0.

---

### Task 1: Đổi tên thư mục skill + cập nhật frontmatter `name:`

**Files:**
- Modify (rename): `skills/brainstorming/` → `skills/qskill-brainstorming/`
- Modify (rename): `skills/writing-plans/` → `skills/qskill-writing-plans/`
- Modify (rename): `skills/executing-plans/` → `skills/qskill-executing-plans/`
- Modify (rename): `skills/review-plan/` → `skills/qskill-review-plan/`
- Modify (rename): `skills/review-code/` → `skills/qskill-review-code/`

**Interfaces:** Không có — đây là thao tác file/text thuần túy.

- [ ] **Step 1: Rename từng thư mục skill bằng `git mv`**

Chạy cho cả 5 thư mục:
```bash
git mv skills/brainstorming skills/qskill-brainstorming
git mv skills/writing-plans skills/qskill-writing-plans
git mv skills/executing-plans skills/qskill-executing-plans
git mv skills/review-plan skills/qskill-review-plan
git mv skills/review-code skills/qskill-review-code
```

- [ ] **Step 2: Cập nhật field `name:` trong frontmatter của mỗi `SKILL.md`**

Mỗi file có dòng `name: <ten-cu>` ở đầu file (giữa hai dòng `---`). Đổi giá trị đó thành `qskill-<ten-cu>` tương ứng với tên thư mục mới ở Step 1 (vd file `skills/qskill-brainstorming/SKILL.md` có `name: brainstorming` → sửa thành `name: qskill-brainstorming`). Không sửa gì khác trong file.

- [ ] **Step 3: Verify không còn tên cũ sót lại**

Chạy: `grep -rn "^name: " skills/*/SKILL.md`
Expected: mỗi dòng output đều có prefix `qskill-`, không có dòng nào thiếu prefix.

- [ ] **Step 4: Commit**

```bash
git add skills/
git commit -m "Rename skills with qskill- prefix to avoid collisions"
```

---

### Task 2: `lib/tool-paths.js` — mapping tool → target path

**Files:**
- Create: `lib/tool-paths.js`

**Interfaces:**
- Produces:
  - `export const TOOLS: Array<{ id: string, label: string, localDir: string, globalDir: string }>` — danh sách 5 tool chọn được trong prompt (`codex`, `claude`, `pi`, `omp`, `commandcode`), mỗi phần tử có `label` hiển thị cho user (vd "Oh-My-Pi (omp)") và `localDir`/`globalDir` là đường dẫn tương đối tính từ project root / home directory tương ứng bảng path mapping trong Global Constraints. Riêng `omp` dùng cùng `localDir`/`globalDir` với `pi`.
  - `export function resolveTargetPaths(selectedToolIds: string[], scope: 'local' | 'global', cwd: string, homeDir: string): string[]` — với mỗi tool id đã chọn, tra `TOOLS` lấy `localDir` hoặc `globalDir` theo `scope`, join với `cwd` (nếu local) hoặc `homeDir` (nếu global) thành absolute path, dedupe (loại path trùng nhau — trường hợp chọn cả `pi` và `omp`), trả về mảng path duy nhất.

- [ ] **Step 1: Viết `TOOLS` và `resolveTargetPaths`**

Dùng `path.join`/`path.resolve` của Node `path` module để build absolute path. Dedupe bằng `Set`.

- [ ] **Step 2: Verify thủ công bằng node REPL hoặc script nhỏ**

Chạy:
```bash
node -e "import('./lib/tool-paths.js').then(m => console.log(m.resolveTargetPaths(['pi','omp'], 'global', process.cwd(), '/home/test')))"
```
Expected: mảng chỉ có 1 phần tử `/home/test/.pi/agent/skills` (không bị trùng lặp dù chọn cả `pi` và `omp`).

- [ ] **Step 3: Commit**

```bash
git add lib/tool-paths.js
git commit -m "Add tool-paths mapping module"
```

---

### Task 3: `lib/install.js` — logic copy skill vào target path

**Files:**
- Create: `lib/install.js`

**Interfaces:**
- Consumes: không phụ thuộc Task 2 trực tiếp (nhận `targetPaths: string[]` đã resolve sẵn từ caller).
- Produces:
  - `export function installSkills(targetPaths: string[], skillsSourceDir: string): Array<{ targetPath: string, ok: boolean, installedSkills: string[], error?: string }>` — với mỗi `targetPath`: thử `fs.mkdirSync(targetPath, { recursive: true })`, đọc danh sách thư mục con trong `skillsSourceDir` (mỗi thư mục con là 1 skill `qskill-*`), với mỗi skill copy đệ quy bằng `fs.cpSync(path.join(skillsSourceDir, skillName), path.join(targetPath, skillName), { recursive: true, force: true })`. Nếu bất kỳ bước nào của 1 `targetPath` throw lỗi (vd permission denied) → catch, set `ok: false` và `error: <message>` cho phần tử đó, tiếp tục xử lý `targetPath` kế tiếp trong vòng lặp (không throw ra ngoài function).

- [ ] **Step 1: Viết `installSkills`**

- [ ] **Step 2: Verify bằng test thủ công trong thư mục tạm**

Chạy (giả định `skills/` đã có các thư mục `qskill-*` từ Task 1):
```bash
node -e "
import('./lib/install.js').then(m => {
  const res = m.installSkills(['/tmp/qskill-test-target'], './skills');
  console.log(JSON.stringify(res, null, 2));
});
"
ls /tmp/qskill-test-target
```
Expected: `res[0].ok === true`, `res[0].installedSkills` có đủ 5 tên `qskill-*`, và `ls` liệt kê đủ 5 thư mục con tương ứng, mỗi thư mục có file `SKILL.md`.

- [ ] **Step 3: Verify case lỗi (permission denied) không làm crash**

Chạy với 1 path không có quyền ghi (vd `/qskill-no-permission-test` ở root filesystem) xen giữa 1 path hợp lệ, xác nhận path hợp lệ vẫn được cài thành công và path lỗi có `ok: false` kèm `error` message, function không throw.

- [ ] **Step 4: Dọn thư mục test tạm và Commit**

```bash
rm -rf /tmp/qskill-test-target
git add lib/install.js
git commit -m "Add install module to copy skills into target paths"
```

---

### Task 4: `lib/prompts.js` — hỏi user chọn tool + scope

**Files:**
- Create: `lib/prompts.js`

**Interfaces:**
- Consumes: `TOOLS` từ `lib/tool-paths.js` (Task 2) để build danh sách lựa chọn multi-select (dùng field `id` và `label` của mỗi phần tử).
- Produces:
  - `export async function promptToolSelection(): Promise<string[]>` — dùng `prompts` package, type `'multiselect'`, `choices` build từ `TOOLS` (`title: tool.label, value: tool.id`), `min: 1` (bắt buộc chọn ít nhất 1). Nếu user hủy prompt (Ctrl+C, `prompts` trả về `undefined` cho field) → trả về mảng rỗng `[]`.
  - `export async function promptScope(): Promise<'local' | 'global'>` — dùng `prompts` type `'select'`, 2 choices: "Project (thư mục hiện tại)" → value `'local'`, "Global (home directory)" → value `'global'`. Nếu user hủy → trả về `undefined`.

- [ ] **Step 1: Viết `promptToolSelection` và `promptScope`**

- [ ] **Step 2: Verify thủ công**

Chạy: `node -e "import('./lib/prompts.js').then(async m => { console.log(await m.promptToolSelection()); console.log(await m.promptScope()); })"`
Thao tác: chọn Pi + Codex bằng phím space, Enter; sau đó chọn "Global".
Expected: dòng đầu in `[ 'pi', 'codex' ]`, dòng sau in `'global'`.

- [ ] **Step 3: Commit**

```bash
git add lib/prompts.js
git commit -m "Add interactive prompts for tool selection and scope"
```

---

### Task 5: `bin/cli.js` — entry point, nối các module lại

**Files:**
- Create: `bin/cli.js`

**Interfaces:**
- Consumes:
  - `promptToolSelection`, `promptScope` từ `lib/prompts.js` (Task 4)
  - `resolveTargetPaths` từ `lib/tool-paths.js` (Task 2)
  - `installSkills` từ `lib/install.js` (Task 3)
- Produces: không export gì (script thực thi trực tiếp).

- [ ] **Step 1: Viết shebang + luồng chính**

File bắt đầu bằng `#!/usr/bin/env node`. Luồng thực thi theo thứ tự Global Constraints + spec mục "Luồng thực thi CLI":
1. Gọi `promptToolSelection()`. Nếu mảng rỗng → in lỗi ngắn gọn ra `console.error` (vd "Bạn chưa chọn agent tool nào."), `process.exit(1)`.
2. Gọi `promptScope()`. Nếu `undefined` (user hủy) → `process.exit(1)` không log gì thêm (user đã tự hủy).
3. Tính `skillsSourceDir = path.join(import.meta.dirname hoặc path.dirname(fileURLToPath(import.meta.url)), '..', 'skills')`.
4. Gọi `resolveTargetPaths(selectedTools, scope, process.cwd(), os.homedir())` lấy `targetPaths`.
5. Gọi `installSkills(targetPaths, skillsSourceDir)` lấy `results`.
6. Với mỗi phần tử `results`: nếu `ok` → in `console.log` liệt kê `targetPath` + danh sách skill đã cài; nếu không `ok` → in `console.error` với `targetPath` + `error`.
7. In dòng tổng kết cuối: số path cài thành công / tổng số path.
8. `process.exit(0)` nếu có ít nhất 1 path thành công, ngược lại `process.exit(1)`.

- [ ] **Step 2: Cấp quyền thực thi cho file**

```bash
chmod +x bin/cli.js
```

- [ ] **Step 3: Verify chạy thử toàn bộ luồng trong thư mục tạm**

```bash
mkdir -p /tmp/qskill-e2e-test && cd /tmp/qskill-e2e-test
node /Users/nhquan/code/agent-skill/bin/cli.js
```
Thao tác: chọn Claude, chọn "Project". Expected: thư mục `/tmp/qskill-e2e-test/.claude/skills/` được tạo, chứa 5 thư mục con `qskill-*`, mỗi thư mục có `SKILL.md` với `name:` đúng prefix. CLI in log thành công và exit code `0` (`echo $?`).

- [ ] **Step 4: Dọn dẹp và Commit**

```bash
rm -rf /tmp/qskill-e2e-test /tmp/qskill-test-target
cd /Users/nhquan/code/agent-skill
git add bin/cli.js
git commit -m "Add CLI entry point wiring prompts and install logic"
```

---

### Task 6: `package.json` — metadata + bin + dependency

**Files:**
- Create: `package.json`

**Interfaces:** Không có (file cấu hình, không phải code).

- [ ] **Step 1: Viết `package.json`**

Nội dung bắt buộc:
- `"name": "q-skill"`
- `"version": "1.0.0"`
- `"description"`: mô tả ngắn gọn package (tiếng Anh, vì đây là metadata public trên npm)
- `"type": "module"`
- `"bin": { "q-skill": "bin/cli.js" }`
- `"files": ["bin", "lib", "skills"]`
- `"dependencies": { "prompts": "^2.4.2" }` (dùng version mới nhất ổn định hiện có trên npm tại thời điểm implement — kiểm tra bằng `npm view prompts version` nếu cần version chính xác hơn)
- `"engines": { "node": ">=18" }` (để đảm bảo hỗ trợ `fs.cpSync`, có từ Node 16.7+, và ESM top-level ổn định)

- [ ] **Step 2: Cài dependency**

```bash
npm install
```
Expected: `node_modules/prompts` được tạo, `package-lock.json` được tạo/cập nhật.

- [ ] **Step 3: Verify `npx .` chạy được package local**

```bash
mkdir -p /tmp/qskill-npx-test && cd /tmp/qskill-npx-test
npx /Users/nhquan/code/agent-skill
```
Thao tác: chọn Codex, chọn "Global" (test sẽ ghi vào `~/.codex/skills` thật trên máy — báo trước, hoặc dùng biến môi trường `HOME` giả lập nếu muốn tránh ghi vào home thật: `HOME=/tmp/qskill-fake-home npx /Users/nhquan/code/agent-skill`).
Expected: thư mục `.codex/skills` (dưới `HOME` tương ứng) chứa đủ 5 skill `qskill-*`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add package.json with bin entry and prompts dependency"
```

---

### Task 7: Cập nhật `README.md` — hướng dẫn sử dụng

**Files:**
- Modify: `README.md`

**Interfaces:** Không có.

- [ ] **Step 1: Viết nội dung README**

Nội dung cần có (tiếng Việt, theo CLAUDE.md của user):
- Giới thiệu ngắn: package `q-skill` cài các skill có sẵn vào thư mục cấu hình của Codex / Claude / Pi / Oh-My-Pi / CommandCode.
- Cách dùng sau khi publish: `npx q-skill`.
- Cách test local trước khi publish: `npx .` (chạy trong thư mục repo) hoặc `npm link`.
- Danh sách skill đi kèm (5 tên `qskill-*`).
- Bảng path mapping (copy từ spec).

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "Document q-skill usage in README"
```

---

### Task 8: Verify end-to-end toàn bộ tổ hợp tool + scope

**Files:** Không tạo/sửa file nguồn — chỉ chạy verify thủ công.

**Interfaces:** Không có.

- [ ] **Step 1: Test tổ hợp "chọn tất cả 5 tool, scope local"**

```bash
mkdir -p /tmp/qskill-full-test && cd /tmp/qskill-full-test
node /Users/nhquan/code/agent-skill/bin/cli.js
```
Thao tác: chọn cả 5 (Codex, Claude, Pi, Oh-My-Pi, CommandCode), chọn "Project".
Expected: có đúng 4 thư mục con được tạo dưới `/tmp/qskill-full-test/` — `.codex`, `.claude`, `.pi`, `.commandcode` (không có thư mục `.omp` riêng vì omp dùng chung path với pi), mỗi thư mục `skills/` con có đủ 5 `qskill-*`.

- [ ] **Step 2: Test case "không chọn tool nào"**

Chạy lại CLI, ở prompt multi-select nhấn Enter ngay không chọn gì.
Expected: CLI in lỗi rõ ràng, `process.exit` code khác 0 (`echo $?` != 0), không tạo file/thư mục nào.

- [ ] **Step 3: Test case ghi đè skill đã tồn tại**

Chạy CLI thêm 1 lần nữa với cùng target đã cài ở Step 1 (vd chỉ chọn Claude, scope local).
Expected: không có lỗi, log vẫn báo cài thành công (ghi đè im lặng theo Global Constraints).

- [ ] **Step 4: Dọn dẹp thư mục test**

```bash
rm -rf /tmp/qskill-full-test
```

- [ ] **Step 5: Commit (nếu Task 8 phát sinh sửa đổi để fix bug tìm thấy trong quá trình verify)**

Nếu Step 1–3 phát hiện bug ở các task trước, quay lại sửa file tương ứng, re-run bước verify liên quan, rồi:
```bash
git add -A
git commit -m "Fix issues found during end-to-end verification"
```
Nếu không phát hiện bug nào, không cần commit gì thêm — Task 8 kết thúc.
