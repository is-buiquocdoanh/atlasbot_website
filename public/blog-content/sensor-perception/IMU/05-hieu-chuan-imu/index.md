---
title: "Hiệu chuẩn IMU (IMU Calibration): loại bỏ sai số hệ thống"
slug: "hieu-chuan-imu"
category: "Sensor & Perception"
subcategory: "IMU"
level: 2
tags: ["imu", "calibration", "cam-bien"]
publishedAt: "2026-08-18"
author: "Atlasbot"
coverImage: "imu-calibration.svg"
excerpt: "IMU giá rẻ luôn có sai số hệ thống (bias) — hiệu chuẩn giúp đo và trừ đi sai số này trước khi dùng dữ liệu cho odometry hay giữ thăng bằng."
readingTime: 5
---

Đặt một IMU nằm yên hoàn toàn trên bàn, gyroscope lẽ ra phải báo vận tốc góc = 0 trên cả 3 trục — nhưng thực tế luôn có một giá trị lệch nhỏ, gọi là **bias** (sai số hệ thống, offset). Nếu không loại bỏ bias này, robot sẽ "tưởng" mình đang quay dù đang đứng yên — dẫn tới odometry hoặc dữ liệu giữ thăng bằng sai lệch tích luỹ dần theo thời gian.

![Hiệu chuẩn IMU đo và trừ đi bias khi cảm biến đứng yên](imu-calibration.svg)

## Bias đến từ đâu

IMU giá rẻ (loại MEMS như MPU6050) sản xuất hàng loạt luôn có sai số nhỏ giữa các chip khác nhau — không con chip nào cho giá trị 0 tuyệt đối khi đứng yên hoàn toàn, dù cùng model. Ngoài ra, bias còn thay đổi nhẹ theo nhiệt độ môi trường, nghĩa là hiệu chuẩn lúc sáng có thể hơi lệch so với buổi trưa nắng nóng.

## Cách hiệu chuẩn cơ bản: lấy trung bình lúc đứng yên

Cách đơn giản và phổ biến nhất: giữ IMU hoàn toàn đứng yên vài giây khi khởi động, đọc nhiều mẫu liên tiếp, tính trung bình — giá trị trung bình này chính là bias, trừ đi mỗi lần đọc dữ liệu sau đó.

```cpp
const int SAMPLES = 200;
float gyroZ_bias = 0;

void calibrateGyro() {
  long sum = 0;
  for (int i = 0; i < SAMPLES; i++) {
    int16_t gz = mpu.getRotationZ();
    sum += gz;
    delay(5);
  }
  gyroZ_bias = sum / (float)SAMPLES;   // giá trị lệch khi đứng yên
}

void loop() {
  int16_t raw = mpu.getRotationZ();
  float gyroZ_calibrated = raw - gyroZ_bias;   // trừ bias trước khi dùng
}
```

**Lưu ý quan trọng:** robot phải đứng hoàn toàn yên trong lúc hiệu chuẩn — nếu bị rung động hoặc di chuyển nhẹ trong lúc lấy mẫu, bias tính ra sẽ sai, khiến dữ liệu sau đó còn lệch nhiều hơn cả khi không hiệu chuẩn.

## Hiệu chuẩn accelerometer

Với accelerometer, cách tương tự nhưng phức tạp hơn một chút — cần đặt cảm biến ở 6 hướng khác nhau (mỗi trục hướng lên và hướng xuống) để tách riêng được bias khỏi giá trị trọng lực thật, thay vì chỉ đo ở một tư thế như gyroscope.

## Kết luận

Hiệu chuẩn IMU là bước đơn giản nhưng dễ bị bỏ qua khi mới bắt đầu — chỉ vài dòng code lấy trung bình lúc đứng yên đã loại bỏ được phần lớn sai số hệ thống, giúp dữ liệu gyroscope/accelerometer đáng tin cậy hơn hẳn cho các bước tiếp theo như tính odometry hay giữ thăng bằng.
