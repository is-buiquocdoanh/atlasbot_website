> **Lưu ý:** Đây là sản phẩm mô hình phục vụ mục đích nghiên cứu, dùng để kiểm chứng kiến trúc phần cứng/phần mềm của một robot di động tự hành cỡ nhỏ — không phải sản phẩm thương mại hoàn thiện.

## Nguyên lý & mô hình động học robot vi sai

Khác với bánh Mecanum, robot vi sai (differential drive) chỉ dùng **2 bánh chủ động** gắn cùng một trục, quay độc lập nhau, cộng thêm bánh đỡ tự lựa (caster) để giữ thăng bằng. Đây là cấu hình phổ biến nhất trong robot di động nhờ cơ khí đơn giản, giá thành thấp, và độ chính xác odometry cao hơn Mecanum (bánh tiếp xúc mặt sàn liên tục, không qua các con lăn rời rạc).

![Mô hình động học robot vi sai](/projects/diff-robot/diff-drive-kinematics.svg)

### Cách robot di chuyển

- **Tiến/lùi thẳng** — 2 bánh quay cùng tốc độ, cùng chiều
- **Rẽ cong** — 2 bánh quay cùng chiều nhưng khác tốc độ (bánh trong cua chậm hơn bánh ngoài cua)
- **Xoay tại chỗ** — 2 bánh quay ngược chiều nhau, cùng tốc độ

### Phương trình động học

```text
v = (v_right + v_left) / 2          — vận tốc dài của robot
ω = (v_right − v_left) / L          — vận tốc góc, L = khoảng cách 2 bánh (wheelbase)
```

Chiều ngược lại (từ lệnh `/cmd_vel` mong muốn ra tốc độ từng bánh cần đặt) — chính là phép tính node `cmdvel_to_motorcommand.py` (package `diff_serial_bridge`) thực hiện mỗi khi nhận lệnh điều khiển:

```text
v_left  = v − ω·L/2
v_right = v + ω·L/2
```

> **Tóm lại:** Robot vi sai không thể đi ngang (strafe) như Mecanum — muốn dịch chuyển sang một hướng bất kỳ luôn phải xoay đầu trước. Đổi lại, việc chỉ cần điều khiển 2 động cơ (thay vì 4) giúp mô hình động học đơn giản hơn và sai số odometry tích luỹ từ encoder thường thấp hơn.

## Giao tiếp Serial giữa ROS2 và Arduino/ESP32

Tầng thấp (Arduino Nano/ESP32) và tầng tính toán (Raspberry Pi 4 chạy ROS2) trao đổi dữ liệu qua cổng Serial UART 57600 baud bằng một tập lệnh dạng text đơn giản, dễ debug trực tiếp qua terminal:

![Giao tiếp ROS2 ↔ Arduino qua Serial](/projects/diff-robot/serial-communication.svg)

| Lệnh gửi xuống Arduino | Ý nghĩa |
|---|---|
| `o [pwm_trái] [pwm_phải]` | Đặt PWM cho động cơ trái/phải |
| `e` | Yêu cầu đọc encoder — Arduino trả về `"e_left e_right"` |
| `r` | Reset giá trị encoder về 0 |

Dữ liệu được đóng gói qua các message type riêng định nghĩa trong package `diff_serial_mgs` (`MotorCommand`, `EncoderVals`, `MotorVels`) thay vì dùng kiểu dữ liệu ROS2 chuẩn — giúp giao diện giữa các node rõ ràng, đúng ngữ nghĩa. Luồng xử lý đầy đủ:

```text
/cmd_vel (Twist)
     │
     ▼
cmdvel_to_motorcommand.py  →  tính v_left, v_right theo mô hình động học
     │
     ▼
diff_serial_bridge.py  →  gửi "o [pwm] [pwm]" qua Serial xuống Arduino
     │
     ▼
Arduino: đọc lệnh → xuất PWM cho driver động cơ
     │  (định kỳ gửi lại "e_left e_right")
     ▼
encoder_to_odom.py (package robot_kinematic)  →  tính odometry, publish /odom + TF
```

