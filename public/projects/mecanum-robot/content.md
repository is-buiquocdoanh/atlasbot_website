> **Lưu ý:** Đây là sản phẩm mô hình phục vụ mục đích nghiên cứu, dùng để kiểm chứng kiến trúc phần cứng/phần mềm của một robot di động tự hành cỡ nhỏ — không phải sản phẩm thương mại hoàn thiện.

## Nguyên lý hoạt động của bánh xe Mecanum

Bánh xe Mecanum khác bánh xe thường ở một chi tiết duy nhất nhưng quan trọng: quanh vành bánh gắn nhiều **con lăn (roller) tự do**, đặt nghiêng **45°** so với trục quay của bánh. Các con lăn này không được động cơ dẫn động — chúng chỉ lăn tự do quanh trục riêng của mình.

![Nguyên lý bánh xe Mecanum](/projects/mecanum-robot/mecanum-wheel-principle.svg)

Khi động cơ quay bánh, lực tại điểm tiếp xúc với mặt sàn bị "lọc" bởi con lăn: thành phần lực dọc theo trục con lăn không truyền xuống sàn (vì con lăn quay tự do theo hướng đó), chỉ thành phần **vuông góc với trục con lăn** mới sinh ra lực đẩy thực tế. Vì trục con lăn nghiêng 45°, lực đẩy thực tế tác dụng xuống sàn cũng nghiêng 45° so với hướng quay của bánh — chứ không đi thẳng theo hướng bánh quay như bánh xe thường.

### Vì sao 4 bánh phối hợp lại di chuyển được mọi hướng

Bốn bánh trên robot được lắp theo hai kiểu con lăn đối xứng nhau (tạo thành hình chữ "X" khi nhìn từ trên xuống): bánh trước-trái/sau-phải lắp một chiều, bánh trước-phải/sau-trái lắp chiều ngược lại. Khi thay đổi tốc độ và chiều quay độc lập của từng bánh, các lực đẩy 45° riêng lẻ của 4 bánh cộng vector lại với nhau, cho phép robot:

- **Tiến/lùi thẳng** — cả 4 bánh quay cùng chiều, cùng tốc độ
- **Sang ngang (strafe)** — hai cặp bánh chéo nhau quay ngược chiều nhau
- **Xoay tại chỗ** — bánh bên trái và bên phải quay ngược chiều nhau
- **Di chuyển chéo bất kỳ hướng nào** — kết hợp tỷ lệ khác nhau giữa các bánh

> **Tóm lại:** Bánh Mecanum không "tự nó" di chuyển đa hướng — khả năng đó đến từ việc cộng vector lực 45° của 4 bánh độc lập, đây cũng là lý do bắt buộc phải điều khiển đồng thời và chính xác cả 4 động cơ, không thể chỉ điều khiển 2 bánh như xe vi sai (differential drive).

## Xây dựng mô hình động học của robot 4 bánh Mecanum

Có mô hình động học chính xác là điều kiện bắt buộc để chuyển đổi giữa "robot cần di chuyển theo hướng nào" (lệnh điều khiển) và "mỗi bánh cần quay bao nhiêu" (lệnh động cơ thực tế) — hai chiều chuyển đổi này gọi là **động học nghịch (inverse kinematics)** và **động học thuận (forward kinematics)**.

![Mô hình động học robot 4 bánh Mecanum](/projects/mecanum-robot/kinematics-model.svg)

### Định nghĩa hệ toạ độ

Vận tốc mong muốn của robot được biểu diễn trong hệ toạ độ gắn liền với thân robot (base_link), gồm 3 thành phần độc lập — đây chính là bậc tự do đặc trưng của hệ omnidirectional:

- **vx** — vận tốc tiến/lùi (dọc thân robot)
- **vy** — vận tốc sang trái/phải (ngang thân robot — chỉ Mecanum/omni mới có)
- **ω** — vận tốc góc quay quanh trục thẳng đứng

cùng hai thông số hình học cố định: **l_x** (nửa khoảng cách giữa trục bánh trước và trục bánh sau) và **l_y** (nửa khoảng cách vệt bánh trái–phải), và **r** là bán kính bánh xe.

### Động học nghịch — từ lệnh điều khiển ra tốc độ từng bánh

