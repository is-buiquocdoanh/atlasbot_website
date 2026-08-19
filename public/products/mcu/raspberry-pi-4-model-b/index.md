---
name: "Raspberry Pi 4 Model B"
slug: "raspberry-pi-4-model-b"
sku: "RPI4-MODELB"
category: "Vi điều khiển & mạch điều khiển"
price: 1840000
stock: 20
variants:
  - label: "2GB RAM"
    price: 1840000
    stock: 10
  - label: "4GB RAM"
    price: 2410000
    stock: 10
images:
  - file: "01.png"
    alt: "Raspberry Pi 4 Model B — bo mạch nhìn từ trên, đầy đủ cổng kết nối"
highlights:
  - icon: "cpu"
    label: "CPU"
    value: "Broadcom BCM2711, quad-core Cortex-A72 1.5GHz"
  - icon: "ram"
    label: "RAM"
    value: "2GB / 4GB LPDDR4-2400"
  - icon: "connector"
    label: "Kết nối"
    value: "Wi-Fi 5, Bluetooth 5.0, Gigabit Ethernet"
  - icon: "gpio"
    label: "GPIO"
    value: "40 chân đầy đủ (I2C, SPI, UART, PWM)"
features:
  - icon: "cpu"
    title: "Hiệu năng gấp ~3 lần thế hệ trước"
    description: "CPU Cortex-A72 64-bit 1.5GHz, đủ chạy Ubuntu Desktop và ROS2 mượt hơn hẳn Raspberry Pi 3."
  - icon: "connector"
    title: "2 cổng micro-HDMI độc lập"
    description: "Xuất hình đồng thời 2 màn hình, hỗ trợ 4K@60fps trên 1 màn hoặc 4K@30fps cả 2 màn cùng lúc."
  - icon: "gpio"
    title: "GPIO 40 chân tương thích ngược"
    description: "Cùng layout chân với các bản Raspberry Pi trước — HAT và mạch mở rộng cũ vẫn cắm vừa."
specifications:
  - groupName: "Vi xử lý & bộ nhớ"
    rows:
      - label: "CPU"
        value: "Broadcom BCM2711, quad-core Cortex-A72 (ARMv8) 64-bit @ 1.5GHz"
      - label: "RAM"
        value: "LPDDR4-2400 SDRAM — bản 2GB hoặc 4GB"
      - label: "Lưu trữ"
        value: "Khe thẻ MicroSD (khởi động hệ điều hành)"
  - groupName: "Kết nối"
    rows:
      - label: "Wi-Fi"
        value: "802.11ac, băng tần kép 2.4GHz/5GHz"
      - label: "Bluetooth"
        value: "Bluetooth 5.0, BLE"
      - label: "Mạng"
        value: "Gigabit Ethernet"
      - label: "USB"
        value: "2× USB 3.0, 2× USB 2.0"
      - label: "Xuất hình"
        value: "2× micro-HDMI, hỗ trợ 4K@60fps"
      - label: "Camera/Display"
        value: "MIPI CSI 2-lane (camera), MIPI DSI 2-lane (màn hình)"
      - label: "GPIO"
        value: "Header 40 chân tiêu chuẩn"
  - groupName: "Video"
    rows:
      - label: "Giải mã"
        value: "H.265 (4K@60p), H.264 (1080p@60p)"
      - label: "Mã hoá"
        value: "H.264 (1080p@30p)"
  - groupName: "Điện năng & vận hành"
    rows:
      - label: "Nguồn vào"
        value: "5V DC qua USB-C, tối thiểu 3A"
      - label: "Nhiệt độ hoạt động"
        value: "0–50°C"
usageSteps:
  - title: "Flash hệ điều hành ra thẻ microSD"
    description: "Dùng Raspberry Pi Imager để ghi Raspberry Pi OS hoặc Ubuntu Server/Desktop 64-bit ra thẻ microSD — chọn bản 64-bit nếu định chạy ROS2."
  - title: "Cài ROS2"
    description: "Sau khi boot lần đầu và cập nhật hệ thống, cài ROS2 theo hướng dẫn chuẩn cho Ubuntu 22.04 (Humble) — giống hệt quy trình trên Jetson Orin Nano, chỉ khác không có GPU CUDA."
  - title: "Kiểm tra GPIO"
    description: "Xác nhận thư viện GPIO hoạt động trước khi đấu nối cảm biến/động cơ qua header 40 chân."
    codeSnippet: |
      # Python — dùng thư viện gpiozero hoặc RPi.GPIO
      python3 -c "from gpiozero import Device; print(Device.pin_factory)"
---

Máy tính nhúng đa dụng, thân quen nhất với cộng đồng robot/IoT DIY nhờ cộng đồng lớn, tài liệu nhiều, và GPIO 40 chân tương thích ngược với các bản Pi trước — dễ tìm HAT/mạch mở rộng có sẵn.

So với [Jetson Orin Nano Developer Kit](/shop/mcu/jetson-orin-nano-developer-kit), Raspberry Pi 4 rẻ hơn nhiều và đủ dùng tốt cho robot chỉ chạy SLAM/Nav2 thuần tuý (không có tác vụ AI thị giác nặng chạy song song) — vì không có GPU hỗ trợ CUDA. Xem thêm bài [Chọn Computer cho AMR](/blog/chon-computer-cho-amr) trong blog kỹ thuật để so sánh chi tiết khi nào cần lên Jetson.

## Hai bản RAM — chọn theo nhu cầu

- **2GB** — đủ cho robot chạy ROS2 cơ bản (SLAM + Nav2), tiết kiệm chi phí.
- **4GB** — thoải mái hơn khi chạy thêm RViz2/giao diện giám sát trên cùng máy, hoặc nhiều node ROS2 cùng lúc.

## Sơ đồ chân GPIO (40 pin)

![Raspberry Pi 4 Model B — sơ đồ chân GPIO 40 chân đầy đủ](02.png)

Header 40 chân hỗ trợ đầy đủ các chuẩn giao tiếp phổ biến trong nhúng — I2C (SDA/SCL), SPI (MOSI/MISO/SCLK/CE0/CE1), UART (TXD/RXD), và nhiều chân PWM — đủ để đấu cảm biến IMU/LiDAR qua I2C/UART, hoặc điều khiển driver động cơ qua GPIO thường, mà không cần thêm vi điều khiển trung gian cho các tác vụ đơn giản.

> **Lưu ý:** Chân GPIO chạy ở mức điện áp 3.3V — không chịu được 5V trực tiếp. Cảm biến/module dùng mức 5V cần qua mạch chuyển mức (level shifter) trước khi đấu vào GPIO.
