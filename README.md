# Q-SKILL

`q-skill` là công cụ cài đặt tương tác giúp copy các skill có sẵn trong repo này vào đúng thư mục cấu hình của agent tool bạn đang dùng: Codex, Claude, Pi, Oh-My-Pi (omp), hoặc CommandCode.

## Cách dùng

```bash
npx q-skill
```

Lệnh sẽ hỏi lần lượt:

1. **Chọn agent tool** muốn cài skill (có thể chọn nhiều tool cùng lúc) — mặc định **tick sẵn tất cả tool**, cứ Enter là cài cho toàn bộ, muốn thu hẹp thì bỏ tick bớt.
2. **Chọn phạm vi cài đặt**: mặc định **Global (home directory)**, hoặc đổi sang Project (thư mục hiện tại).

Sau đó toàn bộ skill sẽ được copy vào đúng thư mục đích, ghi đè nếu skill đã tồn tại.

## Test local trước khi publish

Trong thư mục repo:

```bash
npx .
```

hoặc dùng `npm link` để link package cục bộ rồi gọi `npx q-skill` như bình thường.

## Danh sách skill đi kèm

Chỉ 7 skill sau hiện trong danh sách skill của agent:

- `qskill-brainstorming` — làm rõ ý tưởng thành spec
- `qskill-write-ba-plan` — viết implementation plan từ spec, thuần hành vi (BA), không code kể cả code inline. **Đây là skill mặc định các skill khác trỏ tới**
- `qskill-writing-plans` — bản plan cũ theo hướng skeleton (có signature, cho phép block type/contract); giữ lại cho ai cần
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

`qskill-brainstorming/references/` — chỉ đọc theo đúng nhánh đã phân loại:

| File | Nội dung |
|---|---|
| `writing-specs.md` | Nhánh architectural: explore approach, present design, luật nội dung spec, ghi + commit spec, self-review, review gate |
| `writing-research.md` | Nhánh spike: ghi research doc ở `docs/superpowers/research/`, cách đặt tên, nội dung, self-review, commit |

`shared/` — guide dùng chung cho nhiều skill, không phải skill:

| File | Nội dung |
|---|---|
| `review-common.md` | Toàn bộ luật chung của `qskill-review-plan` và `qskill-review-code`: 3 mode, Plan Resolution, vị trí/tên report, Issue Structure, Severity Scale, lifecycle, workflow, validation, self-review, Git + commit message. Sửa luật chung chỉ cần sửa file này |

## Cách dùng `qskill-brainstorming` (viết spec)

Gọi skill này **trước bất kỳ việc tạo mới nào** (feature, component, thay đổi hành vi) — skill tự chặn, không cho code/scaffold trước khi bạn duyệt ý định.

Skill tự phân loại request thành 1 trong 4 nhánh và nói to phân loại đó ra:

| Nhánh | Khi nào | Kết quả |
|---|---|---|
| **Spike** | Câu hỏi khả thi ("có làm được không") | 2-3 câu mô tả câu hỏi + cách thử, bạn gật là thử; kết quả ghi thành research doc ở `docs/superpowers/research/`, code thử là đồ bỏ |
| **Bug** | Sai hành vi: lỗi runtime, kết quả sai, test fail, regression | Không thiết kế cho triệu chứng — chuyển thẳng sang `qskill-systematic-debugging` tìm root cause, xong mới quay lại phân loại phần fix |
| **Bounded** | Sửa nhỏ trên flow **đã có sẵn** trong repo | Không viết spec, nhưng vẫn ra **plan** qua `qskill-write-ba-plan` (`Spec:` ghi `none (bounded task)`) |
| **Architectural** | Project/subsystem mới, thay đổi cách các thành phần ghép với nhau | Hỏi từng câu một → đề xuất 2-3 hướng → trình bày thiết kế theo từng phần, duyệt từng phần → ghi file spec → `qskill-write-ba-plan` |

### Gate xác nhận phân loại

Ranh giới bounded ↔ architectural do **ý định của bạn** quyết định, không do kích thước diff — nên agent không được tự quyết. Khi rơi vào một trong hai nhánh này, agent phải dừng lại hỏi bạn (kèm 1 câu lý do vì sao chọn nhánh đó), **đúng 2 option, một chiều mỗi bên**:

| Agent phân loại | Option 1 | Option 2 |
|---|---|---|
| **Bounded** | Đúng, tiếp tục | Nâng lên architectural |
| **Architectural** | Đúng, tiếp tục | Hạ xuống bounded |

Chưa có câu trả lời thì **chưa được làm gì** — không hỏi clarify, không explore context. Spike và bug bỏ qua gate này vì đã có gate riêng (spike chờ bạn gật kế hoạch thử; bug đi thẳng debugging skill).