```text
v1 = vx − vy − (lx+ly)ω     (bánh trước-trái)
v2 = vx + vy + (lx+ly)ω     (bánh trước-phải)
v3 = vx + vy − (lx+ly)ω     (bánh sau-trái)
v4 = vx − vy + (lx+ly)ω     (bánh sau-phải)
```

Tốc độ góc thực tế cần đặt cho mỗi động cơ: **ωᵢ = vᵢ / r**. Đây chính là phép tính node `kinematic.launch.py` trong package `motor_control` của dự án thực hiện mỗi khi nhận lệnh `Twist` (từ bàn phím, joystick, hoặc từ Nav2) và quy đổi ra tốc độ 4 bánh gửi xuống ESP32.

### Động học thuận — từ tốc độ từng bánh suy ra vận tốc robot (dùng cho odometry)

```text
vx = (v1 + v2 + v3 + v4) / 4
vy = (−v1 + v2 + v3 − v4) / 4
ω  = (−v1 + v2 − v3 + v4) / (4·(lx+ly))
```

Phép tính ngược này dùng dữ liệu đọc được từ **encoder** trên 4 động cơ để ước lượng lại robot thực sự đang di chuyển với vận tốc nào — kết quả được tích phân theo thời gian để ra **odometry** (vị trí ước lượng), một trong các nguồn dữ liệu định vị đưa vào SLAM.

> **Giới hạn cần lưu ý:** Mô hình động học ở trên là mô hình lý tưởng, giả định bánh không trượt (no-slip). Thực tế bánh Mecanum có nhiều con lăn nhỏ tiếp xúc sàn không liên tục, dễ trượt hơn bánh thường — sai số cộng dồn (drift) của odometry tính thuần từ encoder vì vậy thường lớn hơn xe vi sai, cần cảm biến bổ sung (IMU, LiDAR) để bù lại.

## Cảm biến LiDAR và nguyên lý hoạt động

Robot dùng **YDLIDAR X3 Pro** — cảm biến LiDAR 2D giá rẻ, đo khoảng cách bằng phương pháp **tam giác đạc quang học (optical triangulation)**, khác với các LiDAR cao cấp dùng phương pháp đo thời gian bay (Time-of-Flight).

![Nguyên lý tam giác đạc của LiDAR triangulation](/projects/mecanum-robot/lidar-principle.svg)

### Nguyên lý tam giác đạc

Một diode laser phát ra tia sáng chiếu vào vật thể; ánh sáng phản xạ trở về được hội tụ qua thấu kính lên một cảm biến ảnh tuyến tính (PSD/CMOS) đặt cách diode laser một khoảng cố định gọi là **baseline (b)**. Vị trí điểm sáng rơi trên cảm biến ảnh phụ thuộc vào góc phản xạ, mà góc này lại phụ thuộc vào khoảng cách tới vật thể — từ hình học tam giác tạo bởi (diode – vật thể – cảm biến ảnh), khoảng cách D được suy ra theo công thức xấp xỉ:

```text
D = f · b / x
```

trong đó **f** là tiêu cự thấu kính, **b** là baseline, **x** là vị trí điểm sáng đo được trên cảm biến ảnh.

### Quét 360° tạo dữ liệu bản đồ môi trường

Toàn bộ cụm phát–thu được gắn trên một mô-tơ xoay liên tục 360°. Mỗi vòng quay tạo ra hàng trăm/nghìn cặp giá trị **(góc, khoảng cách)**, đóng gói thành một bản tin `sensor_msgs/LaserScan` trên topic `/scan` (thực hiện bởi package `ydlidar_ros2_driver` trong dự án) — đây là nguồn dữ liệu đầu vào chính cho cả **SLAM** (dựng bản đồ) lẫn **Nav2** (phát hiện vật cản thời gian thực).

> **Tóm lại:** YDLIDAR X3 Pro đo khoảng cách bằng hình học tam giác quang học chứ không đo thời gian bay — giá thành rẻ hơn nhiều so với LiDAR ToF, đánh đổi bằng tầm đo ngắn hơn (phù hợp không gian trong nhà, cỡ vài mét) và độ chính xác giảm dần ở khoảng cách xa.

## Lý thuyết nền tảng của SLAM

