---
name: "Jetson Orin Nano Developer Kit"
slug: "jetson-orin-nano-developer-kit"
sku: "JETSON-ORIN-NANO-DK"
category: "Vi điều khiển & mạch điều khiển"
price: 6490000
stock: 5
badge: "Hàng mới"
images: []
highlights:
  - icon: "cpu"
    label: "CPU"
    value: "6-core ARM Cortex-A78AE"
  - icon: "gpu"
    label: "GPU"
    value: "1024-core Ampere, hỗ trợ CUDA"
  - icon: "ram"
    label: "RAM"
    value: "8GB LPDDR5"
  - icon: "connector"
    label: "Kết nối"
    value: "USB 3.2, Gigabit Ethernet, CSI camera"
specifications:
  - groupName: "Vi xử lý"
    rows:
      - label: "CPU"
        value: "6-core Arm Cortex-A78AE v8.2 64-bit"
      - label: "GPU"
        value: "NVIDIA Ampere, 1024 CUDA cores + 32 Tensor cores"
      - label: "Hiệu năng AI"
        value: "~67 TOPS (chế độ Super)"
  - groupName: "Bộ nhớ & lưu trữ"
    rows:
      - label: "RAM"
        value: "8GB 128-bit LPDDR5"
      - label: "Lưu trữ"
        value: "khe microSD + hỗ trợ NVMe qua M.2 Key M"
  - groupName: "Kết nối"
    rows:
      - label: "USB"
        value: "4× USB 3.2 Gen2"
      - label: "Mạng"
        value: "Gigabit Ethernet"
      - label: "Camera"
        value: "2× MIPI CSI-2 (22-pin)"
      - label: "Khác"
        value: "M.2 Key M (NVMe), M.2 Key E (WiFi/BT), DisplayPort"
  - groupName: "Điện năng"
    rows:
      - label: "Nguồn vào"
        value: "DC jack 5V⎓4A (barrel jack), hoặc USB-C"
      - label: "Công suất tiêu thụ"
        value: "7–25W tuỳ chế độ (power mode)"
usageSteps:
  - title: "Flash JetPack SDK"
    description: "Dùng NVIDIA SDK Manager (chạy trên máy Ubuntu host) hoặc ghi image JetPack có sẵn ra thẻ microSD/SSD NVMe tuỳ cấu hình bo mạch."
  - title: "Cài ROS2 Humble"
    description: "Sau khi boot lần đầu và cập nhật hệ thống, cài ROS2 theo hướng dẫn chuẩn cho Ubuntu 22.04 — không khác gì cài trên máy tính thường."
  - title: "Kiểm tra GPU khả dụng cho AI"
    description: "Xác nhận CUDA hoạt động trước khi triển khai mô hình nhận diện vật thể (YOLO...) chạy song song với SLAM/Nav2."
    codeSnippet: |
      sudo tegrastats   # theo dõi tải CPU/GPU realtime
      python3 -c "import torch; print(torch.cuda.is_available())"
---

Máy tính nhúng có GPU CUDA — lựa chọn cần thiết khi robot phải chạy đồng thời SLAM/Nav2 **và** một mô hình AI thị giác (YOLO...) theo thời gian thực, việc mà máy tính nhúng chỉ có CPU (như Raspberry Pi 4) khó đảm đương mượt cùng lúc.

Chạy được Ubuntu + ROS2 Humble đầy đủ qua JetPack SDK của NVIDIA — cùng nền tảng đã dùng trong dự án Atlas A2 ở mục Dự án của trang này.

## Khi nào cần bản Jetson thay vì Raspberry Pi

Nếu robot chỉ chạy SLAM + Nav2 thuần tuý (không có tác vụ AI thị giác chạy song song), Raspberry Pi 4 thường đã đủ và rẻ hơn nhiều. Chỉ nên chọn Jetson khi có tác vụ cần GPU thực sự — xem thêm bài Chọn Computer cho AMR trong blog kỹ thuật để so sánh chi tiết.
