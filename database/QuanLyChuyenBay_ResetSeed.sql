-- =============================================================================
-- QUẢN LÝ CHUYẾN BAY - RESET VÀ SEED DỮ LIỆU
-- Chạy file này khi cần xóa toàn bộ dữ liệu và chèn lại dữ liệu mẫu.
-- Database và bảng phải đã tồn tại (tạo bằng QuanLyChuyenBay_Full.sql).
-- =============================================================================

USE QuanLyChuyenBay;
GO

-- -----------------------------------------------------------------------------
-- XÓA DỮ LIỆU CŨ (theo thứ tự an toàn FK)
-- -----------------------------------------------------------------------------
TRUNCATE TABLE CHECKIN;
TRUNCATE TABLE THANHTOAN;
TRUNCATE TABLE HANHLY;
DELETE FROM VE;
DELETE FROM PHANCONG;
DELETE FROM NHANVIEN;
DELETE FROM LICHBAY;
DELETE FROM CHUYENBAY;
DELETE FROM GHE;
DELETE FROM TUYENBAY;
DELETE FROM MAYBAY;
DELETE FROM SANBAY;
DELETE FROM HANHKHACH;
DELETE FROM NGUOIDUNG;
DELETE FROM ROLES;
DELETE FROM HANGHANGKHONG;
GO

-- -----------------------------------------------------------------------------
-- DỮ LIỆU MẪU (SEED)
-- -----------------------------------------------------------------------------

-- 1. HANGHANGKHONG
INSERT INTO HANGHANGKHONG VALUES
('VNA', N'Vietnam Airlines', N'Việt Nam', 1956, N'Hà Nội'),
('VJC', N'Vietjet Air', N'Việt Nam', 2007, N'TP.HCM'),
('BAV', N'Bamboo Airways', N'Việt Nam', 2017, N'Hà Nội'),
('VTR', N'Vietravel Airlines', N'Việt Nam', 2019, N'Thừa Thiên Huế');

-- 2. SANBAY
INSERT INTO SANBAY VALUES
('HAN', N'Sân bay Nội Bài', N'Hà Nội', N'Việt Nam', N'Hoạt động'),
('SGN', N'Sân bay Tân Sơn Nhất', N'TP.HCM', N'Việt Nam', N'Hoạt động'),
('DAD', N'Sân bay Đà Nẵng', N'Đà Nẵng', N'Việt Nam', N'Hoạt động'),
('CXR', N'Sân bay Cam Ranh', N'Khánh Hòa', N'Việt Nam', N'Hoạt động'),
('PQC', N'Sân bay Phú Quốc', N'Kiên Giang', N'Việt Nam', N'Hoạt động'),
('HUI', N'Sân bay Phú Bài', N'Huế', N'Việt Nam', N'Hoạt động'),
('VCA', N'Sân bay Cần Thơ', N'Cần Thơ', N'Việt Nam', N'Hoạt động');

-- 3. MAYBAY
INSERT INTO MAYBAY VALUES
('VN-A321', 'VNA', N'Airbus A321', 184, N'Sẵn sàng'),
('VN-A350', 'VNA', N'Airbus A350', 305, N'Đang bay'),
('VJ-A320', 'VJC', N'Airbus A320', 180, N'Bảo trì'),
('VJ-A321', 'VJC', N'Airbus A321', 230, N'Sẵn sàng'),
('QH-B787', 'BAV', N'Boeing 787', 294, N'Sẵn sàng'),
('VU-A321', 'VTR', N'Airbus A321', 220, N'Sẵn sàng');

-- 4. TUYENBAY
INSERT INTO TUYENBAY VALUES
('HANSGN', 'HAN', 'SGN', 1160, 125, 1200000, N'Hoạt động'),
('SGNHAN', 'SGN', 'HAN', 1160, 125, 1200000, N'Hoạt động'),
('SGNDAD', 'SGN', 'DAD', 600, 80, 800000, N'Hoạt động'),
('DADSGN', 'DAD', 'SGN', 600, 80, 800000, N'Hoạt động'),
('HANPQC', 'HAN', 'PQC', 1200, 135, 1500000, N'Hoạt động'),
('SGNVCA', 'SGN', 'VCA', 170, 45, 500000, N'Hoạt động');

-- 5. CHUYENBAY
INSERT INTO CHUYENBAY VALUES
('CB001', 'HANSGN', 'VN-A321', '2024-05-10', '07:00', '09:05', 'Gate 01', N'Đã hạ cánh'),
('CB002', 'HANSGN', 'VN-A350', '2024-05-10', '10:00', '12:05', 'Gate 02', N'Đã hạ cánh'),
('CB003', 'SGNHAN', 'VJ-A321', '2024-05-15', '13:00', '15:05', 'Gate 05', N'Đúng giờ'),
('CB004', 'SGNDAD', 'QH-B787', '2024-05-15', '14:00', '15:20', 'Gate 08', N'Bị hoãn'),
('CB005', 'HANPQC', 'VU-A321', '2024-05-16', '08:00', '10:15', 'Gate 03', N'Hủy chuyến'),
('CB006', 'SGNVCA', 'VJ-A320', '2024-05-15', '18:00', '18:45', 'Gate 01', N'Đúng giờ');

-- 6. GHE
INSERT INTO GHE VALUES
('G-VN01', 'VN-A321', '01A', N'Thương gia', 1, 0),
('G-VN02', 'VN-A321', '01B', N'Thương gia', 0, 0),
('G-VN10', 'VN-A321', '10C', N'Phổ thông', 0, 1),
('G-VJ01', 'VJ-A321', '01A', N'Phổ thông', 1, 1),
('G-QH01', 'QH-B787', '01A', N'Thương gia', 1, 0);