**SLAM (Simultaneous Localization and Mapping)** giải quyết đồng thời hai bài toán vốn phụ thuộc lẫn nhau: muốn biết robot đang ở đâu chính xác thì cần một bản đồ đáng tin cậy, nhưng muốn dựng bản đồ đáng tin cậy thì lại cần biết chính xác robot đang ở đâu khi ghi nhận từng phép đo — đây là bài toán "con gà quả trứng" kinh điển của robot di động tự hành.

Về mặt xác suất, SLAM được biểu diễn dưới dạng ước lượng đồng thời **quỹ đạo robot** và **bản đồ**, dựa trên chuỗi phép đo cảm biến và lệnh điều khiển đã thực hiện — càng nhiều dữ liệu quan sát khớp với nhau, độ tin cậy của cả quỹ đạo lẫn bản đồ càng tăng.

### Hai trường phái SLAM phổ biến

- **SLAM dựa trên bộ lọc (filter-based)** — ví dụ EKF-SLAM, FastSLAM (particle filter): cập nhật ước lượng tuần tự theo từng phép đo mới, gọn nhẹ nhưng khó xử lý tốt khi bản đồ lớn hoặc có nhiều vòng lặp (loop).
- **SLAM dựa trên đồ thị (graph-based / pose-graph optimization)** — biểu diễn các vị trí robot đã đi qua như các "đỉnh" trong đồ thị, các ràng buộc giữa chúng (từ scan matching, loop closure) là "cạnh", rồi tối ưu toàn bộ đồ thị để giảm sai số tích luỹ. **Cartographer** (dùng trong dự án này) thuộc trường phái này.

### Front-end và back-end

Mọi hệ SLAM hiện đại đều tách thành hai tầng xử lý:

- **Front-end** — xử lý dữ liệu cảm biến thô (scan matching: khớp lần quét LiDAR hiện tại với bản đồ cục bộ đã có để ước lượng vị trí tức thời)
- **Back-end** — định kỳ tối ưu lại toàn bộ quỹ đạo dựa trên các ràng buộc đã thu thập, đặc biệt là **loop closure**: khi robot quay lại một vị trí đã từng đi qua, hệ thống nhận ra điểm cũ và dùng nó để "kéo" toàn bộ quỹ đạo về đúng vị trí thực, triệt tiêu sai số trôi (drift) đã tích luỹ trong suốt quãng đường giữa hai lần đi qua.

> **Tóm lại:** Nếu không có loop closure, SLAM chỉ đơn thuần là "tích phân sai số" — bản đồ sẽ méo dần theo thời gian. Khả năng phát hiện lại vị trí cũ mới là thứ giúp SLAM khác hẳn việc chỉ vẽ bản đồ từ odometry thuần.

## Cartographer SLAM (Xây dựng bản đồ)

**Cartographer** là hệ SLAM 2D/3D mã nguồn mở do Google phát triển, được dùng trong package `robot_mapping` của dự án (khởi chạy qua `cartographer.launch.py`). Cartographer thuộc nhóm graph-based, chia xử lý thành hai tầng: **Local SLAM** và **Global SLAM**.

### Local SLAM — xây dựng submap

Thay vì khớp trực tiếp mỗi lần quét với toàn bộ bản đồ (rất tốn kém khi bản đồ lớn dần), Cartographer gộp một chuỗi các lần quét liên tiếp thành một **submap** nhỏ. Mỗi lần quét mới được khớp (scan matching) với submap hiện tại bằng phương pháp tối ưu phi tuyến (dựa trên thư viện Ceres Solver), có hỗ trợ dữ liệu odometry/IMU làm giá trị khởi tạo giúp việc khớp hội tụ nhanh và ổn định hơn. Khi đã tích luỹ đủ số lần quét, submap được "chốt" lại và một submap mới bắt đầu.

### Global SLAM — tối ưu pose graph và loop closure

Song song đó, Cartographer liên tục kiểm tra xem vị trí hiện tại có trùng khớp với bất kỳ submap cũ nào đã tạo trước đó không, bằng thuật toán tìm kiếm hiệu quả **branch-and-bound scan matching**. Khi phát hiện một cặp khớp đủ tin cậy (loop closure), một ràng buộc mới được thêm vào **pose graph**, và toàn bộ đồ thị vị trí của tất cả các submap được tối ưu lại định kỳ — điều chỉnh nhẹ vị trí tương đối giữa các submap để bản đồ tổng thể nhất quán, không còn bị "gãy khúc" ở nơi robot quay vòng lại.

