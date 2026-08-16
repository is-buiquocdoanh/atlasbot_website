BLOG
│
├── 01. LẬP TRÌNH NHÚNG (EMBEDDED)
│   │
│   ├── 01.1. Kiến thức nền tảng
│   │   ├── Bit, Byte, Binary, Hexadecimal
│   │   ├── Điện áp, dòng điện, công suất
│   │   ├── Digital / Analog
│   │   ├── GPIO là gì?
│   │   ├── Pull-up / Pull-down
│   │   └── Interrupt là gì?
│   │
│   ├── 01.2. Linh kiện điện tử
│   │   ├── Diode
│   │   ├── Transistor
│   │   ├── MOSFET
│   │   ├── Relay
│   │   ├── Optocoupler
│   │   ├── LDO
│   │   ├── Buck Converter
│   │   └── Boost Converter
│   │
│   ├── 01.3. Vi điều khiển
│   │   ├── MCU là gì?
│   │   ├── Arduino
│   │   ├── ESP32
│   │   ├── STM32
│   │   ├── Raspberry Pi Pico
│   │   └── So sánh MCU
│   │
│   ├── 01.4. Lập trình C/C++
│   │   ├── Biến và kiểu dữ liệu
│   │   ├── Pointer
│   │   ├── Struct
│   │   ├── Array
│   │   ├── Function
│   │   ├── Memory
│   │   └── Bit manipulation
│   │
│   ├── 01.5. Giao tiếp phần cứng
│   │   ├── UART
│   │   ├── I2C
│   │   ├── SPI
│   │   ├── RS232
│   │   ├── RS485
│   │   ├── CAN
│   │   ├── Modbus RTU
│   │   └── Ethernet
│   │
│   └── 01.6. Điều khiển động cơ
│       ├── DC Motor
│       ├── Encoder
│       ├── Servo Motor
│       ├── Stepper Motor
│       ├── PID
│       └── Điều khiển tốc độ
│
│
├── 02. ROS / ROS2
│   │
│   ├── 02.1. ROS2 cơ bản
│   │   ├── ROS2 là gì?
│   │   ├── Workspace
│   │   ├── Package
│   │   ├── Node
│   │   ├── Topic
│   │   ├── Publisher
│   │   ├── Subscriber
│   │   ├── Service
│   │   └── Action
│   │
│   ├── 02.2. ROS2 Communication
│   │   ├── Message
│   │   ├── Service
│   │   ├── Action
│   │   ├── QoS
│   │   ├── DDS
│   │   └── TF / TF2
│   │
│   ├── 02.3. ROS2 Package
│   │   ├── Tạo package C++
│   │   ├── Tạo package Python
│   │   ├── CMakeLists.txt
│   │   ├── package.xml
│   │   ├── Launch File
│   │   └── Parameter
│   │
│   ├── 02.4. ROS2 Tools
│   │   ├── ros2 node
│   │   ├── ros2 topic
│   │   ├── ros2 service
│   │   ├── ros2 action
│   │   ├── ros2 param
│   │   ├── ros2 bag
│   │   └── RViz2
│   │
│   └── 02.5. ROS2 nâng cao
│       ├── Lifecycle Node
│       ├── Composition
│       ├── Callback Group
│       ├── Multi-threading
│       ├── Executor
│       └── DDS Configuration
│
│
├── 03. ROBOTICS FUNDAMENTALS
│   │
│   ├── 03.1. Toán cho Robotics
│   │   ├── Vector
│   │   ├── Matrix
│   │   ├── Coordinate System
│   │   ├── Rotation
│   │   ├── Quaternion
│   │   └── Transform
│   │
│   ├── 03.2. Động học Robot
│   │   ├── Forward Kinematics
│   │   ├── Inverse Kinematics
│   │   ├── Differential Drive
│   │   ├── Mecanum Drive
│   │   └── Odometry
│   │
│   ├── 03.3. Điều khiển Robot
│   │   ├── PID
│   │   ├── Velocity Control
│   │   ├── Acceleration
│   │   ├── Trajectory
│   │   └── Closed-loop Control
│   │
│   └── 03.4. Localization
│       ├── Odometry
│       ├── IMU
│       ├── Sensor Fusion
│       ├── EKF
│       └── AMCL
│
│
├── 04. AMR / AGV
│   │
│   ├── 04.1. Tổng quan AMR / AGV
│   │   ├── AMR là gì?
│   │   ├── AGV là gì?
│   │   ├── AMR vs AGV
│   │   ├── Kiến trúc AMR
│   │   └── Các loại AMR
│   │
│   ├── 04.2. Hardware AMR
│   │   ├── Motor
│   │   ├── Motor Driver
│   │   ├── Encoder
│   │   ├── LiDAR
│   │   ├── Camera
│   │   ├── IMU
│   │   ├── Bumper
│   │   └── Emergency Stop
│   │
│   ├── 04.3. AMR Drive System
│   │   ├── Differential Drive
│   │   ├── Mecanum Drive
│   │   ├── Motor Control
│   │   ├── Encoder
│   │   └── Odometry
│   │
│   ├── 04.4. AMR Software Architecture
│   │   ├── Hardware Layer
│   │   ├── Driver Layer
│   │   ├── ROS2 Layer
│   │   ├── Localization
│   │   ├── Navigation
│   │   └── Application
│   │
│   └── 04.5. Thiết kế AMR thực tế
│       ├── Thiết kế cơ khí
│       ├── Chọn Motor
│       ├── Chọn Encoder
│       ├── Chọn LiDAR
│       ├── Chọn Computer
│       ├── Tính Battery
│       └── Tính tải
│
│
├── 05. ROS2 NAVIGATION / NAV2
│   │
│   ├── 05.1. Navigation cơ bản
│   │   ├── Navigation là gì?
│   │   ├── Map
│   │   ├── Localization
│   │   ├── Path Planning
│   │   └── Path Following
│   │
│   ├── 05.2. SLAM
│   │   ├── SLAM là gì?
│   │   ├── slam_toolbox
│   │   ├── Cartographer
│   │   ├── LiDAR SLAM
│   │   └── Mapping thực tế
│   │
│   ├── 05.3. Localization
│   │   ├── AMCL
│   │   ├── EKF
│   │   ├── RF2O
│   │   ├── Odometry Fusion
│   │   └── TF Tree
│   │
│   ├── 05.4. Nav2
│   │   ├── Planner
│   │   ├── Controller
│   │   ├── Costmap
│   │   ├── Behavior Tree
│   │   ├── Recovery
│   │   └── Waypoint
│   │
│   └── 05.5. Tuning Nav2
│       ├── Velocity
│       ├── Acceleration
│       ├── Rotation
│       ├── Footprint
│       ├── Costmap
│       └── Controller tuning
│
│
├── 06. SENSOR & PERCEPTION
│   │
│   ├── 06.1. LiDAR
│   │   ├── LiDAR là gì?
│   │   ├── 2D LiDAR
│   │   ├── 3D LiDAR
│   │   ├── RPLiDAR
│   │   ├── YDLiDAR
│   │   └── LiDAR Filtering
│   │
│   ├── 06.2. Camera
│   │   ├── USB Camera
│   │   ├── V4L2
│   │   ├── OpenCV
│   │   ├── Image Transport
│   │   └── Camera Calibration
│   │
│   ├── 06.3. IMU
│   │   ├── IMU là gì?
│   │   ├── Accelerometer
│   │   ├── Gyroscope
│   │   ├── MPU6050
│   │   └── IMU Calibration
│   │
│   └── 06.4. Computer Vision / AI
│       ├── OpenCV
│       ├── YOLO
│       ├── Object Detection
│       ├── Tracking
│       └── ROS2 + YOLO
│
│
├── 07. LINUX / UBUNTU / JETSON
│   │
│   ├── Linux cơ bản
│   ├── Ubuntu
│   ├── Terminal
│   ├── SSH
│   ├── USB / Serial
│   ├── udev rules
│   ├── Docker
│   ├── NVIDIA Jetson
│   └── Jetson Orin Nano
│
│
├── 08. PROJECT THỰC TẾ
│   │
│   ├── 08.1. Embedded Project
│   │   ├── ESP32 Robot
│   │   ├── STM32 Motor Control
│   │   └── Sensor Project
│   │
│   ├── 08.2. ROS2 Project
│   │   ├── ROS2 Robot
│   │   ├── LiDAR Robot
│   │   └── Camera Robot
│   │
│   ├── 08.3. AMR Project
│   │   ├── AMR Differential Drive
│   │   ├── AMR 2 LiDAR
│   │   ├── AMR SLAM
│   │   ├── AMR Navigation
│   │   └── AMR Warehouse
│   │
│   └── 08.4. Project từ A → Z
│       ├── Thiết kế
│       ├── Hardware
│       ├── Firmware
│       ├── ROS2
│       ├── SLAM
│       ├── Nav2
│       └── Deployment
│
│
└── 09. TROUBLESHOOTING
    │
    ├── Embedded
    │   ├── UART lỗi
    │   ├── I2C lỗi
    │   ├── SPI lỗi
    │   └── CAN lỗi
    │
    ├── ROS2
    │   ├── Node không chạy
    │   ├── Topic không nhận
    │   ├── QoS mismatch
    │   ├── TF lỗi
    │   └── DDS lỗi
    │
    ├── SLAM
    │   ├── Map bị méo
    │   ├── Robot drift
    │   └── LiDAR lỗi
    │
    └── Nav2
        ├── Robot không chạy
        ├── Robot đi lệch
        ├── Planner lỗi
        ├── Controller lỗi
        └── Costmap lỗi