> **Tóm lại:** Toàn bộ giao tiếp giữa "bộ não" ROS2 và phần cứng động cơ chỉ đi qua vài lệnh text đơn giản qua Serial — không cần driver phức tạp, dễ kiểm tra bằng tay khi debug (mở terminal serial, gõ thẳng lệnh `o 100 100` là động cơ quay ngay).

## Cảm biến LiDAR: hai lựa chọn phần cứng

Dự án hỗ trợ sẵn 2 loại LiDAR thay thế cho nhau — package `ydlidar_ros2_driver` và `rplidar_launch` đều có mặt trong mã nguồn, cho phép chọn tuỳ theo phần cứng đang có:

| | YDLIDAR X3 Pro | RPLIDAR A1 / A2 |
|---|---|---|
| Hãng | EAI (YDLIDAR) | Slamtec |
| Nguyên lý đo | Tam giác đạc quang học (triangulation) | Tam giác đạc quang học (triangulation) |
| Tầm đo tham khảo | ~0,12 – 8m | ~0,15 – 12m (A2 xa hơn A1) |
| Giao tiếp | USB (qua bo chuyển đổi) | USB (qua bo chuyển đổi) |
| Output ROS2 | `sensor_msgs/LaserScan` trên `/scan` | `sensor_msgs/LaserScan` trên `/scan` |

Cả hai cùng nguyên lý tam giác đạc: diode laser chiếu vào vật thể, ánh sáng phản xạ hội tụ lên cảm biến ảnh đặt cách một khoảng baseline cố định, vị trí điểm sáng trên cảm biến ảnh cho biết khoảng cách theo hình học tam giác. Cụm phát–thu quay 360°, mỗi vòng tạo một lần quét gồm nhiều cặp (góc, khoảng cách) — dữ liệu đầu vào chính cho cả SLAM lẫn Nav2.

> **Tóm lại:** Vì cả hai driver đều xuất cùng chuẩn `LaserScan`, phần còn lại của hệ thống (SLAM, Nav2) không cần thay đổi gì khi đổi loại LiDAR — chỉ cần đổi launch file cảm biến tương ứng.

## Lý thuyết nền tảng của SLAM

SLAM (Simultaneous Localization and Mapping) giải quyết đồng thời hai bài toán phụ thuộc lẫn nhau: cần bản đồ đáng tin cậy để định vị chính xác, nhưng cần vị trí chính xác để dựng bản đồ đúng. Mọi hệ SLAM hiện đại tách xử lý thành hai tầng:

- **Front-end** — scan matching: khớp lần quét LiDAR hiện tại với bản đồ cục bộ đã có để ước lượng vị trí tức thời
- **Back-end** — tối ưu định kỳ toàn bộ quỹ đạo dựa trên các ràng buộc đã thu thập, đặc biệt là **loop closure**: khi robot quay lại vị trí đã đi qua, hệ thống nhận diện lại và "kéo" quỹ đạo về đúng vị trí thực, triệt tiêu sai số trôi (drift) tích luỹ.

Dự án cung cấp sẵn **hai lựa chọn SLAM** khác nhau để dựng bản đồ — trình bày chi tiết ở mục kế tiếp.

## Cartographer và SLAM Toolbox — hai lựa chọn dựng bản đồ

Package `robot_mapping` có sẵn cả `cartographer.launch.py` lẫn `slam_toolbox.launch.py`, cho phép so sánh trực tiếp hai hệ SLAM phổ biến nhất trên ROS2:

| Tiêu chí | Cartographer | SLAM Toolbox |
|---|---|---|
| Nhà phát triển | Google | Đội ngũ cộng đồng ROS2 (Steve Macenski) |
| Kiến trúc | Submap + pose-graph optimization (Ceres Solver) | Pose-graph optimization (Ceres/G2O), tối ưu riêng cho ROS2 |
| Chế độ hoạt động | Chủ yếu online (mapping trực tiếp) | Online, offline, và **lifelong mapping** (tiếp tục map trên bản đồ cũ) |
| Lưu trạng thái | Xuất ra Occupancy Grid | Lưu được cả pose-graph (`.posegraph`) để nạp lại và map tiếp |
| Độ phức tạp cấu hình | Nhiều tham số, cần tinh chỉnh kỹ | Ít tham số hơn, dễ tiếp cận hơn |
| Chế độ định vị riêng | Không | Có (Localization mode — tự định vị trên bản đồ có sẵn, thay thế được AMCL) |

> **Tóm lại:** Cartographer phù hợp khi cần độ chính xác cao và đã quen tinh chỉnh tham số; SLAM Toolbox phù hợp khi cần vòng lặp phát triển nhanh, muốn lưu lại tiến trình mapping để tiếp tục sau, hoặc muốn dùng chung một package cho cả mapping lẫn localization.

## Định vị với AMCL (Adaptive Monte Carlo Localization)

Sau khi đã có bản đồ tĩnh (từ Cartographer hoặc SLAM Toolbox), **AMCL** đảm nhiệm việc định vị robot trên chính bản đồ đó — khác với SLAM (vừa xây bản đồ vừa định vị), AMCL giả định bản đồ đã cố định, chỉ tập trung ước lượng vị trí.

![AMCL hội tụ dần bằng bộ lọc hạt](/projects/diff-robot/amcl-localization.svg)

AMCL dùng **bộ lọc hạt (particle filter)** — mỗi "hạt" là một giả thuyết về vị trí (x, y, θ) của robot. Vòng lặp gồm 3 bước lặp lại liên tục:

1. **Dự đoán (predict)** — di chuyển từng hạt theo mô hình chuyển động, dựa trên dữ liệu odometry vừa nhận
2. **Cập nhật trọng số (update)** — so khớp scan LiDAR dự đoán tại vị trí mỗi hạt với scan LiDAR thực đo được; hạt nào dự đoán càng khớp thực tế thì trọng số càng cao
3. **Lấy mẫu lại (resample)** — loại dần các hạt trọng số thấp, nhân bản các hạt trọng số cao quanh vùng có khả năng đúng nhất

Chữ "Adaptive" đến từ kỹ thuật **KLD-sampling**: số lượng hạt được điều chỉnh động — nhiều hạt khi độ bất định còn cao (mới khởi động, chưa rõ vị trí), ít hạt dần khi đã hội tụ — giúp tiết kiệm tài nguyên tính toán đáng kể trên phần cứng giới hạn như Raspberry Pi 4.

> **Tóm lại:** SLAM Toolbox ở chế độ Localization và AMCL cùng giải một bài toán (định vị trên bản đồ có sẵn) theo hai cách tiếp cận khác nhau — dự án có đủ cả hai lựa chọn để thử nghiệm so sánh.

## Cơ sở lý thuyết Navigation2

Nav2 điều phối toàn bộ quá trình đưa robot tới điểm đích, ghép nối nhiều node chuyên biệt được README liệt kê rõ: **map_server, amcl, controller_server, planner_server, smoother_server, bt_navigator, lifecycle_manager**.

### Các thành phần chính

- **planner_server** — tính đường đi tối ưu trên costmap toàn cục, bỏ qua chi tiết động lực học tức thời
- **smoother_server** — xử lý hậu kỳ đường đi vừa tính để loại góc gấp khúc, cho quỹ đạo khả thi hơn về mặt động học trước khi giao cho controller bám theo
- **controller_server** — bám đường đi theo thời gian thực, liên tục điều chỉnh vận tốc để vừa theo quỹ đạo vừa né vật cản phát sinh
- **bt_navigator** — điều phối toàn bộ luồng trên bằng Behavior Tree (cây hành vi): tính đường đi → bám đường đi → nếu thất bại thì chuyển sang hành vi khôi phục (xoay, lùi, chờ) → thử lại

