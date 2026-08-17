> **Lưu ý:** Đây là sản phẩm mô hình phục vụ mục đích nghiên cứu, dùng để kiểm chứng kiến trúc phần cứng/phần mềm của một robot di động tự hành trong nhà — không phải sản phẩm thương mại hoàn thiện.

## Atlas A2 khác gì so với 2 dự án trước

[Robot Mecanum](/du-an/mecanum-robot) dùng ESP32 + Raspberry Pi 4, [Diff Robot](/du-an/diff-robot) dùng Arduino/ESP32 + Raspberry Pi 4 — cả hai đều là mô hình thử nghiệm kiến trúc ROS2 cơ bản. Atlas A2 là bước nâng cấp tiếp theo: vẫn giữ bánh Mecanum (omnidirectional) nhưng thay Raspberry Pi 4 bằng **Jetson Orin Nano** — máy tính nhúng có GPU CUDA, đủ mạnh để chạy đồng thời SLAM, Nav2 **và** một mô hình nhận diện vật thể (YOLOv8) theo thời gian thực, việc mà Raspberry Pi 4 (chỉ có CPU) khó đảm đương mượt mà cùng lúc. Ngoài ra, Atlas A2 bổ sung hai năng lực mà hai robot trước chưa có: **tự động về trạm sạc** khi hết pin, và một **hệ thống điều khiển hai lớp** (app PyQt5 trên PC cho operator + app cảm ứng trên chính robot) giao tiếp qua REST API/WebSocket thay vì chỉ dùng RViz2 để quan sát.

## Kiến trúc hệ thống

![Kiến trúc hệ thống Atlas A2](/projects/atlas-a2/system-architecture.svg)

Hệ thống chia 3 tầng, tương tự triết lý của hai dự án trước nhưng phần tính toán được dồn hết vào một máy duy nhất đặt ngay trên robot:

- **Phần cứng & cảm biến** — TSDA-C12D điều khiển 4 động cơ brushless TODE qua CAN bus (bánh Supo mecanum), RPlidar A2M12 quét 360°, cảm biến từ trường 16-kênh (Modbus RTU) dành riêng cho docking, ESP32 giám sát va chạm và nút dừng khẩn cấp phần cứng
- **Jetson Orin Nano (ROS2 Humble)** — chạy đồng thời `slam_toolbox`/AMCL, Nav2, node `line_follow.py` (docking) và YOLOv8; đây là điểm khác biệt lớn nhất so với 2 dự án Raspberry Pi 4 trước
- **PC — điều khiển & giám sát** — `atlas_api` (Flask) mở REST API cổng 8080 và WebSocket cổng 8081, đóng vai trò cầu nối giữa mạng ROS2 (DDS) và app điều khiển `atlas_app` (PyQt5)

App cảm ứng gắn trên robot (`atlas_app_robot`) không nói chuyện trực tiếp với `atlas_app` trên PC — cả hai đều là **client độc lập** gọi cùng một `atlas_api`, giữ cho robot chỉ có một nguồn sự thật (single source of truth) về trạng thái điều hướng.

> **Tóm lại:** So với kiến trúc "tính toán trên robot, giám sát qua RViz2 trên máy riêng" của hai dự án trước, Atlas A2 tách hẳn một tầng dịch vụ (`atlas_api`) ở giữa — cho phép nhiều client (PC, touchscreen, và về sau là app di động) cùng điều khiển một robot mà không cần biết chi tiết ROS2 bên dưới.

## SLAM, AMCL và Nav2 — vẫn nền tảng quen thuộc, thêm lựa chọn controller

Về lý thuyết, Atlas A2 dùng đúng bộ ba đã trình bày ở dự án Diff Robot: `slam_toolbox` dựng bản đồ, AMCL định vị trên bản đồ tĩnh bằng bộ lọc hạt, Nav2 điều phối `planner_server` → `smoother_server` → `controller_server` qua behavior tree (`bt_navigator`). Điểm khác: README liệt kê rõ Nav2 chạy với lựa chọn **DWB hoặc MPPI controller** cho tầng bám quỹ đạo (`controller_server`):

| | DWB (Dynamic Window Approach) | MPPI (Model Predictive Path Integral) |
|---|---|---|
| Cách hoạt động | Lấy mẫu một tập vận tốc (v, ω) khả thi trong "cửa sổ động", chấm điểm từng mẫu theo hàm chi phí, chọn mẫu tốt nhất | Lấy mẫu hàng trăm quỹ đạo tương lai bằng mô hình động học, tối ưu lặp lại theo phân phối xác suất (path integral) |
| Chi phí tính toán | Thấp, ổn định trên phần cứng yếu | Cao hơn — cần GPU/CPU nhiều nhân để mượt, phù hợp với Jetson Orin Nano |
| Chất lượng quỹ đạo | Tốt cho không gian đơn giản, dễ tinh chỉnh | Mượt hơn trong không gian hẹp, nhiều vật cản động |