```text
LiDAR scan mới
     │
     ▼
Scan matching với submap hiện tại (Local SLAM, Ceres)
     │
     ▼
Chèn scan vào submap  ──►  Đủ scan? → chốt submap, mở submap mới
     │
     ▼
Kiểm tra loop closure với các submap cũ (branch-and-bound)
     │
     ▼
Tối ưu pose graph toàn cục (định kỳ) → bản đồ nhất quán
```

Kết quả đầu ra của Cartographer là một bản đồ dạng **Occupancy Grid** — nội dung được trình bày ở mục tiếp theo.

## Thuật toán Occupancy Grid (Biểu diễn bản đồ)

Occupancy Grid biểu diễn môi trường như một lưới ô vuông rời rạc, mỗi ô mang một giá trị xác suất **p ∈ [0, 1]** thể hiện khả năng ô đó đang bị vật cản chiếm giữ.

![Occupancy Grid — biểu diễn bản đồ dạng lưới xác suất](/projects/mecanum-robot/occupancy-grid.svg)

### Ray casting — cập nhật lưới từ một lần quét LiDAR

Với mỗi tia laser trong một lần quét, các ô nằm **dọc đường đi** của tia (từ robot tới điểm chạm vật cản) được xem là **trống (free)** — giảm xác suất occupied; riêng ô tại **điểm chạm cuối cùng** của tia được xem là **có vật cản (occupied)** — tăng xác suất occupied. Những ô chưa từng có tia laser nào quét qua giữ nguyên trạng thái **chưa biết (unknown, p = 0.5)**.

### Biểu diễn log-odds — cập nhật Bayes hiệu quả

Thay vì lưu trực tiếp xác suất p (phải nhân xác suất liên tục, dễ mất độ chính xác số học), Occupancy Grid thường lưu ở dạng **log-odds**:

```text
l = log( p / (1 − p) )
```

Ưu điểm của log-odds là mỗi lần cập nhật Bayes chỉ cần **phép cộng** thay vì phép nhân xác suất:

```text
l_new = l_old + l_measurement − l_prior
```

Muốn lấy lại xác suất p để hiển thị/xử lý, chỉ cần biến đổi ngược: `p = 1 − 1/(1 + eˡ)`. Cách biểu diễn này giúp việc cập nhật hàng nghìn ô lưới mỗi lần quét trở nên rất nhanh — quan trọng khi phải chạy real-time trên phần cứng giới hạn như Raspberry Pi 4.

## Cơ sở lý thuyết về Navigation2

**Nav2 (Navigation2)** là framework điều hướng chính thức của ROS2, đảm nhiệm việc đưa robot từ vị trí hiện tại tới một điểm đích mong muốn một cách an toàn — sử dụng trong package `robot_navigation` của dự án (`navigation.launch.py`).

### Kiến trúc costmap hai lớp

Nav2 biểu diễn không gian robot cần né tránh bằng **costmap** — một lớp mở rộng của Occupancy Grid, gồm hai tầng hoạt động song song:

- **Global costmap** — dựng trên toàn bộ bản đồ tĩnh do SLAM tạo ra (kết hợp thêm **inflation layer**: "phồng" vùng quanh vật cản theo bán kính an toàn của robot), dùng để lập kế hoạch đường đi tổng thể.
- **Local costmap** — một cửa sổ nhỏ di chuyển theo robot, cập nhật liên tục từ dữ liệu cảm biến trực tiếp (LiDAR), dùng để phát hiện và né tránh vật cản phát sinh tức thời mà bản đồ tĩnh không có.

### Planner, Controller, và Behavior Tree

Nav2 tách bài toán điều hướng thành hai tầng tính toán riêng biệt:

- **Global Planner** — tính đường đi tối ưu (ví dụ giải thuật NavFn hoặc Smac Planner) trên global costmap, bỏ qua chi tiết động lực học tức thời.
- **Local Controller** — bám theo đường đi đó trong thời gian thực, liên tục điều chỉnh vận tốc để vừa bám quỹ đạo vừa né vật cản xuất hiện đột ngột trên local costmap.

