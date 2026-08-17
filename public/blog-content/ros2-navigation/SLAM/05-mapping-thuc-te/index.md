---
title: "Mapping thực tế: quy trình quét bản đồ và các lỗi hay gặp"
slug: "mapping-thuc-te"
category: "ROS2 Navigation / Nav2"
subcategory: "SLAM"
level: 2
tags: ["slam", "mapping", "thuc-hanh"]
publishedAt: "2026-08-17"
author: "Atlasbot"
coverImage: "mapping-thuc-te.svg"
excerpt: "Lý thuyết SLAM đúng không có nghĩa bản đồ quét ra sẽ đẹp — tốc độ di chuyển, cách đi, và vài lỗi cấu hình phổ biến ảnh hưởng trực tiếp chất lượng bản đồ cuối cùng nhiều hơn bất kỳ tham số thuật toán nào."
readingTime: 6
---

Các bài trước — [SLAM là gì?](/blog/slam-la-gi), [slam_toolbox](/blog/slam-toolbox), [Cartographer](/blog/cartographer) — đều là lý thuyết thuật toán. Bài này là quy trình thực hành: cầm điều khiển, chạy robot quét thật một khu vực, và những lỗi hay gặp khiến bản đồ ra méo dù thuật toán hoàn toàn đúng.

![Quy trình quét bản đồ tốt: chậm, đường khép kín, tránh xoay gấp](mapping-thuc-te.svg)

## Quy trình cơ bản

```bash
ros2 launch <package> slam_toolbox_online.launch.py   # hoặc cartographer
ros2 run teleop_twist_keyboard teleop_twist_keyboard   # điều khiển tay
# ... đi hết khu vực cần quét ...
ros2 run nav2_map_server map_saver_cli -f my_map        # lưu bản đồ
```

`map_saver_cli` là bước cuối, xuất bản đồ hiện tại (đang giữ trong bộ nhớ của node SLAM) ra file `.pgm`/`.yaml` (bài [Map](/blog/map-occupancy-grid)) để dùng lại về sau qua `map_server`.

## Tốc độ di chuyển chậm — nguyên tắc quan trọng nhất

Scan matching (bài [LiDAR SLAM](/blog/lidar-slam)) cần đủ độ chồng lấp giữa các scan liên tiếp để khớp đúng — di chuyển quá nhanh khiến độ chồng lấp giảm mạnh, thuật toán dễ mất phương hướng hoặc khớp sai:

```text
Đi thẳng: chậm rãi, đều tốc độ — tránh tăng/giảm tốc đột ngột
Xoay: xoay CHẬM hơn nhiều so với tốc độ đi thẳng bình thường
      (xoay nhanh làm scan thay đổi góc quá lớn giữa 2 lần quét liên tiếp)
```

> **Tóm lại:** "Quét bản đồ nhanh cho xong" là sai lầm phổ biến nhất của người mới — chất lượng bản đồ tỉ lệ nghịch với tốc độ di chuyển lúc quét, không phải tỉ lệ thuận với thời gian bỏ ra. Đi chậm 10 phút cho một bản đồ sạch luôn tốt hơn đi nhanh 3 phút rồi phải quét lại.

## Đi thành vòng khép kín — tận dụng Loop Closure

Bài [SLAM là gì?](/blog/slam-la-gi) đã nói loop closure sửa được sai số trôi tích luỹ — nhưng chỉ khi robot thực sự **quay lại** một vị trí đã đi qua. Quy trình quét tốt nên có chủ đích đi thành các vòng khép kín (loop) thay vì chỉ đi các đường thẳng một chiều rồi dừng — mỗi vòng khép kín là một cơ hội để back-end sửa lại sai số của toàn bộ đoạn đường vừa đi qua.

## Lỗi hay gặp: bản đồ bị méo hình chữ S

```text
Triệu chứng: các đoạn tường thẳng trong thực tế hiện ra cong nhẹ dạng chữ S trên bản đồ
Nguyên nhân phổ biến nhất: sai lệch calibration giữa odometry và encoder thực tế
                            (bán kính bánh xe khai sai, hoặc khoảng cách 2 bánh khai sai
                            trong công thức đã học ở bài Differential Drive)
```

Vì SLAM dùng odometry làm điểm khởi tạo cho scan matching, sai lệch hệ thống (không phải nhiễu ngẫu nhiên) trong odometry sẽ in dấu lên toàn bộ bản đồ theo một khuôn mẫu nhất quán — đây là lý do trước khi đổ lỗi cho tham số SLAM, nên kiểm tra lại độ chính xác odometry cơ bản trước.

## Lỗi hay gặp: "hố đen" hoặc vùng trắng lớn giữa bản đồ

```text
Nguyên nhân: khu vực đó robot chưa từng đi qua/LiDAR chưa từng quét tới
             (khác với occupied — đây là "unknown", giá trị -1 đã học ở bài Map)
```

Không phải lỗi thuật toán — chỉ đơn giản là chưa quét đủ. Cần quay lại đi qua khu vực đó, không có tham số SLAM nào "đoán" được nội dung một vùng chưa từng quan sát.

## Bảng debug nhanh

| Triệu chứng | Kiểm tra trước tiên |
|---|---|
| Bản đồ méo hình chữ S | Calibration odometry (bán kính bánh, khoảng cách 2 bánh) |
| Vùng trắng/hố đen lớn | Đã đi qua khu vực đó chưa — không phải lỗi tham số |
| Tường đôi/bóng mờ (double wall) | Đi quá nhanh, hoặc thiếu loop closure ở khu vực đó |
| Bản đồ "nhảy" đột ngột | Mất dữ liệu scan/odometry tạm thời (kiểm tra kết nối) |
