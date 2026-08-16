# GIAI ĐOẠN 1: Lên kế hoạch & Nghiên cứu — Atlasbot

**Trạng thái:** ✅ Hoàn thành
**Ngày:** 15/08/2026

---

## 1. Mục tiêu & phạm vi

- **Tên thương hiệu:** Atlasbot
- **Mục tiêu:** Cân bằng giữa xây dựng thương hiệu/portfolio kỹ thuật (blog + dự án) và bán hàng (shop linh kiện AMR/AGV)
- **Tầm nhìn phát triển:**
  - Giai đoạn đầu: phục vụ sinh viên & kỹ sư cá nhân
  - Giai đoạn scale: mở rộng thành nhà phân phối sỉ cho doanh nghiệp, phân phối toàn quốc và quốc tế
- **MVP (bản đầu):** Blog, Dự án, Shop (10-50 sản phẩm), hỗ trợ đa ngôn ngữ

---

## 2. Đối tượng người dùng

| Giai đoạn | Đối tượng | Nhu cầu chính |
|---|---|---|
| Ngắn hạn | Sinh viên, kỹ sư cá nhân | Học kiến thức, mua lẻ linh kiện |
| Dài hạn | Doanh nghiệp mua sỉ | Đặt hàng số lượng lớn, cần báo giá/hóa đơn, tin cậy thương hiệu |
| Dài hạn | Khách hàng quốc tế | Giao diện đa ngôn ngữ, thanh toán quốc tế, vận chuyển xuyên biên giới |

> **Ghi chú thiết kế:** vì đối tượng sẽ mở rộng lên B2B và quốc tế, kiến trúc dữ liệu sản phẩm nên tính trước các trường như **giá sỉ theo số lượng (tier pricing)**, **MOQ (số lượng đặt tối thiểu)**, và **đa tiền tệ** — dù MVP chưa cần dùng ngay, để đỡ phải sửa cấu trúc database sau này.

---

## 3. Thương hiệu & Domain

**Tên thương hiệu:** Atlasbot — tên tốt, ngắn gọn, dễ nhớ, phát âm được ở cả VN và quốc tế, phù hợp định hướng phân phối toàn cầu.

**Gợi ý tên miền cần kiểm tra khả dụng** (kiểm tra tại Mắt Bão, PA Vietnam, Namecheap, GoDaddy):

| Ưu tiên | Domain | Lý do |
|---|---|---|
| 1 | `atlasbot.com` | Chuẩn quốc tế, cần thiết nếu định phân phối toàn cầu |
| 2 | `atlasbot.vn` | Khẳng định gốc Việt Nam, tăng tin cậy với khách trong nước |
| 3 | `atlasbot.io` | Phong cách công nghệ, hay dùng cho startup phần cứng/robotics |
| 4 (dự phòng) | `getatlasbot.com`, `atlasbotvn.com`, `atlasbot.store` | Dùng nếu tên chính đã bị người khác đăng ký |

**Khuyến nghị:** Mua cả `.com` và `.vn` nếu ngân sách cho phép, để bảo vệ thương hiệu — trỏ `.vn` redirect về `.com` (hoặc ngược lại). Kiểm tra ngay vì tên ngắn, đẹp dễ bị người khác đăng ký trước.

**✅ Quyết định:** Dùng **`doanhwork.com`** làm domain tạm thời để phát triển/test cục bộ. Domain thương hiệu chính thức (`atlasbot.com`/`.vn`) sẽ chốt và trỏ vào sau khi web sẵn sàng lên host thật — không ảnh hưởng tới việc code vì code không phụ thuộc domain.

---

## 4. Ngân sách theo giai đoạn (ước tính)