Toàn bộ quy trình (tính đường đi → bám đường đi → xử lý khi thất bại) được điều phối bởi một **Behavior Tree (BT)** — cho phép định nghĩa logic dạng cây quyết định (thử lại, chuyển sang hành vi khôi phục như xoay tại chỗ hoặc lùi lại khi bị kẹt) một cách trực quan, dễ mở rộng hơn nhiều so với viết state machine thủ công.

```text
BT: ComputePathToPose → FollowPath
         │                  │
         ▼                  ▼
   (thất bại?)        (gặp vật cản mới?)
         │                  │
         ▼                  ▼
   Recovery Behavior (xoay, lùi, chờ) → thử lại
```

## Sơ đồ khối hệ thống

![Sơ đồ khối hệ thống robot Mecanum](/projects/mecanum-robot/system-block-diagram.svg)

Hệ thống được chia thành 4 khối chức năng độc lập:

- **Khối nguồn** — Pin Lithium 3S2P (11,1V–12,6V) qua công tắc tổng (Switch), phân phối theo hai đường: điện áp thô (~12V) cấp thẳng cho 2 driver động cơ (nơi cần dòng lớn), và qua 2 module hạ áp Buck DC-DC (XL4005 5V-5A cho Raspberry Pi 4, LM2596 5V-3A cho ESP32) để cấp nguồn ổn định 5V cho khối xử lý.
- **Khối xử lý trung tâm** — Raspberry Pi 4 (chạy ROS2: SLAM, Nav2, xử lý cấp cao) giao tiếp hai chiều với ESP32 (vòng điều khiển động cơ thời gian thực, đọc encoder) qua UART — đúng kiến trúc phân tầng phổ biến cho robot ROS2: MCU lo phần thời gian thực, máy tính nhúng lo phần tính toán nặng.
- **Khối truyền động (x2, trái/phải)** — mỗi bên gồm 1 driver L298N điều khiển 2 động cơ GA25 (tổng cộng 4 động cơ, bố trí Mecanum), nhận tín hiệu PWM/DIR điều khiển trực tiếp từ ESP32.
- **Khối cảm biến** — YDLIDAR X3 Pro kết nối Raspberry Pi 4 qua USB (dữ liệu quét LiDAR dùng cho SLAM/Nav2), Encoder gắn trên trục động cơ kết nối ESP32 qua GPIO (dữ liệu tốc độ quay dùng cho vòng điều khiển tốc độ và tính odometry).

Đường nguồn điện (đỏ) và đường tín hiệu điều khiển/dữ liệu (đen) được tách riêng trong sơ đồ để thấy rõ: driver động cơ nhận **nguồn thô trực tiếp từ pin** (không qua bộ hạ áp, vì cần dòng lớn hơn nhiều so với dòng khối xử lý tiêu thụ) nhưng **tín hiệu điều khiển vẫn đến từ ESP32**.

## Tính toán cơ bản cho thiết kế robot

Dưới đây là ví dụ tính toán minh hoạ phương pháp chọn động cơ và ước lượng tốc độ tối đa — sử dụng thông số động cơ **GA25 giảm tốc 60 RPM** đã chọn cho dự án và một số giả định hình học tiêu biểu cho lớp robot cỡ nhỏ này (khối lượng, bán kính bánh xe).

### Tốc độ di chuyển tối đa lý thuyết

Với động cơ có tốc độ đầu ra sau hộp số N = 60 vòng/phút và bánh xe Mecanum đường kính giả định 60mm (bán kính r = 0,03m):

```text
ω = 2π × N / 60 = 2π × 60 / 60 ≈ 6,28 rad/s
v_max = ω × r ≈ 6,28 × 0,03 ≈ 0,19 m/s  (≈ 0,68 km/h)
```

Đây là tốc độ lý thuyết khi không tải và không trượt — trong thực tế, ma sát, tải trọng và điện áp pin sụt dần theo thời gian sử dụng sẽ làm tốc độ thực tế thấp hơn con số này.

### Ước lượng mô-men cần thiết

Mô-men tối thiểu mỗi động cơ cần tạo ra để robot di chuyển ổn định trên mặt phẳng, với khối lượng robot giả định m ≈ 3,5kg (bao gồm khung, pin, mạch điều khiển) và hệ số ma sát lăn μ ≈ 0,6 (bánh cao su trên nền gạch/sàn nhựa):

