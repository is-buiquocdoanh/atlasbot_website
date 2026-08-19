---
name: "Cảm biến LiDAR YDLIDAR X3 Pro"
slug: "cam-bien-lidar-ydlidar-x3-pro"
sku: "YDL-X3PRO"
category: "Cảm biến"
price: 2490000
stock: 8
images: []
highlights:
  - icon: "range"
    label: "Tầm quét"
    value: "0.12 – 8m"
  - icon: "scan-rate"
    label: "Tần số quét"
    value: "~8 Hz"
  - icon: "resolution"
    label: "Độ phân giải góc"
    value: "~0.7°"
  - icon: "connector"
    label: "Giao tiếp"
    value: "USB (UART qua bo chuyển đổi)"
specifications:
  - groupName: "Quang học & đo khoảng cách"
    rows:
      - label: "Nguyên lý đo"
        value: "Tam giác đạc quang học (triangulation)"
      - label: "Tầm quét"
        value: "0.12 – 8m"
      - label: "Sai số đo"
        value: "±2% (trong tầm 0.5–6m)"
  - groupName: "Hiệu năng quét"
    rows:
      - label: "Góc quét"
        value: "360°"
      - label: "Tần số quét"
        value: "~8 Hz (mặc định)"
      - label: "Độ phân giải góc"
        value: "~0.7° (~500 điểm/vòng)"
  - groupName: "Giao tiếp & nguồn"
    rows:
      - label: "Giao tiếp"
        value: "USB (qua bo chuyển đổi UART-USB đi kèm)"
      - label: "Điện áp cấp"
        value: "5V DC (qua USB)"
      - label: "Dòng tiêu thụ"
        value: "~340mA"
  - groupName: "Kích thước & khối lượng"
    rows:
      - label: "Đường kính"
        value: "Ø75mm"
      - label: "Chiều cao"
        value: "40mm"
      - label: "Khối lượng"
        value: "~140g"
usageSteps:
  - title: "Cài driver ROS2"
    description: "Clone package driver vào workspace, build bằng colcon — xem thêm bài Tạo package C++ nếu cần ôn lại quy trình build."
    codeSnippet: |
      cd ~/ros2_ws/src
      git clone https://github.com/YDLIDAR/ydlidar_ros2_driver.git
      cd ~/ros2_ws
      colcon build --packages-select ydlidar_ros2_driver
      source install/setup.bash
  - title: "Chạy thử và kiểm tra dữ liệu"
    description: "Launch driver rồi kiểm tra topic /scan có dữ liệu hay không bằng ros2 topic hz — xem thêm bài ros2 topic trong blog kỹ thuật."
    codeSnippet: |
      ros2 launch ydlidar_ros2_driver ydlidar_launch.py
      ros2 topic hz /scan
  - title: "Quan sát bằng RViz2"
    description: "Thêm Display kiểu LaserScan cho topic /scan, đặt Fixed Frame đúng theo hệ toạ độ gắn cảm biến để thấy đám mây điểm quét thực tế."
---

LiDAR 2D quét 360° dựa trên nguyên lý tam giác đạc quang học (triangulation) — cảm biến chính cho SLAM và né vật cản thời gian thực trên AMR cỡ nhỏ, trong nhà.

Xuất dữ liệu chuẩn `sensor_msgs/LaserScan` qua driver ROS2 `ydlidar_ros2_driver` — cắm là dùng ngay với slam_toolbox/Cartographer và Nav2 mà không cần viết driver riêng.

## Phù hợp cho

Robot di động trong nhà (kho, nhà xưởng, phòng thí nghiệm) tốc độ thấp-trung bình — đúng loại cảm biến đã dùng trong các dự án robot Mecanum/Diff Robot ở mục Dự án của trang này.