### Lifecycle Manager — quản lý vòng đời node

Các node của Nav2 đều là **managed/lifecycle node** — một loại node ROS2 có trạng thái rõ ràng (`unconfigured → inactive → active → finalized`) thay vì chạy ngay khi khởi động. `lifecycle_manager` điều phối chuyển trạng thái đồng bộ cho toàn bộ hệ thống Nav2: đảm bảo `map_server` đã sẵn sàng trước khi `amcl` khởi động, `amcl` đã active trước khi `planner_server`/`controller_server` bắt đầu nhận lệnh — tránh tình trạng một node chạy trước khi node nó phụ thuộc đã sẵn sàng, vấn đề thường gặp khi khởi động một hệ thống nhiều node phức tạp.

## Kiến trúc hệ thống

![Kiến trúc 3 tầng của hệ thống](/projects/diff-robot/system-architecture.svg)

Toàn hệ thống chia thành 3 tầng, mỗi tầng chỉ giao tiếp với đúng tầng liền kề:

- **Tầng điều khiển thấp (Arduino Nano/ESP32)** — xuất PWM điều khiển driver động cơ, đọc xung encoder trái/phải theo thời gian thực
- **Tầng tính toán (Raspberry Pi 4, ROS2)** — `diff_serial_bridge` cầu nối Serial ↔ ROS2, `robot_kinematic` tính odometry từ encoder, `robot_mapping` chạy SLAM (Cartographer hoặc SLAM Toolbox), `robot_navigation` chạy Nav2 (AMCL, costmap, planner, controller)
- **Tầng ứng dụng & giám sát (RViz2)** — quan sát trực quan robot 3D, quỹ đạo, bản đồ, TF tree, trạng thái Nav2, thường chạy trên máy tính laptop riêng kết nối cùng mạng ROS2 (DDS) với Raspberry Pi 4

Ngoài phần cứng thật, mã nguồn còn có sẵn package `robot_simulation` (URDF/xacro mô tả robot, world Gazebo) — cho phép phát triển và thử nghiệm thuật toán trên mô phỏng trước khi triển khai lên phần cứng thật, giảm rủi ro hỏng hóc khi thử nghiệm trực tiếp.

## Tính toán cơ bản cho thiết kế robot

Khác với dự án Mecanum (phải giả định thông số động cơ), dự án này có sẵn thông số thật từ README: động cơ **GA25 – 120RPM, mô-men khoá trục (stall torque) 7,3 kg·cm, dòng điện ~1,8A khi có tải**.

### Tốc độ tối đa lý thuyết

Giả định bánh xe đường kính 65mm (kích thước phổ biến cho robot dùng động cơ GA25, không có trong README nên lấy giá trị tham khảo thông dụng):

```text
ω = 2π × 120 / 60 ≈ 12,57 rad/s
v_max = ω × r = 12,57 × 0,0325 ≈ 0,41 m/s  (≈ 1,47 km/h)
```

Nhanh hơn đáng kể so với robot Mecanum (motor 60RPM, ~0,19 m/s) — hợp lý vì động cơ ở đây có tốc độ định mức gấp đôi.

### Kiểm tra mô-men

Với khối lượng robot giả định m ≈ 3kg, hệ số ma sát μ ≈ 0,6, chỉ 2 bánh chủ động (khác Mecanum có 4 bánh dẫn động):

```text
T_yêu_cầu = (m × g × μ × r) / n_bánh_dẫn_động
          = (3 × 9,8 × 0,6 × 0,0325) / 2
          ≈ 0,287 N·m ≈ 2,93 kgf·cm / bánh
```