-- 7. HANHKHACH
INSERT INTO HANHKHACH VALUES
('HK001', N'Trần Văn An', '001090123456', N'Nam', '1988-02-15', N'Việt Nam', '0901112223', 'an.tv@gmail.com'),
('HK002', N'Lê Thị Bình', '079095678901', N'Nữ', '1995-10-20', N'Việt Nam', '0904445556', 'binh.lt@gmail.com'),
('HK003', N'Nguyễn Công Phượng', '038095000111', N'Nam', '1995-01-21', N'Việt Nam', '0907778889', 'phuong.nc@gmail.com'),
('HK004', N'Michael Jordan', 'B99887766', N'Nam', '1980-05-05', N'USA', '0123456789', 'mj@nike.com'),
('HK005', N'Hoàng Xuân Vinh', '001080999888', N'Nam', '1974-10-06', N'Việt Nam', '0909990001', 'vinh.hx@olympic.vn');

-- 8. VE
INSERT INTO VE VALUES
('V001', 'CB001', 'VNA', 'HK001', 'G-VN01', '2024-05-10', 125, 3500000, 350000, 3850000, N'Thẻ tín dụng', N'Đã thanh toán', N'Đã Checkin'),
('V002', 'CB001', 'VNA', 'HK002', 'G-VN02', '2024-05-10', 125, 3500000, 350000, 3850000, N'Thẻ tín dụng', N'Đã thanh toán', N'Đã Checkin'),
('V003', 'CB003', 'VJC', 'HK003', 'G-VJ01', '2024-05-15', 125, 1200000, 120000, 1320000, N'Chuyển khoản', N'Đã thanh toán', N'Chưa Checkin'),
('V004', 'CB004', 'BAV', 'HK004', 'G-QH01', '2024-05-15', 80, 2000000, 200000, 2200000, N'Ví điện tử', N'Đã thanh toán', N'Chưa Checkin'),
('V005', 'CB005', 'VTR', 'HK005', 'G-VN10', '2024-05-16', 135, 1800000, 180000, 1980000, N'Tiền mặt', N'Đã hủy', N'Chưa Checkin'),
('V006', 'CB006', 'VJC', 'HK001', 'G-VJ01', '2024-05-15', 45, 600000, 60000, 660000, N'Chuyển khoản', N'Chờ thanh toán', N'Chưa Checkin');

-- 9. THANHTOAN
INSERT INTO THANHTOAN VALUES
('TT001', 'V001', N'Visa Card', '2024-05-01', 3850000, N'Thành công'),
('TT002', 'V002', N'Master Card', '2024-05-02', 3850000, N'Thành công'),
('TT003', 'V003', N'Momo', '2024-05-14', 1320000, N'Thành công'),
('TT004', 'V004', N'ZaloPay', '2024-05-14', 2200000, N'Thành công');

-- 10. CHECKIN
INSERT INTO CHECKIN VALUES
('CI001', 'V001', '2024-05-10 05:30:00'),
('CI002', 'V002', '2024-05-10 05:45:00');

-- 11. HANHLY (PhiHL = TrongLuong*50000, PhiQC = SoHL*100000)
INSERT INTO HANHLY VALUES
('HL001', 'V001', 30.0, 2, 1500000, 200000),
('HL002', 'V002', 20.0, 1, 1000000, 100000),
('HL003', 'V003', 45.0, 3, 2250000, 300000),
('HL004', 'V004', 15.0, 1, 750000, 100000);

-- 12. NHANVIEN
INSERT INTO NHANVIEN VALUES
('NV01', 'VNA', N'Phan Thanh Tùng', N'Cơ trưởng', N'ATPL', 20, N'Phi công'),
('NV02', 'VNA', N'Nguyễn Cẩm Tú', N'Tiếp viên trưởng', N'Safety Cert', 10, N'Tiếp viên'),
('NV03', 'VJC', N'Ricardo', N'Cơ phó', N'CPL', 7, N'Phi công');

-- 13. PHANCONG
INSERT INTO PHANCONG VALUES
('PC001', 'VNA', 'CB001', 'HANSGN', 'VN-A321', 'NV01', N'Cơ trưởng', '06:00', '10:00'),
('PC002', 'VNA', 'CB001', 'HANSGN', 'VN-A321', 'NV02', N'Tiếp viên trưởng', '06:00', '10:00'),
('PC003', 'VJC', 'CB003', 'SGNHAN', 'VJ-A321', 'NV03', N'Cơ phó', '12:00', '16:00');

-- 14. ROLES
INSERT INTO ROLES VALUES
(1, N'Admin', N'Quản trị toàn hệ thống'),
(2, N'Hỗ trợ', N'Nhân viên mặt đất/phòng vé'),
(3, N'Khách hàng', N'Tài khoản thành viên');

-- 15. NGUOIDUNG
INSERT INTO NGUOIDUNG VALUES
(1, 'admin_super', 'root123', N'Vương Quản Trị', 'admin@airport.gov.vn', '0900000000', 1, N'Hoạt động', '2023-01-01'),
(2, 'an_tran', 'an123', N'Trần Văn An', 'an.tv@gmail.com', '0901112223', 3, N'Hoạt động', '2024-01-15');
GO

PRINT N'Reset và seed dữ liệu hoàn tất.';
GO