Sau gate, ratchet **một chiều**: giữa chừng phát hiện phức tạp ẩn thì được nâng lên, không bao giờ tự hạ xuống. Gate là chỗ duy nhất một nhánh được hạ, và chỉ khi bạn hạ.

Nhánh nào cũng phải dừng chờ bạn duyệt trước khi implement — kể cả việc "đơn giản".

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

## Cách dùng `qskill-write-ba-plan` (viết plan thuần BA)

Cùng vị trí trong quy trình với `qskill-writing-plans` (input là spec, output là plan tại `docs/superpowers/plans/`), dùng khi bạn muốn plan **đọc được và nghiệm thu được bởi người không lập trình**.

Skill này **đứng độc lập** — không link ngược sang `qskill-writing-plans`, và là skill mà `qskill-brainstorming` / `qskill-executing-plans` / `qskill-review-plan` hiện trỏ tới. Các bước giống hệt (setup, header, chia task bite-sized, no-placeholder, self-review, commit convention, review gate, handoff), chỉ khác **cách viết**: mọi mô tả là logic nghiệp vụ chứ không phải code.

Khác biệt cốt lõi: plan **không chứa code, kể cả code inline**. Cấm cả những thứ mà quy tắc "không dump code" thường bỏ lọt:

| Bị cấm trong mô tả hành vi | Viết lại thành |
|---|---|
| `doThing(...)`, `foo.bar(x)` | mô tả việc gì xảy ra |
| `(curr) => ...` | quy tắc chọn/lọc bằng lời |
| `x as SomeResponse`, `data?.data` | mô tả dữ liệu nhận được, shape để ở bảng field |
| `MessageType.Error` | "hiện thông báo lỗi" |
| hook / state setter / API framework | trạng thái người dùng nhìn thấy sau đó |

Thay cho signature, mỗi unit được mô tả bằng: tên + file, **nhận gì / trả gì / quy tắc gì / bất biến gì** — viết bằng lời. Data shape viết dạng **bảng field** (tên field, ý nghĩa, bắt buộc/không, giá trị hợp lệ), không viết `interface`/`type`.

So với `qskill-writing-plans`: skill đó **bắt buộc** có signature kèm param/return type và cho phép block type/interface; skill này **cấm** cả hai.

Test case là câu văn `tình huống -> kết quả mong đợi`, không phải code test.

**Lý do:** bản BA dài hơn code là chuyện bình thường và đúng — nó mang theo lý do nghiệp vụ và edge case mà code giấu đi. Xoá code mà không viết lại bằng ngôn ngữ BA thì plan tệ hơn, không phải gọn hơn.

## Quy ước commit chung cho mọi skill

Mọi skill có tạo commit (`brainstorming`, `write-ba-plan`, `writing-plans`, `executing-plans`, `review-plan`, `review-code`) đều tuân theo cùng một chuẩn, để `git log --oneline` group được commit theo plan mà **không cần đọc nội dung commit**.

**Cổng chặn Git:** trước khi làm bất cứ việc gì sinh ra file, skill chạy `git rev-parse --git-dir`. Nếu thư mục chưa phải Git repo, skill **dừng lại** và yêu cầu bạn khởi tạo Git. Lý do: không có version control thì nhiều plan + nhiều fix dồn chung một working tree, commit sau đó bị bẩn, không tách được theo plan.

**Không để sót file:** mọi file skill tạo/sửa đều phải được commit — trong quá trình chạy hoặc ở cuối, tuỳ skill quy định. Trước khi báo hoàn thành, skill kiểm tra `git status --porcelain` phải sạch.

**Format commit message:**

```
[<plan-slug>] <mô tả ngắn cái gì đã đổi>   # vd: [2026-09-03-user-auth] Rotate refresh token

<body tuỳ chọn: vì sao đổi>

Plan: docs/superpowers/plans/<plan-file>.md
Task: <số task>
```

**Plan slug** là tên file plan bỏ đuôi file, **giữ nguyên ngày**:

| Artifact | Slug |
|---|---|
| `docs/superpowers/plans/2026-09-03-user-auth.md` | `2026-09-03-user-auth` |
| `docs/superpowers/specs/2026-09-03-user-auth-design.md` | `2026-09-03-user-auth` |
| Không có plan/spec (chore, tooling, docs) | `chore-YYYY-MM-DD` |

**Ngày là bắt buộc, không được cắt bỏ.** Tên feature hay bị trùng — hai plan `user-auth` viết cách nhau vài tháng là hai work stream khác nhau, khác task; bỏ ngày đi thì `git log --grep` gộp chung cả hai, group mất tác dụng. Với file spec chỉ bỏ hậu tố `-design`, không bỏ ngày.

