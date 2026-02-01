# Export Database QuanLyChuyenBay

## QuanLyChuyenBay_Full.sql

**Dùng để tạo lại database từ đầu trên máy khác.**

1. Mở SQL Server Management Studio, kết nối tới SQL Server.
2. Mở file `QuanLyChuyenBay_Full.sql`.
3. Chạy toàn bộ (F5).

Script sẽ:
- Tạo database `QuanLyChuyenBay` (nếu chưa có).
- Tạo tất cả bảng.
- Chèn dữ liệu mẫu.
- Tạo 3 Functions, 7 Stored Procedures, 5 Triggers.

**Lưu ý:** Nếu database đã tồn tại, chỉ chạy phần 2–5 (bỏ qua phần 1 hoặc dùng database hiện có và chạy từ USE QuanLyChuyenBay). Nếu chạy nguyên file khi đã có bảng thì sẽ báo lỗi “object already exists”. Để cập nhật database cũ lên schema mới, dùng script migration hoặc drop database rồi chạy lại Full script.

## QuanLyChuyenBay_ResetSeed.sql

**Dùng để xóa toàn bộ dữ liệu và chèn lại dữ liệu mẫu (không xóa bảng / Functions / Procedures / Triggers).**

1. Database và bảng phải đã tồn tại (chạy `QuanLyChuyenBay_Full.sql` trước nếu chưa có).
2. Mở file `QuanLyChuyenBay_ResetSeed.sql` trong SSMS, chạy toàn bộ (F5).

Script sẽ TRUNCATE/DELETE dữ liệu cũ theo thứ tự FK rồi INSERT lại toàn bộ seed. Dữ liệu đồng bộ với Full.sql (CHUYENBAY, HANHLY PhiHL/PhiQC).

## Cấu trúc phiên bản mới

- **Schema:** `MaVe`, `MaThanhToan`, `MaHanhLy` dùng `VARCHAR(20)`; FK thống nhất tên bảng HOA.
- **Procedure Đặt vé:** Lấy đúng NgayBay từ CHUYENBAY, ThoiGianBay từ TUYENBAY, MaHang từ MAYBAY; encoding N'Chưa thanh toán', N'Chưa check-in'.
- **Procedure Thanh toán vé:** `@MaThanhToan VARCHAR(20)`.
- **Procedure Thêm hành lý:** Chỉ INSERT PhiHL/PhiQC = 0, để trigger tự tính.