```text
T_yêu_cầu = (m × g × μ × r) / n_bánh_dẫn_động
          = (3,5 × 9,8 × 0,6 × 0,03) / 4
          ≈ 0,154 N·m ≈ 1,57 kgf·cm / bánh
```

Động cơ GA25-370 loại 60RPM ở điện áp 12V thường có mô-men định mức tham khảo trên dưới **2–3 kgf·cm** tuỳ nhà sản xuất — cao hơn giá trị yêu cầu tính toán ở trên, cho biên độ dự phòng cần thiết khi robot leo qua ổ gà nhỏ, thảm, hoặc tăng tốc đột ngột.

> **Lưu ý phương pháp luận:** Đây là ví dụ tính toán tham khảo với các thông số giả định hợp lý cho lớp robot này, không phải số liệu đo đạc thực tế trên bản thiết kế cụ thể — mục đích minh hoạ cách tiếp cận bài toán chọn động cơ dựa trên tải trọng, không phải công bố thông số kỹ thuật chính xác tuyệt đối.

## Tính toán năng lượng tiêu thụ & chọn pin

### Ước lượng dòng tiêu thụ trung bình

| Thành phần | Dòng tiêu thụ ước lượng |
|---|---|
| Raspberry Pi 4 (chạy ROS2 + SLAM) | ~1,2 – 2,5 A @ 5V |
| ESP32 | ~0,15 – 0,25 A @ 5V |
| YDLIDAR X3 Pro | ~0,3 – 0,4 A @ 5V |
| 4× Motor GA25 (chạy tải nhẹ, trung bình) | ~0,3 – 0,5 A/motor @ 12V |

Quy đổi toàn bộ về công suất tiêu thụ trung bình (bỏ qua hiệu suất chuyển đổi của module Buck để đơn giản hoá ước lượng ban đầu):

```text
P_xử_lý ≈ (2,5 + 0,25 + 0,4) × 5V ≈ 15,75 W
P_động_cơ ≈ 4 × 0,4 × 12V ≈ 19,2 W
P_tổng ≈ 35 W (trung bình, chưa tính đỉnh khi tăng tốc)
```

### Chọn dung lượng pin — cấu hình 3S2P

Pin dùng trong dự án là **Lithium 3S2P** — 3 cell nối tiếp (3S, cho điện áp danh định 11,1V, đầy 12,6V — khớp với thông số ghi trong khối nguồn) và 2 nhóm nối song song (2P, nhân đôi dung lượng). Với cell 18650 dung lượng tham khảo 2600mAh:

```text
Dung lượng pin = 2 × 2600mAh = 5200mAh
Năng lượng     = 11,1V × 5,2Ah ≈ 57,7 Wh
```

Thời gian hoạt động ước lượng (tính thêm hệ số an toàn: chỉ dùng ~80% dung lượng để bảo vệ tuổi thọ pin Lithium, và hiệu suất chuyển đổi Buck ~85%):

```text
T_hoạt_động ≈ (57,7 Wh × 0,8 × 0,85) / 35 W ≈ 1,12 giờ
```

> **Tóm lại:** Với công suất tiêu thụ trung bình ước lượng ~35W, pin 3S2P 5200mAh cho thời gian hoạt động liên tục khoảng **hơn 1 giờ** — đủ cho các bài thử nghiệm mapping/navigation trong phòng thí nghiệm, nhưng là một hướng cần cải thiện nếu phát triển thành sản phẩm vận hành cả ca làm việc (xem mục Hướng phát triển).

## Thử nghiệm và đánh giá

Robot được kiểm thử qua hai kịch bản chính, tương ứng với hai video minh hoạ ở phần đầu trang:

### Thử nghiệm 1 — Mapping (SLAM)

Cho robot di chuyển thủ công (teleop) quét toàn bộ khu vực thử nghiệm bằng Cartographer. Bản đồ dạng Occupancy Grid được dựng theo thời gian thực trong RViz2. Quan sát chính:
- Cartographer bám khá tốt hình dạng tường/vật cản tĩnh trong không gian thử nghiệm kích thước nhỏ–vừa
- Khi robot đi qua lại cùng một khu vực (loop closure), bản đồ được điều chỉnh mượt, không bị "gãy khúc" rõ rệt
- Ở các đoạn sàn trơn hoặc khi thao tác di chuyển quá nhanh, dữ liệu odometry đôi lúc trôi (drift) tạm thời trước khi được scan matching hiệu chỉnh lại

