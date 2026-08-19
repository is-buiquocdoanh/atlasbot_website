---
name: "Động Cơ DC Giảm Tốc JGB37-520 12V có Encoder"
slug: "dong-co-jgb37-520-12v-encoder"
sku: "JGB37-520-12V-AB"
category: "Motor & driver"
price: 185000
compareAtPrice: 220000
stock: 24
badge: "Bán chạy"
images: []
highlights:
  - icon: "voltage"
    label: "Điện áp"
    value: "12V DC"
  - icon: "speed"
    label: "Tốc độ"
    value: "330 RPM"
  - icon: "encoder"
    label: "Encoder"
    value: "11 xung/vòng"
  - icon: "torque"
    label: "Mô-men"
    value: "0.8 kg·cm"
features:
  - icon: "gear"
    title: "Hộp số kim loại"
    description: "Bánh răng kim loại toàn bộ, chịu tải tốt hơn hộp số nhựa cùng kích thước."
  - icon: "encoder"
    title: "Encoder tích hợp sẵn"
    description: "2 kênh quadrature (11 xung/vòng trước hộp số) — đọc được cả tốc độ lẫn chiều quay."
  - icon: "shaft"
    title: "Trục D-shape 6mm"
    description: "Chuẩn D-shape phổ biến, lắp vừa hầu hết bánh xe/khớp nối bán sẵn trên thị trường."
specifications:
  - groupName: "Điện & công suất"
    rows:
      - label: "Điện áp định mức"
        value: "12V DC"
      - label: "Dòng không tải"
        value: "≤ 200mA"
      - label: "Dòng có tải định mức"
        value: "≤ 1.8A"
      - label: "Dòng khoá trục (stall)"
        value: "≤ 3A"
  - groupName: "Cơ khí"
    rows:
      - label: "Tốc độ không tải"
        value: "330 RPM"
      - label: "Mô-men khoá trục"
        value: "0.8 kg·cm"
      - label: "Tỉ số truyền hộp số"
        value: "1:34"
      - label: "Trục ra"
        value: "D-shape, Ø6mm, dài 12mm"
  - groupName: "Encoder"
    rows:
      - label: "Loại"
        value: "Quang học, quadrature 2 kênh (A/B)"
      - label: "Độ phân giải"
        value: "11 xung/vòng (trước hộp số)"
      - label: "Điện áp cấp encoder"
        value: "3.3–5V"
      - label: "Số dây ra"
        value: "6 dây (2 nguồn động cơ + 4 encoder)"
  - groupName: "Kích thước tổng"
    rows:
      - label: "Đường kính thân"
        value: "Ø37mm"
      - label: "Chiều dài (không kể trục)"
        value: "52mm"
      - label: "Khối lượng"
        value: "~120g"
usageSteps:
  - title: "Đấu dây"
    description: "2 dây lớn (thường đỏ/đen) nối driver động cơ (VD: L298N, TB6612). 4 dây nhỏ còn lại: VCC, GND, kênh A, kênh B — nối vào nguồn 5V và 2 chân ngắt ngoài (interrupt) của vi điều khiển."
  - title: "Đọc encoder trên Arduino/ESP32"
    description: "Dùng ngắt ngoài (interrupt) trên cả 2 kênh A và B để đếm xung đồng thời xác định chiều quay — xem thêm bài viết Encoder trong blog kỹ thuật."
    codeSnippet: |
      volatile long encoderCount = 0;

      void onEncoderA() {
        bool b = digitalRead(PIN_ENCODER_B);
        encoderCount += (digitalRead(PIN_ENCODER_A) == b) ? 1 : -1;
      }

      void setup() {
        pinMode(PIN_ENCODER_A, INPUT_PULLUP);
        pinMode(PIN_ENCODER_B, INPUT_PULLUP);
        attachInterrupt(digitalPinToInterrupt(PIN_ENCODER_A), onEncoderA, CHANGE);
      }
  - title: "Điều khiển tốc độ bằng PWM"
    description: "Gửi PWM 0-255 (Arduino) hoặc 0-100% (ESP32 LEDC) tới chân driver — kết hợp dữ liệu encoder ở bước trên để chạy vòng lặp PID giữ tốc độ ổn định thay vì chỉ đặt PWM cố định."
---

Động cơ DC giảm tốc JGB37-520 tích hợp sẵn encoder quang học 2 kênh (quadrature) — lựa chọn phổ biến cho robot di động cỡ nhỏ cần vừa điều khiển tốc độ vừa tính odometry từ vòng quay bánh xe.

Hộp số kim loại tỉ số truyền cao giữ mô-men khoá trục ổn định ở tốc độ thấp, phù hợp robot 2-4 bánh chủ động (differential drive hoặc mecanum) tải nhẹ đến trung bình.

## Vì sao chọn bản có encoder

Không có encoder, driver chỉ biết "đã gửi bao nhiêu PWM", không biết bánh xe **thực sự** quay bao nhiêu vòng — không đủ dữ liệu cho vòng lặp PID giữ tốc độ hay tính odometry. Bản JGB37-520 này đã tích hợp sẵn đĩa encoder ngay trong thân động cơ, không cần lắp thêm rời.
