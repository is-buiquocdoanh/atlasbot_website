# CLAUDE.md — Bối cảnh dự án Atlasbot

> File này giúp AI assistant (Claude Code, hoặc bất kỳ công cụ nào đọc được) hiểu ngay bối cảnh dự án khi bạn bắt đầu phiên làm việc mới trong VS Code, không cần giải thích lại từ đầu. Đọc file này trước khi thực hiện bất kỳ thay đổi nào.

## Tổng quan dự án

Website cho thương hiệu **Atlasbot**: kết hợp blog kiến thức AMR/AGV, showcase dự án cá nhân (GitHub), và shop bán linh kiện robot. Chủ dự án là kỹ sư robotics, tự code, đang làm việc **cá nhân** (chưa có hộ kinh doanh).

Chi tiết đầy đủ nằm trong thư mục `docs/` — đọc theo thứ tự:
1. `docs/giai-doan-1-ke-hoach-nghien-cuu.md` — mục tiêu, đối tượng, ngân sách, pháp lý
2. `docs/giai-doan-2-thiet-ke-ui-ux.md` — design system, wireframe, style spec
3. `docs/giai-doan-3-chuan-bi-ky-thuat.md` — tech stack, kiến trúc đa ngôn ngữ
4. `PROJECT-SPEC.md` — cấu trúc thư mục, data model, API endpoints

## Các quyết định quan trọng KHÔNG được thay đổi ngầm

- **Không tích hợp cổng thanh toán online.** Checkout chỉ thu thông tin rồi điều hướng khách sang Messenger/Zalo để chốt đơn thủ công. Đây là quyết định có chủ đích (chưa có giấy phép hộ kinh doanh), không phải thiếu sót cần "sửa".
- **Theme sáng**, không phải theme tối. Bảng màu chuẩn nằm ở `docs/giai-doan-2-thiet-ke-ui-ux.md` mục 1.1.
- **4 ngôn ngữ bắt buộc:** vi (mặc định), en, zh, ko — dùng `next-intl`, routing dạng `/[locale]/...`.
- **Auto-dịch nội dung:** viết bài bằng tiếng Việt trong Sanity → webhook gọi Google Translate API → tạo bản nháp 3 ngôn ngữ còn lại → chủ dự án duyệt thủ công rồi mới publish. KHÔNG auto-publish thẳng bản dịch máy.
- **Domain hiện tại `doanhwork.com` chỉ là tạm thời** để dev/test local — không phải tên miền thương hiệu cuối cùng, đừng gắn cứng logic nào phụ thuộc vào domain này.
- **Đang chạy local, chưa deploy.** Đừng tự ý thêm cấu hình deploy/CI-CD trừ khi được yêu cầu.
- **Danh mục sản phẩm cố định:** Cảm biến, Vi điều khiển & mạch điều khiển, Motor & driver, Khung robot/cơ khí, Bánh xe & hệ truyền động, Pin & nguồn.
- **9 chủ đề Blog cố định** (xem đầy đủ ở `docs/giai-doan-2-thiet-ke-ui-ux.md` mục 2.2): Kiến thức nền tảng, Vi điều khiển & nhúng, Giao tiếp UART/SPI/I2C/CAN, Cảm biến & định vị, Motor & điều khiển động cơ, ROS2 & phần mềm, SLAM & lập bản đồ, Cơ khí & thiết kế khung, Dự án thực chiến.

## Trạng thái hiện tại (cập nhật khi có tiến triển mới)

- [x] Giai đoạn 1: Lên kế hoạch & Nghiên cứu — hoàn thành
- [x] Giai đoạn 2: Thiết kế UI/UX — hoàn thành
- [x] Giai đoạn 3: Chuẩn bị kỹ thuật — hoàn thành
- [ ] Giai đoạn 4: Phát triển Frontend & Backend cốt lõi — **đang làm / tiếp theo**
- [ ] Giai đoạn 5: Phát triển chức năng Shop
- [ ] Giai đoạn 6: Tài khoản người dùng (tuỳ chọn)
- [ ] Giai đoạn 7: Kiểm thử
- [ ] Giai đoạn 8: Triển khai & SEO
- [ ] Giai đoạn 9: Sau khi launch

> Việc cần làm chi tiết cho Giai đoạn 4 trở đi nằm trong `docs/giai-doan-3-chuan-bi-ky-thuat.md` mục 6, và checklist tổng ở đầu dự án (nếu bạn còn giữ file `checklist-xay-website-amr-agv.md`).

## Thông tin còn thiếu (đang để TODO, không tự bịa ra)

- `NEXT_PUBLIC_MESSENGER_USERNAME` / `NEXT_PUBLIC_ZALO_PHONE` — chủ dự án chưa cung cấp, giữ nguyên TODO trong `.env`, không tự điền giá trị giả.
- Domain thương hiệu chính thức (đang cân nhắc `atlasbot.com` / `.vn` / `.io`) — chưa chốt.
- Logo hiện tại (`public/images/logo.svg`) là bản placeholder do AI tạo tạm — sẽ được thay khi có logo thiết kế chính thức.

## Quy ước làm việc

- Code hiện tại đang ở giai đoạn khung (scaffold) với dữ liệu mẫu trong `src/lib/cms.ts` và `src/lib/products.ts` — khi triển khai Giai đoạn 4+, thay dần bằng kết nối Sanity/Supabase thật, không cần giữ lại data mẫu.
- Khi thực hiện xong một hạng mục trong checklist ở các file `docs/giai-doan-*.md`, tick `[x]` vào đúng dòng đó để giữ tài liệu luôn phản ánh đúng tiến độ thật.
