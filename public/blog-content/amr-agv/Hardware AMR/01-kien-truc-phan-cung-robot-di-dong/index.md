---
title: "Kiến trúc phần cứng của một robot di động tự hành"
slug: "kien-truc-phan-cung-robot-di-dong"
category: "AMR / AGV"
subcategory: "Hardware AMR"
level: 1
tags: ["kien-thuc-nen-tang", "phan-cung"]
publishedAt: "2026-06-10"
author: "Atlasbot"
coverImage: "kien-truc-phan-cung.svg"
excerpt: "Sơ đồ khối phần cứng cơ bản của một robot di động: nguồn, bộ xử lý trung tâm, cảm biến, driver và động cơ ghép nối với nhau ra sao."
readingTime: 5
---

Trước khi viết một dòng code nào, việc đầu tiên khi làm quen với robot di động là hiểu rõ **những khối phần cứng nào ghép lại thành một con robot hoàn chỉnh**, và tại sao chúng cần tồn tại. Bài này đi từ nguồn điện cho đến bánh xe, theo đúng thứ tự dòng năng lượng và dữ liệu chảy qua robot.

## Bộ xử lý trung tâm — "bộ não" của robot

Đây là nơi mọi dữ liệu cảm biến đổ về và mọi lệnh điều khiển được tính toán. Tuỳ độ phức tạp của robot, "bộ não" có thể là:

- **Vi điều khiển (MCU)** như STM32, ESP32 — phù hợp cho vòng điều khiển động cơ tốc độ cao, realtime, giá rẻ
- **Máy tính nhúng (SBC)** như Jetson, Raspberry Pi — phù hợp chạy Linux, ROS2, các thuật toán SLAM/AI nặng tính toán

Robot AMR thực tế thường dùng **cả hai**: một MCU lo phần điều khiển động cơ thời gian thực (tần số cao, độ trễ thấp), giao tiếp với một SBC lo phần "trí tuệ" (bản đồ, lập kế hoạch đường đi, xử lý ảnh).

## Nguồn — Pin và mạch BMS

Robot di động bắt buộc chạy bằng pin (thường là Li-ion/LiPo), đi kèm **BMS (Battery Management System)** để:

- Cân bằng điện áp giữa các cell pin
- Bảo vệ chống sạc/xả quá dòng, quá nhiệt
- Báo dung lượng còn lại cho hệ thống

Thiết kế nguồn sai là nguyên nhân phổ biến nhất khiến robot tự chế "chết" giữa chừng — không phải do lỗi thuật toán, mà do sụt áp khi động cơ khởi động đột ngột kéo dòng lớn.

## Cảm biến — "giác quan" của robot

Mỗi loại cảm biến trả lời một câu hỏi khác nhau:

| Cảm biến | Trả lời câu hỏi |
|---|---|
| Encoder (gắn ở bánh/động cơ) | Bánh đã quay bao nhiêu vòng? → ước lượng quãng đường đã đi |
| IMU (Inertial Measurement Unit) | Robot đang nghiêng/xoay với gia tốc bao nhiêu? |
| LiDAR | Xung quanh robot có vật thể gì, cách bao xa? (quét 2D/3D) |
| Ultrasonic/hồng ngoại | Có vật cản gần ngay trước mặt không? (khoảng cách ngắn, rẻ) |
| Camera | Nhận diện vật thể, đọc vạch kẻ, QR code |

Không robot nào dùng đúng một cảm biến — độ tin cậy đến từ việc **kết hợp nhiều nguồn dữ liệu** (sensor fusion), vì mỗi cảm biến đều có điểm mù riêng.

## Driver động cơ — cầu nối giữa tín hiệu yếu và công suất lớn

MCU chỉ xuất ra được tín hiệu điện áp thấp, dòng nhỏ (vài chục mA) — không đủ để quay động cơ DC cần vài Ampe. **Driver động cơ** (mạch cầu H, ESC...) đóng vai trò khuếch đại: nhận tín hiệu điều khiển nhỏ từ MCU (PWM + chiều quay), xuất ra dòng điện lớn để thực sự quay động cơ.

Đây cũng là lý do gần như mọi lỗi "robot không nhúc nhích dù code đã đúng" đều nằm ở khâu này: sai đấu dây driver, chọn driver không đủ dòng, hoặc thiếu tụ lọc nhiễu.

## Giao tiếp — kết nối các khối lại với nhau

MCU, SBC, cảm biến và driver không nằm chung một chip — chúng cần một "ngôn ngữ chung" để nói chuyện: UART, I2C, SPI cho khoảng cách ngắn trong board; CAN bus cho môi trường công nghiệp nhiễu điện nhiều; WiFi/Ethernet để robot báo cáo trạng thái về hệ thống giám sát trung tâm.

## Kết luận

Sơ đồ ở đầu bài tóm tắt cách các khối trên kết nối với nhau trong một robot AMR/AGV điển hình — nguồn nuôi bộ xử lý trung tâm, cảm biến đổ dữ liệu vào, bộ xử lý ra lệnh cho driver động cơ, và mọi thứ báo cáo ra ngoài qua khối giao tiếp. Ở bài tiếp theo, chúng ta sẽ tách riêng khối "bộ xử lý trung tâm" ra để trả lời câu hỏi: khi nào nên chọn vi điều khiển, khi nào cần vi xử lý.