Với Raspberry Pi 4 (2 dự án trước), DWB gần như là lựa chọn bắt buộc vì giới hạn CPU. Trên Jetson Orin Nano, MPPI trở thành lựa chọn khả thi — đánh đổi nhiều tài nguyên tính toán hơn để lấy quỹ đạo mượt hơn trong nhà (hành lang hẹp, nhiều góc khuất).

## Auto-docking bằng bám vạch từ trường

Đây là năng lực chưa từng có ở hai dự án trước. Khi pin dưới ngưỡng cài đặt (`Charge threshold`, mặc định 20% theo giao diện app), robot tự thực hiện chuỗi **nav → dock**: Nav2 điều hướng đến gần trạm sạc bằng waypoint đã lưu (`charging_pile`), sau đó chuyển giao cho một state machine riêng bám theo vạch từ trường để căn chỉnh chính xác — GPS/AMCL đủ tốt để đưa robot đến *gần* trạm, nhưng độ chính xác vài cm cần thiết để hai tiếp điểm sạc chạm khớp thì phải dựa vào cảm biến từ trường 16-kênh gắn sát gầm robot.

![Auto-docking — state machine của line_follow.py](/projects/atlas-a2/docking-state-machine.svg)

- **INIT** — dò tìm vạch từ bằng cảm biến 16-kênh
- **SEARCH** — nếu chưa thấy vạch ngay, quét ±45° quanh vị trí hiện tại
- **FOLLOW** — bám vạch, tiến dần về trạm sạc
- **STOPPED** — hết vạch từ (đến cuối đường ray) nghĩa là đã vào đúng vị trí sạc; robot publish vận tốc 0 trong 5 giây rồi thoát tiến trình — `atlas_api_node` phát hiện tiến trình con kết thúc và set `/atlas/docked = true`

Khi có lệnh di chuyển mới trong lúc đang docked, robot **tự undock**: lùi thẳng 30cm ra khỏi trạm trước khi nhận nav goal bình thường — tránh việc Nav2 cố tính đường đi ngay từ vị trí sát trạm sạc, nơi costmap cục bộ thường nhiễu vì khung sạc kim loại.

> **Tóm lại:** Docking tách thành 2 pha rõ ràng — điều hướng thô bằng Nav2 (chính xác cỡ chục cm) và căn chỉnh tinh bằng bám vạch từ trường (chính xác cỡ mm) — một pattern phổ biến trong robot dịch vụ thương mại, không thể giải quyết chỉ bằng AMCL/Nav2 đơn thuần.

## Lớp điều khiển: REST API, WebSocket và hai ứng dụng PyQt5

Hai dự án trước chỉ có RViz2 để quan sát — không có cách điều khiển từ xa ngoài `ros2 topic pub` thủ công. Atlas A2 xây hẳn một tầng dịch vụ:

| Endpoint | Method | Chức năng |
|---|---|---|
| `/atlas/status` | GET | Trạng thái tổng hợp (nav, battery, docked...) |
| `/atlas/nav/goal` | POST | Gửi nav goal `{x, y, yaw}` |
| `/atlas/nav/cancel` | POST | Huỷ nav |
| `/atlas/nav/dock` | POST | Bắt đầu line-follow docking |
| `/atlas/nav/dock_stop` | POST | Dừng docking |
| `/atlas/nav/charge` | POST | Chuỗi đầy đủ: nav → dock |
| `/atlas/waypoints` | GET/POST | Danh sách waypoints |
| `/atlas/launch/status` | GET | Trạng thái các node ROS2 |

WebSocket (`ws://<PC_IP>:8081`) broadcast trạng thái ở tần số 5Hz — đủ nhanh để app hiển thị pose, laser scan, battery gần như realtime mà không cần polling REST liên tục.

`atlas_app` (chạy trên PC, dành cho operator) hiển thị bản đồ, cho phép click đặt Nav Goal/Set Pose, đo khoảng cách, quản lý waypoints kéo-thả, vẽ tường ảo và vùng đặc biệt trực tiếp trên bản đồ, có "Build mode" để teleop bằng bàn phím trong lúc SLAM. `atlas_app_robot` (chạy ngay trên màn hình cảm ứng gắn trên robot) là bản rút gọn — danh sách waypoints dạng nút lớn, theo dõi route, nút xác nhận — tối ưu cho thao tác chạm trực tiếp tại chỗ thay vì phải mang laptop theo robot.

## Nhận diện vật thể với YOLOv8

Camera USB UVC stream video qua `atlas_api`, xử lý bằng YOLOv8 (package `yolov8_msgs` định nghĩa message riêng cho kết quả detection) để nhận diện vật thể theo thời gian thực — ứng dụng rõ nhất là hỗ trợ tránh vật cản động (người, đồ vật di chuyển) mà LiDAR 2D của Nav2 khó phân loại được là "vật cản tĩnh hay đang di chuyển". Đây là khối tính toán nặng nhất lý giải cho việc chọn Jetson Orin Nano thay vì tiếp tục dùng Raspberry Pi 4 — suy luận (inference) một mô hình YOLO theo thời gian thực gần như bất khả thi trên CPU thuần của Pi 4 nếu chạy song song với SLAM/Nav2.