| Hạng mục | Gói Starter (mới bắt đầu) | Gói Growth (khi có doanh thu ổn định) | Gói Business (mở rộng B2B/quốc tế) |
|---|---|---|---|
| Domain (.com + .vn) | ~700.000–1.200.000đ/năm | như Starter | + domain khu vực khác nếu cần |
| Hosting frontend | Vercel Free tier — 0đ | Vercel Pro ~20$/tháng (~500.000đ) | Vercel Pro/Enterprise |
| Hosting backend + DB | Railway/Supabase Free tier — 0đ | Railway/Supabase ~5-25$/tháng | Nâng cấp theo traffic |
| CMS | Sanity Free tier — 0đ | Sanity Growth ~15$/tháng nếu vượt free tier | như Growth |
| Cổng thanh toán VN | COD/chuyển khoản tay — 0đ phí cố định | VNPay/MoMo — phí ~1-2%/giao dịch, không phí duy trì | + Stripe/PayPal cho quốc tế |
| Email thương hiệu | Zoho Mail Free — 0đ | Google Workspace ~72.000đ/tháng/user | như Growth |
| Vận chuyển | Tự giao/COD | Tích hợp GHN/GHTK API | + đơn vị vận chuyển quốc tế |
| **Tổng ước tính** | **~1 triệu đ/năm** | **~5-10 triệu đ/năm** | Tùy quy mô |

> Bạn hoàn toàn có thể bắt đầu ở mức gần như 0đ (dùng free tier + COD), rồi nâng cấp dần khi có đơn hàng thật — không cần đầu tư lớn ngay từ đầu.

---

## 5. Yêu cầu pháp lý cần lưu ý (quan trọng)

Bạn đang bán dạng **cá nhân**. Một số điều cần biết trước khi triển khai phần thanh toán:

- Để đăng ký merchant chính thức với VNPay/MoMo (nhận tiền trực tiếp qua cổng, xuất hóa đơn), ngân hàng/cổng thanh toán thường yêu cầu **giấy chứng nhận đăng ký hộ kinh doanh** và CCCD người đại diện — tài khoản cá nhân thông thường không đủ điều kiện làm merchant chính thức.
- Từ 01/03/2026, hộ kinh doanh phải dùng tài khoản ngân hàng đứng tên hộ kinh doanh cho hoạt động kinh doanh (theo Thông tư 25/2025/TT-NHNN).
- **Giải pháp tạm thời khi chưa có giấy phép:** dùng **COD (thu tiền khi giao hàng)** hoặc **chuyển khoản ngân hàng cá nhân + QR code** — vẫn bán được bình thường, chỉ chưa tích hợp cổng thanh toán tự động.
- **Khi scale lên B2B/quốc tế:** gần như bắt buộc phải có hộ kinh doanh hoặc công ty để xuất hóa đơn, ký hợp đồng phân phối, và mở tài khoản merchant quốc tế (Stripe/PayPal cũng yêu cầu pháp nhân kinh doanh ở hầu hết trường hợp).

> Đây là thông tin tham khảo chung, không phải tư vấn pháp lý/thuế chính thức — khi tiến gần tới mốc go-live phần thanh toán, bạn nên hỏi thêm kế toán hoặc đơn vị tư vấn thủ tục hộ kinh doanh.

**→ Đưa vào roadmap:** đăng ký hộ kinh doanh nên làm song song lúc phát triển Giai đoạn 4-5 (trước khi tích hợp thanh toán thật), không cần làm ngay bây giờ.

**✅ Quyết định cập nhật:** Ở bản đầu, **không tích hợp cổng thanh toán**. Nút "Đặt hàng" ở trang checkout sẽ **điều hướng khách sang Messenger/Zalo** để chốt đơn và thanh toán thủ công (chuyển khoản/COD). Việc này giúp ra mắt nhanh hơn, không bị chặn bởi thủ tục giấy phép hộ kinh doanh — phần tích hợp VNPay/MoMo/Stripe sẽ làm sau khi có giấy phép, xem như module thêm vào chứ không phải thay đổi kiến trúc.

---

## 6. Danh mục sản phẩm (Shop) — Kiến trúc thông tin

