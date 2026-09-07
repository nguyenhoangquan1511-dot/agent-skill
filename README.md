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

## Cách dùng `qskill-brainstorming` (viết spec)

Gọi skill này **trước bất kỳ việc tạo mới nào** (feature, component, thay đổi hành vi) — skill tự chặn, không cho code/scaffold trước khi bạn duyệt ý định.

Skill tự phân loại request thành 1 trong 3 nhánh, nói to phân loại đó ra cho bạn override nếu sai:

| Nhánh | Khi nào | Kết quả |
|---|---|---|
| **Spike** | Câu hỏi khả thi ("có làm được không") | 2-3 câu hỏi + kế hoạch thử, không tạo file spec, không giữ code |
| **Bounded** | Sửa nhỏ trên flow **đã có sẵn** trong repo | Agent phải nói rõ "sẽ KHÔNG viết spec/plan", trình bày thiết kế ngắn trong chat, chờ bạn đồng ý **cả việc bỏ spec/plan lẫn thiết kế** rồi mới code |
| **Architectural** | Project/subsystem mới, thay đổi cách các thành phần ghép với nhau | Hỏi từng câu một → đề xuất 2-3 hướng → trình bày thiết kế theo từng phần, duyệt từng phần → ghi file spec |

Nhánh nào cũng phải dừng chờ bạn duyệt trước khi làm tiếp — kể cả việc "đơn giản".

### Phong cách viết spec (nhánh Architectural)

Spec ghi vào `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`, viết như **tài liệu Business Analyst**: trả lời *cái gì* và *tại sao*, không phải *code như thế nào*.

| Nội dung | Bắt buộc? |
|---|---|
| Goal, scope, non-goal | Bắt buộc |
| Business rule và lý do tồn tại của từng rule | Bắt buộc |
| User flow, các bước xử lý theo đúng thứ tự thực thi, đánh số | Bắt buộc |
| Edge case và kết quả mong đợi của từng case | Bắt buộc |
| Error handling: lỗi gì, field nào, user thấy gì | Bắt buộc |
| Data contract (field, type, ý nghĩa) | Bắt buộc |
| Function body, full component, file code hoàn chỉnh | **Cấm** |

Ngoại lệ duy nhất cho code: đoạn ≤10 dòng, chỉ khi đó là logic đặc biệt **vừa chốt trong cuộc trao đổi** (công thức, quy tắc làm tròn, regex...) và văn xuôi diễn đạt sẽ dài dòng/mơ hồ hơn.

Khi xoá 1 đoạn code ra khỏi spec, **bắt buộc** viết lại đúng logic đó bằng ngôn ngữ BA (các bước đánh số, điều kiện từng nhánh, kết quả từng nhánh) — xoá code mà không thay bằng gì là spec tệ hơn, sẽ bị coi là lỗi.

**Lý do của các quy tắc trên:** code viết lúc lập spec là code viết "mù" — chưa có codebase mở, chưa chạy test — nên khi vào giai đoạn implement gần như chắc chắn bị viết lại từ đầu, tốn token 2 lần và bản đầu thường sai. Code chỉ đáng tin khi viết lúc implement, với file thật và test đang chạy.

## Cách dùng `qskill-writing-plans` (viết plan)

Nhận input là spec (từ `qskill-brainstorming`) hoặc yêu cầu multi-step khác, xuất ra implementation plan tại `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`.

Nguyên tắc cốt lõi: **plan mô tả bộ khung (skeleton) — file nào, signature gì, hành vi gì, test case nào — không viết code implementation.**

| Nội dung | Cho phép? |
|---|---|
| Đường dẫn file chính xác (Create/Modify `path:line`) | Bắt buộc |
| Tên function/class/component kèm signature (param, return type) | Bắt buộc |
| Hành vi mô tả bằng văn xuôi, đánh số theo thứ tự thực thi | Bắt buộc |
| Edge case và kết quả mong đợi | Bắt buộc |
| Test case dạng checklist text: `tên case -> kết quả mong đợi` | Bắt buộc |
| Định nghĩa type/interface/schema/enum/config (contract, không phải implementation) | Được |
| Đoạn code ≤10 dòng cho logic đặc biệt đã chốt lúc brainstorming | Được, có điều kiện |
| Full function body, full component, full test file | **Cấm** |

Mỗi task được chia theo nguyên tắc **bite-sized** (mỗi step 2-5 phút: viết test fail → chạy xác nhận fail → code tối thiểu cho pass → chạy xác nhận pass → commit), và phải tự chứa đủ để 1 reviewer mới có thể duyệt/từ chối độc lập với task khác.

Cấm tuyệt đối các placeholder kiểu "TBD", "add validation", "tương tự Task N" — plan phải đủ chi tiết để một engineer chưa biết gì về codebase vẫn làm được.

**Lý do của các quy tắc trên:** giống spec — code viết vào plan sẽ bị viết lại lúc implement (tốn token gấp đôi), và code lúc lập plan viết "mù" nên thường sai so với thực tế file hiện có. Xoá code khỏi plan mà không viết lại bằng ngôn ngữ BA thì plan bị mơ hồ hơn, không phải gọn hơn.

Sau khi lưu plan, skill **handoff thẳng** qua `qskill-executing-plans` — không hỏi chọn cách thực thi. Mặc định thực thi **inline ngay trên nhánh hiện tại** (không tự tạo worktree/branch mới); nếu đang ở `main`/`master` hoặc nhánh không phù hợp, skill tự dừng lại hỏi bạn trước khi tạo branch/worktree. Chỉ khi bạn chủ động yêu cầu dùng subagent, skill mới rẽ sang chế độ Subagent-Driven (mỗi task 1 subagent riêng, dùng worktree cô lập).

