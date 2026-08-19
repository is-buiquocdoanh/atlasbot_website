---
name: "Cảm biến IMU MPU6050 (Gyroscope + Accelerometer)"
slug: "cam-bien-imu-mpu6050"
sku: "IMU-MPU6050"
category: "Cảm biến"
price: 45000
stock: 40
images: []
highlights:
  - icon: "range"
    label: "Số trục"
    value: "6 trục (3 gyro + 3 accel)"
  - icon: "connector"
    label: "Giao tiếp"
    value: "I2C"
  - icon: "voltage"
    label: "Điện áp"
    value: "3.3–5V"
specifications:
  - groupName: "Cảm biến"
    rows:
      - label: "Accelerometer"
        value: "±2/±4/±8/±16g (chỉnh được)"
      - label: "Gyroscope"
        value: "±250/±500/±1000/±2000°/s"
  - groupName: "Giao tiếp & nguồn"
    rows:
      - label: "Giao tiếp"
        value: "I2C (địa chỉ 0x68/0x69)"
      - label: "Điện áp"
        value: "3.3–5V (có sẵn LDO trên board)"
---

IMU 6 trục giá rẻ, phổ biến nhất trong robot DIY — kết hợp accelerometer (đo gia tốc, ước lượng góc nghiêng tĩnh) và gyroscope (đo vận tốc góc, độc lập với việc bánh xe có trượt hay không).

Giao tiếp I2C đơn giản, thư viện hỗ trợ sẵn cho hầu hết Arduino/ESP32 — xem thêm bài IMU là gì? trong blog kỹ thuật để hiểu nguyên lý trước khi lắp.