| Danh mục | Ví dụ sản phẩm |
|---|---|
| Cảm biến | LiDAR, IMU, encoder |
| Vi điều khiển & mạch điều khiển | STM32, ESP32, Jetson |
| Motor & driver | DC motor, servo, motor driver |
| Khung robot / cơ khí | Khung nhôm, tấm chassis |
| Bánh xe & hệ truyền động | Bánh mecanum, bánh omni, bộ truyền động |
| Pin & nguồn | Pin Li-ion, mạch sạc, BMS |

- **Số lượng sản phẩm ban đầu:** 10–50 sản phẩm
- **Trường dữ liệu sản phẩm cần có** (bổ sung so với bản spec ban đầu để phù hợp B2B sau này):
  - Tên, ảnh, mô tả, thông số kỹ thuật (đã có trong `PROJECT-SPEC.md`)
  - **Giá lẻ** (bắt buộc từ đầu)
  - **Giá sỉ theo số lượng** *(field để trống, dùng sau khi lên B2B)*
  - **MOQ — số lượng đặt tối thiểu cho sỉ** *(field để trống, dùng sau)*

---

## 7. Nội dung ban đầu (Blog & Dự án)

- **Dự án:** Đã có nhiều dự án trên GitHub, đợt đầu showcase **3-5 dự án tiêu biểu**, kiến trúc dữ liệu để **mở rộng thêm dự án dễ dàng** (đã đúng với cấu trúc CMS dạng danh sách trong `PROJECT-SPEC.md`, không cần sửa gì thêm).
- **Blog:** Chưa có bài viết nào — cần viết mới. Đề xuất 3-5 bài đầu tiên nên viết dựa trên chính các dự án GitHub đã có (kể lại quá trình làm, khó khăn kỹ thuật, bài học) — vừa dễ viết vì bạn đã có sẵn kiến thức, vừa tạo nội dung chất lượng cao ngay từ đầu.

**Việc bạn cần chuẩn bị trước Giai đoạn 4 (lúc code phần nội dung):**
- [ ] Gửi link 3-5 repo GitHub muốn showcase đầu tiên
- [ ] Viết nháp (dù ngắn) 2-3 bài blog đầu tiên, hoặc cho mình biết chủ đề để hỗ trợ viết cùng

---

## 8. Đa ngôn ngữ

- **Yêu cầu:** hỗ trợ đa ngôn ngữ để phục vụ phân phối quốc tế
- **Đề xuất kỹ thuật:** dùng thư viện `next-intl` cho Next.js, bắt đầu với **Tiếng Việt + Tiếng Anh** (2 ngôn ngữ phổ biến nhất, đủ phục vụ thị trường Đông Nam Á và quốc tế ban đầu), mở rộng thêm ngôn ngữ khác khi có nhu cầu thực tế theo thị trường
- **Việc này sẽ được set up ở Giai đoạn 3 (chuẩn bị kỹ thuật)** — cần quyết định từ sớm vì ảnh hưởng tới cấu trúc URL và routing của toàn bộ site

---

## 9. Cập nhật vào Sitemap (so với bản nháp trước)

So với sitemap ban đầu, cần bổ sung:
- Routing đa ngôn ngữ: `/vi/...` và `/en/...`
- Trang **Đăng ký làm đại lý / Mua sỉ** (dành cho B2B) — có thể làm ở giai đoạn sau, nhưng nên giữ chỗ trong sitemap ngay từ bây giờ

---

## 10. Việc cần bạn cung cấp trước khi bắt đầu Giai đoạn 2 (Thiết kế UI/UX)

- [ ] Chốt 1 domain trong danh sách gợi ý ở mục 3 (hoặc tên khác) sau khi kiểm tra khả dụng
- [ ] Cảm nhận màu sắc/phong cách bạn thích cho thương hiệu Atlasbot (tối/sáng, tông màu chủ đạo, có logo sẵn chưa?)
- [ ] (Không bắt buộc ngay) Link GitHub các dự án muốn showcase đợt đầu

---

**➡️ Giai đoạn 1 hoàn tất. Sẵn sàng chuyển sang Giai đoạn 2: Thiết kế UI/UX khi bạn cung cấp các mục ở phần 10.**