## Phần cứng thực tế

Từ ảnh chụp thực tế của robot: nguồn dùng **2× pin Lithium-ion CSC 12VDC 40Ah**, dán nhãn "PowerBattery"/"LITHIUM-ION — ISO 9001:2015" — dung lượng lớn hơn đáng kể so với pin 3S RC dùng ở Diff Robot, phù hợp với việc phải nuôi thêm Jetson Orin Nano và YOLO liên tục. Phía trên khung là bảng điều khiển màu xanh dương với nút dừng khẩn cấp (E-Stop) màu đỏ, đèn cảnh báo xoay, còi báo, màn hình cảm ứng (`atlas_app_robot`) và cổng sạc — toàn bộ đặt lộ thiên, dễ thao tác khi đứng cạnh robot thay vì phải mở nắp.

| Thành phần | Model | Kết nối |
|---|---|---|
| Máy tính chính | Jetson Orin Nano Developer Kit (Super) | — |
| Driver động cơ | TSDA-C12D | USB-CAN |
| Động cơ | TODE brushless × 4 | CAN bus |
| Bánh xe | Supo mecanum | — |
| LiDAR | RPlidar A2M12 | USB |
| Cảm biến từ trường | 16-kênh analog | USB, Modbus RTU |
| Cảm biến va chạm | ESP32 | USB |
| Pin (BMS) | 2× CSC Lithium-ion 12VDC 40Ah | USB, Modbus RTU |
| Camera | USB UVC (v4l2) | — |

> **Lưu ý phần cứng từ README:** nên dùng USB hub có nguồn riêng (powered) — hub không nguồn dễ gây lỗi `ETIMEDOUT` khi nhiều thiết bị USB (LiDAR, cảm biến từ, ESP32, pin) cùng khởi động lúc boot.

## Khắc phục sự cố thường gặp

Bảng dưới trích từ tài liệu vận hành thực tế của dự án — phản ánh đúng những lỗi đã gặp khi triển khai, không phải danh sách lý thuyết:

| Triệu chứng | Nguyên nhân | Giải pháp |
|---|---|---|
| RPlidar không có `/scan` khi boot | USB chưa ổn định lúc systemd start | `ExecStartPre=/bin/sleep 15` trong service |
| Thiết bị USB timeout (`ETIMEDOUT -110`) | USB hub không có nguồn riêng | Dùng powered USB hub |
| App robot không kết nối được API | `API_HOST` cấu hình sai | Sửa `setup/start_app_robot.sh` |
| DDS không thấy topic cross-machine | AP client isolation bật trên router | Tắt trên router, kiểm tra `ROS_DOMAIN_ID` khớp nhau |
| `line_follow` không bám vạch | `SENSOR_GATE`/`THRESHOLD_SUM` sai | Điều chỉnh tham số trong `line_follow.py` |
| Nav2 không nhận goal | `atlas_api` chưa chạy hoặc Nav2 chưa sẵn sàng | Kiểm tra `ros2 topic list`, action `/navigate_to_pose` |

## Tổng kết và hướng phát triển

### Tổng kết

Atlas A2 là phiên bản trưởng thành hơn của hướng nghiên cứu bắt đầu từ Robot Mecanum và Diff Robot: giữ nguyên bài toán cốt lõi (SLAM + Nav2 trên ROS2), nhưng nâng cấp phần cứng tính toán (Jetson Orin Nano) để mở khoá thêm hai khả năng mà kiến trúc Raspberry Pi 4 khó làm tốt cùng lúc — nhận diện vật thể bằng YOLO theo thời gian thực, và một tầng dịch vụ REST/WebSocket phục vụ nhiều client điều khiển đồng thời. Auto-docking bằng bám vạch từ trường giải quyết đúng vấn đề mà AMCL/Nav2 không được thiết kế để giải quyết: căn chỉnh chính xác cấp mm.

### Hướng phát triển

- **Thay ArUco marker cho docking** — `Dock method` trong app đã có sẵn lựa chọn `aruco` (đánh dấu "future") bên cạnh `line_follow` hiện tại — hướng tới docking không cần lắp thêm vạch từ trường vật lý
- **Bổ sung benchmark DWB vs MPPI** — đo định lượng độ mượt quỹ đạo và tải CPU/GPU giữa hai controller trên cùng một bản đồ, thay vì chỉ có tuỳ chọn cấu hình
- **Mở rộng YOLO thành hành vi né vật cản chủ động** — hiện tại nhận diện mới dừng ở mức stream + hiển thị `/inference_result`, chưa thấy phản hồi ngược lại costmap hoặc hành vi điều hướng
- **Kênh điều khiển di động** — `atlas_app_robot` chứng minh mô hình "nhiều client cùng gọi `atlas_api`" hoạt động tốt, có thể mở rộng thêm app di động (điện thoại) theo đúng kiến trúc sẵn có mà không cần đổi backend