Slug **không đổi** suốt work stream: commit spec, commit plan, các commit implement, các commit review đều dùng chung một slug.

Với `qskill-brainstorming`, không nhánh nào được bỏ commit — chỉ khác ở chỗ slug lấy từ tài liệu nào:

| Nhánh | Slug lấy từ |
|---|---|
| **Spike** | tên file research doc (`YYYY-MM-DD-<topic>`) |
| **Bounded** | tên file plan |
| **Architectural** | tên file spec (bỏ hậu tố `-design`), rồi đến plan |
| **Bug** | không có tài liệu riêng — nhánh này kết thúc ở root cause; slug theo nhánh mà phần fix được phân loại vào |

Không viết spec **không** đồng nghĩa với không có tài liệu, và càng không đồng nghĩa với không commit. Trước khi báo xong, mọi nhánh đều phải chạy `git status --porcelain` — còn gì trong đó là còn việc chưa xong.

**Vì sao path nằm ở body chứ không phải subject:** slug đã định danh duy nhất plan và tự suy ra được path, trong khi `docs/superpowers/plans/` lặp lại y hệt ở mọi commit và ngốn ~22 trong ~80 cột mà `git log --oneline` hiển thị, đẩy phần mô tả ra ngoài màn hình. Trailer `Plan:` vẫn giữ vì nó ghi path *thật* — phân biệt commit từ spec (`specs/...-design.md`) với commit từ plan (`plans/....md`), và vẫn đúng khi bạn đổi thư mục lưu tài liệu.

**Truy xuất lại:**

```bash
# toàn bộ 1 work stream (có ngày nên không đụng plan trùng tên ở thời điểm khác)
git log --oneline --grep '\[2026-09-03-user-auth\]'

# mọi work stream từng đụng tới feature này, xuyên các mốc ngày
git log --oneline --grep '\[[0-9-]*user-auth\]'
```

Quy tắc đầy đủ nằm ở `skills/qskill-executing-plans/references/commit-convention.md`.

## Cách dùng 2 skill review: `qskill-review-plan` và `qskill-review-code`

Hai skill này cùng cơ chế: gọi skill, nói rõ **role** muốn chạy (`review` / `feedback` / `scan`) và artifact cần review (Plan/Spec, hoặc thêm Source Code với `review-code`).

**Không nói role thì mặc định là `scan`.** Agent không được hỏi lại bạn muốn role nào, cũng không được suy từ cách bạn diễn đạt ("review giúp tôi" vẫn là `scan`) — chỉ role gọi tên rõ ràng mới tính. Lý do chọn `scan` làm mặc định: nó **không ghi gì cả**, kết thúc bằng câu hỏi ghi report hay fix luôn, nên đoán sai chỉ tốn một câu hỏi thay vì tốn một file report hoặc một lần sửa nhầm artifact.

- `qskill-review-plan` — review Plan/Spec, **không đụng tới source code**.
- `qskill-review-code` — review source code implementation so với Plan đã duyệt.

Cả hai đều duy trì **1 file report duy nhất** cho mỗi artifact tại `docs/superpowers/reviews/`, là living document — không bao giờ bị ghi đè hay xoá issue cũ, chỉ cập nhật trạng thái.

### 3 role

| Role | Làm gì | Có sửa Plan/Code không? | Có ghi report không? |
|---|---|---|---|
| **review** | Phân tích toàn diện, phát hiện issue mới, đối chiếu lại issue cũ | Không | Có — ghi/cập nhật report |
| **feedback** | Kiểm chứng từng issue đang `OPEN` trước khi làm theo: issue đúng thì sửa tới `RESOLVED`; issue sai thì phản biện, để nguyên artifact và đánh `INVALID` kèm bằng chứng; cần người quyết định thì `DISCUSS` | Có (trừ issue `INVALID` / `DISCUSS`) | Có — đồng bộ report theo từng thay đổi |
| **scan** | Phân tích đầy đủ như `review`, nhưng **chưa ghi report ngay** — tóm tắt số lượng issue theo mức độ, ước lượng công sức fix (độ phức tạp / số file / số dòng) kèm khuyến nghị, rồi hỏi bạn muốn ghi report hay fix luôn | Chỉ khi bạn chọn "fix luôn" | Chỉ khi bạn chọn "ghi report"; nếu chọn "fix luôn" thì không bắt buộc |

**Khi nào dùng `scan`**: đây là role trung gian, dùng khi bạn chưa biết Plan/Code còn nhiều lỗi hay không và muốn quyết định hướng xử lý trước khi tốn 1 vòng review + feedback riêng biệt. Chạy `scan`, agent sẽ:

1. Phân tích đầy đủ (không rút gọn, không bỏ sót — cùng độ sâu với `review`).
2. Phân loại từng issue theo **Severity Scale** (bảng bên dưới).
3. In ra thống kê, liệt kê **mọi issue** theo thứ tự mức độ giảm dần, kèm ước lượng của từng cái và một dòng tổng — tất cả lấy từ phần phân tích vừa chạy, không đi tìm hiểu thêm:
   ```
   Tổng: N issues — Critical: a, High: b, Medium: c, Low: d

   - [Critical] <location> — <problem 1 dòng>
     <Trivial | Bounded | Architectural>, ~<n> file, ~<n>-<m> dòng
   - [High] <location> — <problem 1 dòng>
     <Trivial | Bounded | Architectural>, ~<n> file, ~<n>-<m> dòng
   - [Medium] <location> — <problem 1 dòng> (<độ phức tạp>, ~<n> file, ~<n> dòng)
   - [Low] <location> — <problem 1 dòng> (Trivial, 1 file, ~2 dòng)

   Tổng: <Trivial | Bounded | Architectural>, ~<n> file, ~<n>-<m> dòng
   Khuyến nghị: <Fix luôn | Ghi report> — <lý do ngắn>
   ```
   Ước lượng theo từng issue để bạn tách được: đọc problem và giá của nó cùng lúc, chọn fix 2 cái trước và để lại phần còn lại. Dòng tổng gộp lại thì không biết cái nào đang gánh chi phí. Medium/Low cũng đã được phân tích đầy đủ nên cũng có ước lượng — bỏ chúng ra chỉ giấu mất mấy cái fix rẻ, vốn là thứ dễ làm luôn nhất. Medium/Low viết gọn 1 dòng, Critical/High mới xuống dòng riêng.
   Agent phải tự trả lời, không được hỏi ngược bạn "cái này có phức tạp không". Chỗ nào scan chưa đọc tới thì ghi "chưa xác định", không bịa số. Khuyến nghị chỉ là tư vấn — bạn chọn ngược lại thì agent làm theo bạn.
5. Hỏi bạn chọn 1 trong 2, dùng lại đúng kết quả phân tích vừa có (không phân tích lại từ đầu):
   - **Ghi report** → tiếp tục như role `review`, tạo Issue ID và ghi vào report, chưa sửa gì.
   - **Fix luôn** → sửa trực tiếp Plan/Code cho các issue đã tìm thấy, không bắt buộc phải ghi report cho lượt này.

### Severity Scale (dùng chung cho cả 2 skill)

| Mức | Tiêu chí |
|---|---|
| **Low** | Không ảnh hưởng hành vi/kết quả — chỉ sai quy ước (style, naming, format...) |
| **Medium** | Case hiện tại đúng, nhưng có case/edge case chưa cover → tiềm ẩn sai |
| **High** | Sai hướng đã thống nhất trong Plan, hoặc chặn đứng main flow trong phạm vi task đang xét |
| **Critical** | Ảnh hưởng ra ngoài phạm vi task/feature, tới cả hệ thống: mất dữ liệu, lỗ hổng bảo mật, phá vỡ tính năng khác. Cân nhắc kỹ, không gán bừa |

"High trở lên" = High + Critical — dùng khi quyết định issue nào phải trình bày đầy đủ trong chat.

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

### Chạy `scan` mà không nhập gì

Riêng role `scan`, nếu bạn gọi mà không đưa path / Spec / tên tính năng nào, agent sẽ tự lấy mốc từ **git log trong ngày hôm đó** (branch hiện tại):

1. Không có commit nào trong ngày → agent hỏi lại bạn, **không tự lùi sang ngày khác**.
2. Đúng 1 commit → lấy luôn commit đó làm phạm vi scan (với `review-plan` là file Plan/Spec mà commit chạm vào).
3. Nhiều commit → agent liệt kê đầy đủ (hash, subject, file thay đổi), **đánh dấu commit mới nhất**, để bạn chọn — không tự đoán.
4. Agent **tự suy ra mục tiêu chính** của commit đã chọn (từ commit message + diff), phát biểu thành 1 câu và xin bạn confirm hoặc sửa lại — bạn không phải tự viết từ đầu.
5. Với `review-code`, nếu không có Approved Plan khớp mục tiêu đó thì chính mục tiêu đã confirm sẽ đóng vai baseline để review, và agent phải ghi rõ điều này trong phần tóm tắt.

Agent chỉ bắt đầu `scan` sau khi bạn đã confirm cả commit lẫn mục tiêu.

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
