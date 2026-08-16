---
title: "Động học robot di chuyển: Differential Drive và Odometry cơ bản"
slug: "dong-hoc-robot-di-chuyen-differential-drive-odometry"
category: "Robotics Fundamentals"
subcategory: "Động học Robot"
level: 2
tags: ["kien-thuc-nen-tang", "dong-hoc", "odometry"]
publishedAt: "2026-07-04"
author: "Atlasbot"
coverImage: "differential-drive.svg"
excerpt: "Công thức tính vận tốc robot hai bánh vi sai từ tốc độ từng bánh, và vì sao odometry một mình không đủ để định vị chính xác lâu dài."
readingTime: 5
---

Phần lớn robot AMR giá rẻ và dễ chế tạo nhất dùng cấu hình **hai bánh vi sai (differential drive)**: hai bánh chủ động gắn động cơ riêng biệt ở hai bên, cộng thêm bánh đỡ (caster wheel) để giữ thăng bằng. Không có bánh lái riêng — mọi chuyển động, kể cả quay tại chỗ, đều đến từ việc **điều khiển độc lập tốc độ hai bánh**.

## Vì sao chỉ cần hai bánh là đủ để đi mọi hướng?

Trực giác: nếu hai bánh quay cùng tốc độ, robot đi thẳng. Nếu bánh phải quay nhanh hơn bánh trái, robot lệch dần sang trái. Nếu hai bánh quay ngược chiều nhau với cùng tốc độ, robot xoay tại chỗ quanh tâm của chính nó.

Về mặt toán học, đây là hai công thức nền tảng nhất trong robot di động — mọi kỹ sư làm AMR sớm muộn cũng phải thuộc lòng:

```text
v = (v_R + v_L) / 2      # vận tốc dài tại tâm robot
ω = (v_R − v_L) / L      # vận tốc góc (quay)
```

Trong đó `v_L`, `v_R` là vận tốc dài của bánh trái/phải (m/s, tính từ tốc độ quay động cơ và bán kính bánh xe), còn `L` là khoảng cách giữa tâm hai bánh (m).

Nhìn vào công thức, vài trường hợp đặc biệt trở nên rất trực quan:
- `v_L = v_R` → `ω = 0`: đi thẳng, không quay
- `v_L = −v_R` → `v = 0`, `ω ≠ 0`: xoay tại chỗ, không tịnh tiến
- `v_L = 0`, `v_R > 0`: robot quay quanh chính bánh trái (bán kính quay = L/2)

## Từ vận tốc bánh xe ra tốc độ động cơ

Vận tốc dài của một bánh liên hệ với tốc độ quay động cơ qua bán kính bánh xe `r`:

```text
v_banh = ω_dong_co × r
```

Đây chính là con số bạn thực sự gửi xuống driver động cơ ở bước "Act" trong vòng lặp điều khiển đã nói ở bài trước — bộ điều khiển tính ra `v` và `ω` mong muốn (ví dụ từ path planner), rồi **đảo ngược** hai công thức trên để suy ra `v_L`, `v_R` cần thiết, từ đó suy ra tốc độ động cơ cần set.

## Odometry — biết mình đang ở đâu chỉ từ vòng quay bánh xe

**Odometry** là kỹ thuật ước lượng vị trí hiện tại của robot (x, y, hướng θ) dựa trên số vòng quay bánh xe đo được từ encoder, mà không cần bất kỳ cảm biến định vị tuyệt đối nào (như GPS hay camera).

Nguyên lý: ở mỗi chu kỳ nhỏ Δt, ta tính được `v` và `ω` từ dữ liệu encoder, rồi tích luỹ (tích phân) để cập nhật vị trí:

```text
θ_moi = θ_cu + ω × Δt
x_moi = x_cu + v × cos(θ_cu) × Δt
y_moi = y_cu + v × sin(θ_cu) × Δt
```

## Vấn đề lớn nhất của odometry: sai số tích luỹ

Odometry rẻ, đơn giản, chạy được ngay trên MCU — nhưng có một nhược điểm chí mạng: **sai số cộng dồn theo thời gian**. Bánh xe trơn trượt nhẹ trên sàn, sai số làm tròn nhỏ mỗi chu kỳ, dung sai chế tạo bánh xe không hoàn hảo — tất cả cộng dồn lại khiến vị trí ước lượng ngày càng lệch xa vị trí thật, đặc biệt sau khi robot đi được quãng đường dài hoặc quay nhiều vòng.

Đây chính là lý do tại sao AMR thực tế **không thể chỉ dùng odometry để định vị**. Odometry thường được dùng làm nguồn dữ liệu "ngắn hạn, tần số cao" (chạy mượt giữa hai lần cập nhật), rồi được hiệu chỉnh định kỳ bằng dữ liệu "dài hạn, chính xác hơn" từ SLAM (đối chiếu với bản đồ đã biết qua LiDAR) — thường thông qua bộ lọc Kalman kết hợp cả hai nguồn.

## Kết luận

Odometry trả lời câu hỏi "tôi vừa di chuyển bao xa, theo hướng nào?" rất tốt trong thời gian ngắn; SLAM trả lời câu hỏi "tôi đang ở đâu trong toàn bộ bản đồ?" chính xác hơn trong thời gian dài. Một AMR đáng tin cậy cần cả hai — bài cuối cùng của chuyên mục sẽ zoom ra để nhìn toàn cảnh các mảnh ghép này ghép vào đâu trong một hệ thống phần mềm robot hiện đại như ROS2.
