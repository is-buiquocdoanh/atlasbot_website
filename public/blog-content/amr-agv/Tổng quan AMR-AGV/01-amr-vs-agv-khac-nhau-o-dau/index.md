---
title: "AMR và AGV: Khác nhau ở đâu, khi nào dùng cái nào?"
slug: "amr-vs-agv-khac-nhau-o-dau"
category: "AMR / AGV"
subcategory: "Tổng quan AMR / AGV"
level: 1
tags: ["kien-thuc-nen-tang", "amr", "agv"]
publishedAt: "2026-06-02"
author: "Atlasbot"
coverImage: "amr-vs-agv.svg"
excerpt: "So sánh AGV (dẫn đường cố định) và AMR (tự định vị bằng SLAM) — khác nhau ở đâu và khi nào nên chọn loại nào cho nhà xưởng của bạn."
readingTime: 5
---

Nếu mới tìm hiểu về robot di động, bạn sẽ liên tục gặp hai từ viết tắt: **AGV** và **AMR**. Chúng thường bị dùng lẫn lộn, nhưng thực ra là hai triết lý điều hướng rất khác nhau — và lựa chọn sai có thể khiến cả một dây chuyền sản xuất phải dừng lại chỉ vì ai đó vô tình để một thùng hàng chắn ngang lối đi.

## AGV — đi theo đường đã vạch sẵn

AGV (**Automated Guided Vehicle**) là thế hệ robot vận chuyển xuất hiện từ những năm 1950. Nguyên lý cốt lõi: robot **không tự quyết định đường đi**, nó chỉ bám theo một "dấu vết" đã được lắp đặt sẵn trên sàn nhà xưởng — có thể là:

- Line từ băng từ hoặc sơn phản quang, robot dùng cảm biến quang để dò theo
- Dây dẫn điện chôn dưới sàn, robot dò từ trường
- Mã QR/tag RFID dán theo lưới cố định trên sàn

Vì đường đi là cố định, AGV **không cần bản đồ, không cần định vị phức tạp** — chỉ cần bám line thật chính xác. Đây là lý do AGV rẻ, dễ triển khai, và đã được kiểm chứng qua hàng chục năm trong nhà máy.

Nhược điểm cũng đến từ chính điểm mạnh đó: nếu có vật cản chắn ngang line, AGV thường chỉ biết dừng lại chờ (hoặc báo lỗi) chứ không tự vòng tránh. Muốn đổi lộ trình, bạn phải đi lắp lại line/dây dẫn vật lý.

## AMR — tự định vị và tự tránh vật cản

AMR (**Autonomous Mobile Robot**) là thế hệ mới hơn, dùng cảm biến (LiDAR, camera, IMU) kết hợp thuật toán **SLAM** (Simultaneous Localization and Mapping) để robot tự xây bản đồ khu vực và tự biết mình đang ở đâu trong bản đồ đó — không cần bất kỳ hạ tầng dẫn đường vật lý nào trên sàn.

Từ bản đồ và vị trí hiện tại, AMR dùng bộ lập kế hoạch đường đi (path planner) để tự tính lộ trình tới đích, và liên tục cập nhật lộ trình đó theo thời gian thực nếu phát hiện vật cản mới — có người đi ngang, có xe đẩy hàng đỗ tạm — mà không cần dừng hẳn dây chuyền.

Đánh đổi lại: AMR cần phần cứng cảm biến đắt hơn, thuật toán phức tạp hơn nhiều, và cần được "học" bản đồ khu vực trước khi hoạt động ổn định.

## Bảng so sánh nhanh

| Tiêu chí | AGV | AMR |
|---|---|---|
| Cách dẫn đường | Line/dây/tag cố định trên sàn | Tự định vị bằng SLAM, không cần hạ tầng |
| Tránh vật cản | Dừng lại / báo lỗi | Tự tính lại đường đi |
| Đổi lộ trình | Phải lắp lại hạ tầng vật lý | Chỉ cần cập nhật phần mềm |
| Chi phí cảm biến | Thấp | Cao hơn (LiDAR, camera...) |
| Độ phức tạp phần mềm | Thấp | Cao (SLAM, path planning) |
| Phù hợp | Lộ trình cố định, khối lượng lớn, chi phí thấp | Môi trường thay đổi, cần linh hoạt |

## Vậy khi nào nên chọn cái nào?

Chọn **AGV** khi lộ trình vận chuyển gần như không đổi (ví dụ: chuyển linh kiện giữa hai trạm cố định trong dây chuyền lắp ráp), khối lượng hàng lớn, và bạn muốn chi phí đầu tư thấp, dễ bảo trì.

Chọn **AMR** khi môi trường thay đổi thường xuyên (nhà kho có người và xe đẩy qua lại), cần robot phục vụ nhiều điểm đến khác nhau linh hoạt, hoặc khi chi phí lắp đặt lại hạ tầng dẫn đường mỗi lần đổi layout là quá tốn kém.

Trong thực tế, nhiều nhà máy hiện đại dùng kết hợp cả hai: AGV cho các tuyến vận chuyển khối lượng lớn cố định, AMR cho các tác vụ linh hoạt hơn ở khu vực có người làm việc chung.

## Kết luận

AGV và AMR không phải "phiên bản cũ/mới" của nhau mà là hai lựa chọn kỹ thuật phù hợp với hai bài toán khác nhau. Ở các bài tiếp theo trong chuyên mục này, chúng ta sẽ đi sâu vào từng mảnh ghép làm nên một con AMR hoàn chỉnh — từ kiến trúc phần cứng, vòng lặp điều khiển, cho đến động học di chuyển.