### Thử nghiệm 2 — Navigation (Nav2)

Sau khi có bản đồ, đặt goal pose trực tiếp trong RViz2 để kiểm tra khả năng tự động điều hướng. Quan sát chính:
- Robot lập kế hoạch đường đi hợp lý trên global costmap và bám theo được trong hầu hết trường hợp
- Khi xuất hiện vật cản không có trong bản đồ tĩnh (người đi ngang, vật thể mới đặt vào), local costmap cập nhật kịp thời và robot điều chỉnh quỹ đạo né tránh
- Khả năng di chuyển ngang (strafe) của bánh Mecanum giúp robot xử lý tốt các tình huống né vật cản trong không gian hẹp mà không cần xoay đầu như xe vi sai

### Hạn chế quan sát được

- **Trượt bánh Mecanum** làm giảm độ chính xác odometry thuần từ encoder so với xe vi sai — SLAM phải "gánh" phần bù sai số này nhiều hơn
- **LiDAR 2D** chỉ quét ở một mặt phẳng cố định — không phát hiện được vật cản thấp hơn/cao hơn mặt phẳng quét (ví dụ mép bàn, vật để trên sàn thấp)
- **Thời gian hoạt động pin** giới hạn (~hơn 1 giờ theo tính toán ở mục trên) chỉ phù hợp cho các bài thử nghiệm ngắn

## Tổng kết và hướng phát triển

### Tổng kết

Dự án đã xây dựng thành công một **mô hình nghiên cứu** robot di động 4 bánh Mecanum hoàn chỉnh theo kiến trúc phân tầng phổ biến trong robot ROS2 thực tế: ESP32 đảm nhiệm vòng điều khiển động cơ thời gian thực ở tầng thấp, Raspberry Pi 4 chạy ROS2 xử lý SLAM (Cartographer) và điều hướng (Nav2) ở tầng cao, kết nối qua UART. Kết quả thử nghiệm cho thấy robot có khả năng tự dựng bản đồ môi trường, định vị, lập kế hoạch đường đi và né vật cản — chứng minh tính khả thi của kiến trúc phần cứng/phần mềm đã lựa chọn với chi phí linh kiện ở mức phổ thông (ESP32, Raspberry Pi 4, YDLIDAR X3 Pro, động cơ GA25).

### Hướng phát triển

- **Bù trượt bánh Mecanum** — tích hợp thêm IMU và bộ lọc Kalman mở rộng (EKF, gói `robot_localization`) để kết hợp (sensor fusion) odometry bánh xe với dữ liệu quán tính, giảm sai số tích luỹ trước khi đưa vào SLAM
- **Vòng điều khiển tốc độ động cơ closed-loop (PID)** — hiện tại encoder đã có sẵn, có thể khép kín vòng điều khiển PID trên ESP32 để giữ tốc độ ổn định hơn khi tải thay đổi, tăng độ chính xác odometry đầu vào
- **Bổ sung cảm biến chiều cao khác** — thêm camera độ sâu (RGB-D) hoặc LiDAR 3D để phát hiện vật cản ngoài mặt phẳng quét của LiDAR 2D hiện tại
- **Tối ưu năng lượng** — đánh giá lại hiệu suất các module hạ áp, cân nhắc dung lượng pin lớn hơn hoặc thêm hệ thống quản lý pin (BMS) nếu hướng tới thời gian vận hành dài hơn
- **Nâng cấp phần tính toán** — chuyển sang nền tảng mạnh hơn (ví dụ NVIDIA Jetson) nếu muốn bổ sung nhận diện vật thể/thị giác máy tính chạy song song với SLAM và Nav2
- **Kiểm thử định lượng** — bổ sung số liệu benchmark định lượng (sai số bản đồ, sai số bám quỹ đạo, thời gian đạt goal) thay vì chỉ đánh giá định tính qua quan sát, phục vụ so sánh khách quan giữa các phiên bản cải tiến
