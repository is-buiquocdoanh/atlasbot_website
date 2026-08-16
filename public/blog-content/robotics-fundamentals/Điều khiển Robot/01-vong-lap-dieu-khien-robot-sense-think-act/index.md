---
title: "Vòng lặp điều khiển robot: Sense - Think - Act"
slug: "vong-lap-dieu-khien-robot-sense-think-act"
category: "Robotics Fundamentals"
subcategory: "Điều khiển Robot"
level: 2
tags: ["kien-thuc-nen-tang", "dieu-khien"]
publishedAt: "2026-06-26"
author: "Atlasbot"
coverImage: "sense-think-act.svg"
excerpt: "Mọi hệ thống điều khiển robot đều chạy theo vòng lặp Cảm biến - Xử lý - Điều khiển. Vì sao tần số vòng lặp lại quyết định robot phản ứng nhanh hay chậm."
readingTime: 5
---

Dù là robot hút bụi 500 nghìn đồng hay AMR công nghiệp vài trăm triệu, gần như mọi hệ thống điều khiển robot đều chạy theo cùng một mô hình gốc: **Sense → Think → Act** (Cảm biến → Xử lý → Điều khiển), lặp lại liên tục hàng chục đến hàng trăm lần mỗi giây.

## Ba bước của một vòng lặp

**Sense (Cảm biến):** đọc dữ liệu thô từ phần cứng — giá trị encoder, gia tốc từ IMU, khoảng cách từ cảm biến siêu âm/LiDAR. Đây là bước "nhìn vào thế giới thực".

**Think (Xử lý):** từ dữ liệu cảm biến, tính toán ra quyết định — có vật cản phía trước không, cần rẽ trái hay đi thẳng, tốc độ động cơ cần tăng hay giảm bao nhiêu. Bước này chứa các thuật toán như PID, path planning, hoặc đơn giản chỉ là vài câu lệnh so sánh (if-else).

**Act (Điều khiển):** gửi lệnh xuống cơ cấu chấp hành — set PWM cho driver động cơ, bật/tắt relay. Đây là bước duy nhất thực sự tác động ngược lại thế giới vật lý.

Sau bước Act, thế giới thực thay đổi (robot đã di chuyển một chút), vòng lặp quay lại bước Sense để đọc trạng thái mới — và cứ thế tiếp diễn.

## Ví dụ tối giản: robot tránh vật cản

Cách dễ nhất để cảm nhận mô hình này là nhìn vào một đoạn giả mã cho robot né vật cản bằng một cảm biến siêu âm phía trước:

```text
loop (chạy ở tần số cố định, ví dụ 50Hz):
    # Sense
    distance = doc_cam_bien_sieu_am()

    # Think
    if distance < NGUONG_AN_TOAN:
        lenh = "RE_PHAI"
    else:
        lenh = "DI_THANG"

    # Act
    gui_lenh_toi_driver_dong_co(lenh)

    doi_den_chu_ky_tiep_theo()
```

Robot thực tế phức tạp hơn nhiều lớp (nhiều cảm biến, thuật toán path planning thay vì if-else đơn giản), nhưng bộ khung ba bước này không đổi.

## Tại sao tần số vòng lặp quan trọng?

Tần số vòng lặp (loop rate) quyết định robot "phản ứng nhanh" đến mức nào. Nếu vòng lặp chạy ở 10 Hz (10 lần/giây), robot chỉ cập nhật quyết định mỗi 100ms một lần — với robot di chuyển 1 m/s, nghĩa là nó có thể đi thêm 10cm trước khi kịp phản ứng với một vật cản mới xuất hiện.

Đó là lý do:
- Vòng điều khiển động cơ (PID tốc độ/vị trí) thường cần chạy ở 500Hz–1kHz, và **phải** nằm trên MCU vì cần độ trễ thấp, xác định.
- Vòng tránh vật cản có thể chấp nhận 10–50Hz.
- Vòng lập kế hoạch đường đi toàn cục (global path planning) có thể chỉ cần chạy 1Hz hoặc khi có thay đổi lớn.

Một hệ thống robot hoàn chỉnh thực chất là **nhiều vòng lặp Sense-Think-Act lồng nhau**, mỗi vòng chạy ở tần số phù hợp với bản chất công việc của nó — vòng nhanh nằm gần phần cứng (trên MCU), vòng chậm hơn xử lý logic phức tạp hơn (trên MPU chạy ROS2).

## Điểm nghẽn thường gặp

Khi robot "phản ứng chậm" hoặc "giật cục", nguyên nhân gần như luôn nằm ở một trong ba bước:

1. **Sense chậm:** cảm biến trả dữ liệu trễ hoặc bị nhiễu, cần lọc (moving average, Kalman filter cơ bản).
2. **Think tốn thời gian:** thuật toán xử lý quá nặng cho tần số vòng lặp yêu cầu — cần tối ưu hoặc hạ tần số.
3. **Act có độ trễ:** driver động cơ phản hồi chậm, hoặc giao tiếp giữa MCU và driver bị nghẽn.

## Kết luận

Nắm được mô hình Sense-Think-Act giúp bạn khoanh vùng lỗi nhanh hơn rất nhiều so với việc mò từng dòng code — luôn tự hỏi "vấn đề đang ở bước nào trong ba bước này?" trước khi debug sâu hơn. Bài tiếp theo sẽ đi vào phần "Act" cụ thể hơn cho robot hai bánh vi sai: làm sao từ tốc độ hai bánh riêng lẻ, ta tính ra được robot đang di chuyển với vận tốc và hướng nào.