Mô-men khoá trục 7,3 kgf·cm cao hơn khá nhiều so với mức yêu cầu 2,93 kgf·cm — cho biên độ dự phòng tốt. Tuy vậy cần lưu ý: **mô-men khoá trục (stall torque) là giá trị tại tốc độ 0** (khi động cơ bị chặn cứng, không quay) — không phải mô-men liên tục khi đang chạy ở tốc độ định mức, vốn thấp hơn đáng kể theo đường cong torque–speed của động cơ DC. So sánh trực tiếp hai con số này chỉ mang tính tham khảo sơ bộ, không thay thế được việc đo đạc mô-men thực tế ở tốc độ vận hành.

## Tính toán năng lượng tiêu thụ & chọn pin

README ghi nguồn "**Pin 12V 10C**" — đây là cách ghi thông số phổ biến với pin Lithium dạng RC (LiPo/Li-ion), trong đó **10C là hệ số xả (discharge rate)**, không phải dung lượng: pin dung lượng Q (Ah) gắn mác 10C có thể xả liên tục dòng tối đa **10 × Q ampe**. Dung lượng cụ thể (mAh) không được nêu trong README — phần tính toán dưới đây dùng giá trị tham khảo phổ biến cho lớp robot này (pin 3S ~11,1V, 2200mAh) để minh hoạ phương pháp.

### Ước lượng dòng tiêu thụ

| Thành phần | Dòng tiêu thụ |
|---|---|
| Raspberry Pi 4 (ROS2 + SLAM/Nav2) | ~1,5 – 2,5 A @ 5V |
| Arduino/ESP32 | ~0,1 – 0,2 A @ 5V |
| LiDAR (X3 Pro/RPLIDAR) | ~0,3 – 0,4 A @ 5V |
| 2× Motor GA25 (theo thông số "1,8A khi có tải" trong README) | 1,8 A/motor @ 12V |

```text
P_xử_lý  ≈ (2,5 + 0,2 + 0,4) × 5V  ≈ 15,5 W
P_động_cơ (tải định mức)  ≈ 2 × 1,8 × 12V  ≈ 43,2 W
P_tổng (tải định mức, xấu nhất)  ≈ 59 W
```

Vì "1,8A khi có tải" nhiều khả năng là dòng gần mức tải nặng/định mức chứ không phải dòng trung bình lúc di chuyển đều (cruising), ước lượng thực tế khi vận hành bình thường thường thấp hơn — ví dụ minh hoạ với dòng trung bình ước lượng ~0,8A/motor:

```text
P_động_cơ (trung bình)  ≈ 2 × 0,8 × 12V  ≈ 19,2 W
P_tổng (trung bình)  ≈ 35 W
```

### Kiểm tra khả năng đáp ứng của pin 10C

Pin 3S 2200mAh, hệ số 10C → dòng xả tối đa liên tục = 10 × 2,2A = **22A**. Dòng tải tính toán ở trên (~59W ở kịch bản xấu nhất / 11,1V ≈ 5,3A) thấp hơn nhiều so với 22A cho phép — biên độ dư dả, pin không phải yếu tố giới hạn về dòng xả.

### Thời gian hoạt động ước lượng

```text
Năng lượng pin = 11,1V × 2,2Ah ≈ 24,4 Wh
T (tải định mức) ≈ (24,4 × 0,8 × 0,85) / 59  ≈ 0,28 giờ  (~17 phút)
T (tải trung bình) ≈ (24,4 × 0,8 × 0,85) / 35  ≈ 0,47 giờ  (~28 phút)
```

(hệ số 0,8 = chỉ dùng 80% dung lượng để bảo vệ tuổi thọ pin Lithium, 0,85 = hiệu suất chuyển đổi qua các module nguồn)

