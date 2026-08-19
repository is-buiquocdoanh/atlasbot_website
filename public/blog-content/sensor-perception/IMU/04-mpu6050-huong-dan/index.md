---
title: "MPU6050: hướng dẫn đọc dữ liệu IMU 6 trục phổ biến nhất"
slug: "mpu6050-huong-dan"
category: "Sensor & Perception"
subcategory: "IMU"
level: 2
tags: ["imu", "mpu6050", "i2c", "arduino"]
publishedAt: "2026-08-18"
author: "Atlasbot"
coverImage: "mpu6050.svg"
excerpt: "MPU6050 là IMU 6 trục giá rẻ phổ biến nhất trong robot DIY, giao tiếp I2C đơn giản — hướng dẫn đọc dữ liệu accelerometer và gyroscope bằng Arduino."
readingTime: 6
---

Trong số rất nhiều loại IMU trên thị trường, **MPU6050** là cái tên quen thuộc nhất với người mới học robot DIY — giá rẻ, giao tiếp I2C đơn giản, thư viện Arduino/ESP32 có sẵn cho gần như mọi trường hợp sử dụng.

![MPU6050 giao tiếp I2C, kết hợp accelerometer và gyroscope 6 trục](mpu6050.svg)

## Thông số cơ bản

MPU6050 là IMU **6 trục** (6-DOF): 3 trục accelerometer + 3 trục gyroscope trong cùng một chip, không có magnetometer (khác với MPU9250 — bản 9 trục có thêm la bàn số).

| Thông số | Giá trị |
|---|---|
| Accelerometer | ±2/±4/±8/±16g (chỉnh được) |
| Gyroscope | ±250/±500/±1000/±2000°/giây (chỉnh được) |
| Giao tiếp | I2C (địa chỉ mặc định 0x68, hoặc 0x69 nếu nối chân AD0 lên cao) |
| Điện áp | 3.3–5V (module thường có sẵn LDO chuyển áp) |

## Đọc dữ liệu bằng Arduino

```cpp
#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

void setup() {
  Serial.begin(115200);
  Wire.begin();
  mpu.initialize();

  if (!mpu.testConnection()) {
    Serial.println("Không kết nối được MPU6050 — kiểm tra dây I2C (SDA/SCL)");
  }
}

void loop() {
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  Serial.print("Accel: "); Serial.print(ax); Serial.print(",");
  Serial.print(ay); Serial.print(","); Serial.println(az);
  Serial.print("Gyro: "); Serial.print(gx); Serial.print(",");
  Serial.print(gy); Serial.print(","); Serial.println(gz);

  delay(100);
}
```

Giá trị đọc được là số nguyên thô (raw) — cần chia theo hệ số độ nhạy tương ứng với dải đo đã chọn để ra đơn vị thật (m/s² hoặc độ/giây), thông tin này có trong datasheet MPU6050.

### Lỗi thường gặp

- **`testConnection()` trả về false:** thường do đấu nhầm chân SDA/SCL, thiếu điện trở pull-up (một số module không có sẵn), hoặc nối nhầm điện áp (một số bản module chỉ chịu 3.3V dù ghi hỗ trợ 5V).
- **Dữ liệu gyro trôi dần dù không di chuyển:** đây là hiện tượng drift bình thường của mọi gyroscope MEMS giá rẻ — xem thêm bài Gyroscope là gì? để hiểu nguyên nhân và cách khắc phục.

## Kết luận

MPU6050 là lựa chọn khởi đầu hợp lý để học và thử nghiệm với dữ liệu IMU nhờ giá rẻ và cộng đồng hỗ trợ lớn. Với ứng dụng thực tế cần độ chính xác cao hơn hoặc cần magnetometer, nên cân nhắc các dòng cao cấp hơn như MPU9250 hoặc BNO055 (có sẵn bộ lọc hợp nhất cảm biến ngay trên chip).