## Cách dùng 2 skill review: `qskill-review-plan` và `qskill-review-code`

Hai skill này cùng cơ chế: gọi skill, nói rõ **role** muốn chạy (`review` / `feedback` / `scan`) và artifact cần review (Plan/Spec, hoặc thêm Source Code với `review-code`).

- `qskill-review-plan` — review Plan/Spec, **không đụng tới source code**.
- `qskill-review-code` — review source code implementation so với Plan đã duyệt.

Cả hai đều duy trì **1 file report duy nhất** cho mỗi artifact tại `docs/superpowers/reviews/`, là living document — không bao giờ bị ghi đè hay xoá issue cũ, chỉ cập nhật trạng thái.

### 3 role

| Role | Làm gì | Có sửa Plan/Code không? | Có ghi report không? |
|---|---|---|---|
| **review** | Phân tích toàn diện, phát hiện issue mới, đối chiếu lại issue cũ | Không | Có — ghi/cập nhật report |
| **feedback** | Xử lý từng issue đang `OPEN` trong report: sửa cho tới khi `RESOLVED`, hoặc chuyển `DISCUSS` nếu cần người quyết định | Có | Có — đồng bộ report theo từng thay đổi |
| **scan** | Phân tích đầy đủ như `review`, nhưng **chưa ghi report ngay** — tóm tắt số lượng issue theo mức độ rồi hỏi bạn muốn ghi report hay fix luôn | Chỉ khi bạn chọn "fix luôn" | Chỉ khi bạn chọn "ghi report"; nếu chọn "fix luôn" thì không bắt buộc |

**Khi nào dùng `scan`**: đây là role trung gian, dùng khi bạn chưa biết Plan/Code còn nhiều lỗi hay không và muốn quyết định hướng xử lý trước khi tốn 1 vòng review + feedback riêng biệt. Chạy `scan`, agent sẽ:

1. Phân tích đầy đủ (không rút gọn, không bỏ sót — cùng độ sâu với `review`).
2. Phân loại từng issue theo **Severity Scale** (bảng bên dưới).
3. In ra thống kê:
   ```
   Tổng: N issues — Critical: a, High: b, Medium: c, Low: d

   - [High] <location> — <problem 1 dòng>
   - [Critical] <location> — <problem 1 dòng>
   ```
4. Hỏi bạn chọn 1 trong 2, dùng lại đúng kết quả phân tích vừa có (không phân tích lại từ đầu):
   - **Ghi report** → tiếp tục như role `review`, tạo Issue ID và ghi vào report, chưa sửa gì.
   - **Fix luôn** → sửa trực tiếp Plan/Code cho các issue đã tìm thấy, không bắt buộc phải ghi report cho lượt này.

### Severity Scale (dùng chung cho cả 2 skill)

| Mức | Tiêu chí |
|---|---|
| **Low** | Không ảnh hưởng hành vi/kết quả — chỉ sai quy ước (style, naming, format...) |
| **Medium** | Case hiện tại đúng, nhưng có case/edge case chưa cover → tiềm ẩn sai |
| **High** | Sai hướng đã thống nhất trong Plan, hoặc chặn đứng main flow trong phạm vi task đang xét |
| **Critical** | Ảnh hưởng ra ngoài phạm vi task/feature, tới cả hệ thống: mất dữ liệu, lỗ hổng bảo mật, phá vỡ tính năng khác. Cân nhắc kỹ, không gán bừa |

"High trở lên" = High + Critical — dùng trong thống kê của role `scan`.

### Cung cấp Plan cho skill: không bắt buộc phải là đường dẫn chính xác

Khi gọi skill, bạn có thể đưa Plan vào bằng 1 trong 3 cách:

- **Đường dẫn file chính xác** → agent dùng thẳng, không tìm gì thêm.
- **Tên Specification**.
- **Tên tính năng/topic** (không phải path).

Nếu không phải path có sẵn, agent tự tìm theo thứ tự:

1. Soi các **commit git gần nhất** có thêm/sửa file dưới `docs/superpowers/plans/` và `docs/superpowers/specs/` khớp tên bạn đưa (vì Plan thường được commit ngay sau khi viết xong).
2. Nếu chưa ra, quét tiếp phần còn lại của `docs/`.
3. Ra đúng 1 kết quả → dùng luôn.
4. Ra nhiều kết quả gây nhầm lẫn → liệt kê để bạn chọn, agent không tự đoán.
5. Không ra kết quả nào → hỏi bạn xác nhận topic hoặc đưa path chính xác.

### Ví dụ gọi skill

```
Dùng qskill-review-plan, role scan, cho tính năng "user-auth"
```

```
Dùng qskill-review-code, role feedback, cho docs/superpowers/plans/2026-09-03-user-auth.md
```

## Bảng path cài đặt

| Tool | Local (project) | Global (home directory) |
|---|---|---|
| Claude | `.claude/skills` | `~/.claude/skills` |
| Codex | `.codex/skills` | `~/.codex/skills` |
| Pi | `.pi/agent/skills` | `~/.pi/agent/skills` |
| Oh-My-Pi (omp) | `.agents/skills` | `~/.agents/skills` |
| CommandCode | `.commandcode/skills` | `~/.commandcode/skills` |
