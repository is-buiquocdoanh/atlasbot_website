---
title: "Lập trình nhúng là gì? Vi điều khiển vs vi xử lý"
slug: "lap-trinh-nhung-la-gi-vi-dieu-khien-vs-vi-xu-ly"
category: "Lập trình nhúng (Embedded)"
subcategory: "Vi điều khiển"
level: 1
tags: ["kien-thuc-nen-tang", "lap-trinh-nhung", "mcu", "mpu"]
publishedAt: "2026-06-18"
author: "Atlasbot"
coverImage: "mcu-vs-mpu.svg"
excerpt: "Vi điều khiển (MCU) và vi xử lý (MPU) khác nhau thế nào, và nên chọn nền tảng nào để bắt đầu học lập trình nhúng cho robot."
readingTime: 6
---

**Lập trình nhúng (embedded programming)** là viết phần mềm chạy trực tiếp trên một thiết bị phần cứng chuyên dụng — không phải trên máy tính đa năng — để điều khiển một chức năng cụ thể: đọc cảm biến, quay động cơ, xử lý tín hiệu, giao tiếp mạng... Khác với lập trình ứng dụng thông thường, code nhúng phải làm việc với tài nguyên rất giới hạn (vài trăm KB RAM, không hiếm khi không có hệ điều hành) và thường phải phản hồi trong thời gian thực.

Câu hỏi đầu tiên khi bắt đầu luôn là: **nên học và chọn nền tảng nào?** Để trả lời, cần hiểu sự khác biệt giữa hai loại chip hay bị nhầm lẫn: vi điều khiển và vi xử lý.

## Vi điều khiển (MCU) — một chip làm tất cả

MCU (Microcontroller Unit) tích hợp **CPU, bộ nhớ chương trình (Flash), RAM và các chân GPIO/ngoại vi ngay trên cùng một chip**. Bạn nạp code thẳng vào Flash của chip, cấp nguồn là chạy — không cần hệ điều hành, không cần ổ cứng rời.

Đặc điểm:
- Chạy **bare-metal** hoặc với một RTOS nhỏ (FreeRTOS...)
- Độ trễ phản hồi cực thấp, đáng tin cậy cho điều khiển thời gian thực
- Giá rẻ, tiêu thụ điện cực thấp (có thể chạy pin cả năm)
- Tài nguyên hạn chế: vài chục KB đến vài MB RAM

Ví dụ: **STM32** (dòng ARM Cortex-M phổ biến trong công nghiệp), **ESP32** (tích hợp sẵn WiFi/Bluetooth, phổ biến cho dự án cá nhân/IoT), **AVR** (nền tảng Arduino cổ điển).

## Vi xử lý (MPU) — cần "hàng xóm" để hoạt động

MPU (Microprocessor Unit) chỉ có **CPU** trên chip — không có RAM hay bộ nhớ lưu trữ tích hợp đáng kể. Để chạy được, nó cần các chip rời bên ngoài: RAM (DDR), bộ nhớ lưu trữ (eMMC/SSD), và gần như luôn cần một **hệ điều hành đầy đủ** (Linux) để quản lý tài nguyên.

Đặc điểm:
- Xung nhịp cao, nhiều nhân, xử lý được khối lượng tính toán lớn
- Chạy Linux/ROS2, dễ dùng thư viện xử lý ảnh, AI, SLAM
- Tiêu thụ điện cao hơn nhiều so với MCU, cần tản nhiệt
- Không phù hợp cho vòng điều khiển động cơ tần số cao vì hệ điều hành có độ trễ không xác định (non-deterministic)

Ví dụ: **NVIDIA Jetson** (mạnh về AI/thị giác máy tính), **Raspberry Pi** (đa dụng, cộng đồng lớn).

## Bảng so sánh nhanh

| Tiêu chí | MCU | MPU |
|---|---|---|
| Bộ nhớ | Tích hợp trên chip | Cần RAM/lưu trữ rời |
| Hệ điều hành | Không cần (bare-metal/RTOS) | Cần (Linux...) |
| Độ trễ | Thấp, xác định (deterministic) | Cao hơn, không xác định |
| Sức mạnh tính toán | Thấp–trung bình | Cao |
| Ứng dụng trong robot | Điều khiển động cơ, đọc encoder, PID | SLAM, path planning, xử lý ảnh/AI |

Trong một AMR thực tế, cả hai thường **cùng tồn tại**: MCU đảm nhiệm vòng điều khiển động cơ tốc độ cao ở tầng thấp, giao tiếp (qua UART/CAN) với một MPU chạy ROS2 ở tầng cao để lo việc "hiểu môi trường và ra quyết định".

## Ví dụ code

Đoạn code dưới đây nháy một LED trên STM32 bằng thư viện HAL — chạy trực tiếp trên MCU, không có hệ điều hành, không có `main()` nào khác đang chạy song song:

```c
// Comment giải thích đoạn code làm gì: nháy LED bare-metal trên STM32
while (1) {
    HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
    HAL_Delay(500); // chặn hoàn toàn CPU trong 500ms
}
```

Trên một MPU chạy Linux, việc tương đương lại phải đi qua một tiến trình hệ điều hành, với độ trễ không đảm bảo tuyệt đối:

```python
import RPi.GPIO as GPIO
import time

while True:
    GPIO.output(5, not GPIO.input(5))
    time.sleep(0.5)  # hệ điều hành có thể trì hoãn tiến trình này
```

Với LED thì sai khác vài mili-giây không quan trọng. Nhưng với vòng điều khiển PID cho động cơ cần chạy ổn định ở 1000 Hz, sự khác biệt này là lý do vì sao phần điều khiển thời gian thực luôn nên nằm trên MCU, không phải MPU.

## Kết luận

MCU và MPU không cạnh tranh nhau mà bổ sung cho nhau trong một robot hoàn chỉnh. Bài tiếp theo sẽ đi sâu vào chính vòng lặp điều khiển chạy trên MCU đó — mô hình **Sense → Think → Act** làm nền tảng cho mọi hệ thống điều khiển robot.
