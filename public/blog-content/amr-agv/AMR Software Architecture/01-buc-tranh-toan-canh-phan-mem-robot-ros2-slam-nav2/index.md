---
title: "Bức tranh toàn cảnh phần mềm robot: từ firmware đến ROS2, SLAM, Nav2"
slug: "buc-tranh-toan-canh-phan-mem-robot-ros2-slam-nav2"
category: "AMR / AGV"
subcategory: "AMR Software Architecture"
level: 3
tags: ["kien-thuc-nen-tang", "ros2", "slam", "nav2"]
publishedAt: "2026-07-12"
author: "Atlasbot"
coverImage: "software-stack.svg"
excerpt: "Từ firmware trên vi điều khiển đến ROS2, SLAM và Nav2 — bức tranh toàn cảnh các lớp phần mềm ghép thành một robot AMR hoàn chỉnh."
readingTime: 6
---

Sau khi đã đi qua phần cứng, mô hình điều khiển và động học di chuyển, câu hỏi tự nhiên tiếp theo là: **tất cả những mảnh ghép đó khớp vào đâu trong một hệ thống phần mềm robot thực tế?** Bài này zoom ra để nhìn toàn cảnh, từ lớp gần phần cứng nhất đến lớp gần người dùng nhất — trước khi đi sâu vào từng lớp ở các chuyên mục riêng.

## Vì sao phải chia lớp (layer)?

Một AMR hoàn chỉnh phải giải quyết đồng thời hai loại bài toán có bản chất đối lập nhau:

- **Thời gian thực, đơn giản:** quay động cơ đúng tốc độ, đọc encoder không bỏ sót xung — cần độ trễ thấp, xác định (deterministic)
- **Phức tạp, không cần thời gian thực tuyệt đối:** hiểu bản đồ, tính đường đi tối ưu, tránh vật cản động — cần sức mạnh tính toán lớn, chấp nhận độ trễ vài chục–vài trăm mili-giây

Không có nền tảng nào giỏi cả hai việc cùng lúc. Giải pháp là **chia thành các lớp riêng biệt**, mỗi lớp chạy trên phần cứng phù hợp và chỉ giao tiếp với lớp liền kề qua một giao diện rõ ràng.

## Đi từ dưới lên

**Phần cứng:** MCU, cảm biến, động cơ, khung robot — nền móng vật lý, đã nói ở bài "Kiến trúc phần cứng robot di động".

**Firmware:** code chạy trực tiếp trên MCU, đảm nhiệm vòng điều khiển thời gian thực (đọc encoder, PID tốc độ động cơ) — chính là vòng lặp Sense-Think-Act tần số cao đã nói ở bài trước.

**Giao tiếp:** kênh truyền dữ liệu giữa MCU và máy tính chính (UART, CAN, Ethernet) — nơi firmware gửi dữ liệu encoder/IMU lên, và nhận lệnh vận tốc `v`, `ω` từ tầng trên xuống.

**ROS2 (Robot Operating System 2):** không phải hệ điều hành theo nghĩa truyền thống, mà là một **middleware** — bộ khung giúp các thành phần phần mềm (gọi là *node*) trao đổi dữ liệu với nhau qua *topic* (kênh publish/subscribe) một cách chuẩn hoá. Nhờ ROS2, module SLAM không cần biết gì về driver động cơ cụ thể — nó chỉ cần subscribe vào đúng topic dữ liệu cảm biến.

**SLAM (Simultaneous Localization and Mapping):** nhận dữ liệu LiDAR/camera + odometry, đồng thời xây bản đồ môi trường và xác định vị trí robot trong chính bản đồ đó — như đã nói ở bài AMR vs AGV, đây là thứ giúp AMR không cần line dẫn đường cố định.

**Nav2 (Navigation2):** dựa trên bản đồ từ SLAM và vị trí đích mong muốn, tính ra đường đi tối ưu (global planner), đồng thời liên tục điều chỉnh đường đi cục bộ để né vật cản mới xuất hiện (local planner) — kết quả cuối cùng là lệnh vận tốc `v`, `ω` gửi ngược xuống firmware.

**Ứng dụng:** logic nghiệp vụ cụ thể — robot giao hàng biết đích đến tiếp theo là đâu, robot lau sàn biết khu vực nào đã lau xong — xây trên nền tất cả các lớp bên dưới.

## Dữ liệu chảy theo hai chiều

Điều quan trọng cần thấy: đây không phải một đường ống một chiều. Dữ liệu cảm biến chảy **từ dưới lên** (phần cứng → firmware → ROS2 → SLAM/Nav2), còn lệnh điều khiển chảy **từ trên xuống** (Nav2 → ROS2 → giao tiếp → firmware → driver động cơ). Vòng lặp Sense-Think-Act ở bài trước, xét trên toàn hệ thống, chính là vòng lặp dữ liệu đi lên rồi lệnh điều khiển đi xuống liên tục qua tất cả các lớp này.

## Vì sao nên học theo thứ tự này

Một sai lầm phổ biến của người mới là nhảy thẳng vào học ROS2/SLAM mà bỏ qua các lớp bên dưới. Hậu quả: khi robot chạy sai, không biết lỗi nằm ở thuật toán SLAM hay ở việc encoder gắn lệch khiến dữ liệu odometry sai ngay từ đầu.

Nắm chắc từng lớp — phần cứng, firmware, động học — trước khi lên ROS2/SLAM/Nav2 giúp bạn debug đúng lớp, thay vì đoán mò.

## Kết luận

Chuyên mục Kiến thức nền tảng đi theo đúng thứ tự này: AMR/AGV là gì → phần cứng gồm những gì → MCU hoạt động ra sao → vòng điều khiển là gì → động học di chuyển tính thế nào → và cuối cùng, tất cả ghép vào bức tranh phần mềm tổng thể ra sao. Từ đây, bạn đã có đủ nền tảng để đi sâu vào từng chuyên mục con: Lập trình nhúng, Cảm biến, ROS2, hay SLAM & Định vị.