> **Tóm lại:** Với giả định dung lượng pin phổ biến trong lớp robot này, thời gian hoạt động liên tục rơi vào khoảng **17–28 phút tuỳ cường độ vận hành** — đủ cho các phiên thử nghiệm ngắn, nhưng là hướng cần cải thiện rõ ràng nếu phát triển tiếp (xem mục Hướng phát triển).

## Thử nghiệm và đánh giá

Quá trình mapping và navigation thực tế được ghi lại trong 2 video demo ở đầu trang (mục Video demo).

### Quan sát chính

- Nhờ có sẵn cả Cartographer lẫn SLAM Toolbox, dự án cho phép thử nghiệm so sánh trực tiếp hai hệ SLAM trên cùng một phần cứng — hữu ích để đánh giá chất lượng bản đồ và mức độ dễ tinh chỉnh giữa hai lựa chọn
- Vì chỉ có 2 bánh chủ động tiếp xúc liên tục mặt sàn (không qua con lăn như Mecanum), odometry thuần từ encoder ổn định hơn — SLAM/AMCL hội tụ nhanh hơn trong điều kiện sàn phẳng
- Robot vi sai không strafe được — trong không gian hẹp cần xoay đầu nhiều hơn để né vật cản so với nền tảng omnidirectional, thể hiện rõ qua quỹ đạo trong video navigation

### Hạn chế quan sát được

- Thời gian hoạt động pin ước lượng ngắn (~17–28 phút) giới hạn độ dài mỗi phiên thử nghiệm
- Chưa có IMU hỗ trợ — odometry vẫn phụ thuộc hoàn toàn vào encoder, dễ sai lệch khi bánh trượt nhẹ trên bề mặt trơn
- Việc so sánh Cartographer/SLAM Toolbox trong repo hiện dừng ở mức "có thể chạy song song để thử", chưa có số liệu benchmark định lượng giữa hai lựa chọn

## Tổng kết và hướng phát triển

### Tổng kết

Dự án xây dựng một **mô hình nghiên cứu** robot vi sai hoàn chỉnh với kiến trúc 3 tầng rõ ràng (điều khiển thời gian thực trên Arduino/ESP32 — tính toán ROS2 trên Raspberry Pi 4 — giám sát trên RViz2), đồng thời cung cấp tính linh hoạt hiếm gặp ở một dự án cỡ nhỏ: **2 lựa chọn LiDAR** (YDLIDAR X3 Pro / RPLIDAR A1-A2), **2 lựa chọn SLAM** (Cartographer / SLAM Toolbox), cả **phần cứng thật lẫn mô phỏng Gazebo** (package `robot_simulation`), và bước đầu tích hợp **điều khiển bằng giọng nói** (package `robot_voice_control`) — cho thấy đây là nền tảng thử nghiệm được thiết kế để dễ mở rộng, không chỉ chạy được một kịch bản cố định.

### Hướng phát triển

- **Bổ sung IMU** — kết hợp (sensor fusion) với encoder qua EKF (`robot_localization`) để tăng độ chính xác odometry, giảm phụ thuộc hoàn toàn vào bánh xe
- **Benchmark định lượng Cartographer vs SLAM Toolbox** — đo sai số bản đồ, thời gian hội tụ loop closure, mức tiêu thụ CPU trên cùng một tập dữ liệu, thay vì chỉ so sánh định tính
- **Cải thiện thời lượng pin** — đánh giá lại dung lượng pin thực tế đang dùng, cân nhắc nâng dung lượng nếu hướng tới phiên thử nghiệm dài hơn
- **Hoàn thiện điều khiển giọng nói** — package `robot_voice_control` đã có khung sườn (voice_sender, voice_server, cmd_client), có thể mở rộng thành kênh điều khiển thay thế song song với teleop/Nav2 goal
- **Khép kín vòng điều khiển tốc độ (PID)** trên Arduino/ESP32 dựa trên encoder, thay vì chỉ đặt PWM open-loop, để tốc độ bánh ổn định hơn khi tải thay đổi
