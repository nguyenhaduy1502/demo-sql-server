-- =============================================================================
-- QUẢN LÝ CHUYẾN BAY - SCRIPT TẠO LẠI DATABASE TRÊN MÁY KHÁC
-- Chạy toàn bộ file này trong SQL Server Management Studio (F5)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- PHẦN 1: TẠO DATABASE VÀ BẢNG
-- -----------------------------------------------------------------------------
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'QuanLyChuyenBay')
    CREATE DATABASE QuanLyChuyenBay;
GO

USE QuanLyChuyenBay;
GO

CREATE TABLE HANGHANGKHONG (
    MaHang VARCHAR(10) PRIMARY KEY,
    TenHang NVARCHAR(100),
    QuocGia NVARCHAR(50),
    NamThanhLap INT,
    TruSo NVARCHAR(100)
);

CREATE TABLE MAYBAY (
    MaMayBay VARCHAR(10) PRIMARY KEY,
    MaHang VARCHAR(10),
    LoaiMayBay NVARCHAR(50),
    TongGhe INT,
    TrangThai NVARCHAR(30),
    FOREIGN KEY (MaHang) REFERENCES HANGHANGKHONG(MaHang)
);

CREATE TABLE SANBAY (
    MaSanBay VARCHAR(10) PRIMARY KEY,
    TenSanBay NVARCHAR(100),
    ThanhPho NVARCHAR(50),
    QuocGia NVARCHAR(50),
    TrangThai NVARCHAR(30)
);

CREATE TABLE TUYENBAY (
    MaTuyenBay VARCHAR(10) PRIMARY KEY,
    SanBayDi VARCHAR(10),
    SanBayDen VARCHAR(10),
    KhoangCach INT,
    ThoiGianTrungBinh INT,
    GiaVeCoBan DECIMAL(12,2),
    TrangThai NVARCHAR(30),
    FOREIGN KEY (SanBayDi) REFERENCES SANBAY(MaSanBay),
    FOREIGN KEY (SanBayDen) REFERENCES SANBAY(MaSanBay)
);

CREATE TABLE GHE (
    MaGhe VARCHAR(10) PRIMARY KEY,
    MaMayBay VARCHAR(10),
    SoGhe VARCHAR(5),
    LoaiGhe NVARCHAR(30),
    GheCuaSo BIT,
    GheThuong BIT,
    FOREIGN KEY (MaMayBay) REFERENCES MAYBAY(MaMayBay)
);

CREATE TABLE CHUYENBAY (
    MaChuyenBay VARCHAR(10) PRIMARY KEY,
    MaTuyenBay VARCHAR(10),
    MaMayBay VARCHAR(10),
    NgayBay DATE,
    GioCatCanh TIME,
    GioHaCanh TIME,
    Gate NVARCHAR(10),
    TrangThai NVARCHAR(30),
    FOREIGN KEY (MaTuyenBay) REFERENCES TUYENBAY(MaTuyenBay),
    FOREIGN KEY (MaMayBay) REFERENCES MAYBAY(MaMayBay)
);

CREATE TABLE LICHBAY (
    MaLichBay VARCHAR(10) PRIMARY KEY,
    MaChuyenBay VARCHAR(10),
    MaHang VARCHAR(10),
    MaMayBay VARCHAR(10),
    NgayBay DATE,
    GioCatCanh TIME,
    GioHaCanh TIME,
    TrangThai NVARCHAR(30),
    FOREIGN KEY (MaChuyenBay) REFERENCES CHUYENBAY(MaChuyenBay),
    FOREIGN KEY (MaHang) REFERENCES HANGHANGKHONG(MaHang),
    FOREIGN KEY (MaMayBay) REFERENCES MAYBAY(MaMayBay)
);

CREATE TABLE HANHKHACH (
    MaHK VARCHAR(10) PRIMARY KEY,
    FullName NVARCHAR(100),
    HoChieuCCCD VARCHAR(20),
    GioiTinh NVARCHAR(10),
    NgaySinh DATE,
    QuocTich NVARCHAR(50),
    SoDT VARCHAR(15),
    Email VARCHAR(100)
);

CREATE TABLE VE (
    MaVe VARCHAR(20) PRIMARY KEY,
    MaChuyenBay VARCHAR(10),
    MaHang VARCHAR(10),
    MaHK VARCHAR(10),
    MaGhe VARCHAR(10),
    NgayBay DATE,
    ThoiGianBay INT,
    GiaVe DECIMAL(12,2),
    Thue DECIMAL(12,2),
    TongTien DECIMAL(12,2),
    HinhThucThanhToan NVARCHAR(30),
    TrangThai NVARCHAR(30),
    CheckInTrangThai NVARCHAR(30),
    FOREIGN KEY (MaChuyenBay) REFERENCES CHUYENBAY(MaChuyenBay),
    FOREIGN KEY (MaHang) REFERENCES HANGHANGKHONG(MaHang),
    FOREIGN KEY (MaHK) REFERENCES HANHKHACH(MaHK),
    FOREIGN KEY (MaGhe) REFERENCES GHE(MaGhe)
);

CREATE TABLE HANHLY (
    MaHanhLy VARCHAR(20) PRIMARY KEY,
    MaVe VARCHAR(20),
    TrongLuong FLOAT,
    SoHL INT,
    PhiHL DECIMAL(12,2),
    PhiQC DECIMAL(12,2),
    FOREIGN KEY (MaVe) REFERENCES VE(MaVe)
);

CREATE TABLE THANHTOAN (
    MaThanhToan VARCHAR(20) PRIMARY KEY,
    MaVe VARCHAR(20),
    PhuongThuc NVARCHAR(30),
    NgayThanhToan DATE,
    SoTien DECIMAL(12,2),
    TrangThai NVARCHAR(30),
    FOREIGN KEY (MaVe) REFERENCES VE(MaVe)
);

CREATE TABLE CHECKIN (
    MaCheckIn VARCHAR(10) PRIMARY KEY,
    MaVe VARCHAR(20),
    ThoiGianCK DATETIME,
    FOREIGN KEY (MaVe) REFERENCES VE(MaVe)
);

CREATE TABLE NHANVIEN (
    MaNV VARCHAR(10) PRIMARY KEY,
    MaHang VARCHAR(10),
    HoTen NVARCHAR(100),
    ChucVu NVARCHAR(50),
    ChungChi NVARCHAR(100),
    NamKinhNghiem INT,
    Role NVARCHAR(30),
    FOREIGN KEY (MaHang) REFERENCES HANGHANGKHONG(MaHang)
);

CREATE TABLE PHANCONG (
    MaRole VARCHAR(10) PRIMARY KEY,
    MaHang VARCHAR(10),
    MaChuyenBay VARCHAR(10),
    MaTuyenBay VARCHAR(10),
    MaMayBay VARCHAR(10),
    MaNV VARCHAR(10),
    VaiTro NVARCHAR(50),
    GioBatDau TIME,
    GioKetThuc TIME,
    FOREIGN KEY (MaHang) REFERENCES HANGHANGKHONG(MaHang),
    FOREIGN KEY (MaChuyenBay) REFERENCES CHUYENBAY(MaChuyenBay),
    FOREIGN KEY (MaTuyenBay) REFERENCES TUYENBAY(MaTuyenBay),
    FOREIGN KEY (MaMayBay) REFERENCES MAYBAY(MaMayBay),
    FOREIGN KEY (MaNV) REFERENCES NHANVIEN(MaNV)
);

CREATE TABLE ROLES (
    RoleID INT PRIMARY KEY,
    VaiTro NVARCHAR(50),
    MoTa NVARCHAR(200)
);

CREATE TABLE NGUOIDUNG (
    UserID INT PRIMARY KEY,
    Username VARCHAR(50),
    Password VARCHAR(100),
    HoTen NVARCHAR(100),
    Email VARCHAR(100),
    SoDT VARCHAR(15),
    RoleID INT,
    TrangThai NVARCHAR(30),
    NgayTao DATE,
    FOREIGN KEY (RoleID) REFERENCES ROLES(RoleID)
);
GO

-- -----------------------------------------------------------------------------
-- PHẦN 2: DỮ LIỆU MẪU (SEED)
-- -----------------------------------------------------------------------------
INSERT INTO HANGHANGKHONG VALUES
('VNA', N'Vietnam Airlines', N'Việt Nam', 1956, N'Hà Nội'),
('VJC', N'Vietjet Air', N'Việt Nam', 2007, N'TP.HCM'),
('BAV', N'Bamboo Airways', N'Việt Nam', 2017, N'Hà Nội'),
('VTR', N'Vietravel Airlines', N'Việt Nam', 2019, N'Thừa Thiên Huế');

INSERT INTO SANBAY VALUES
('HAN', N'Sân bay Nội Bài', N'Hà Nội', N'Việt Nam', N'Hoạt động'),
('SGN', N'Sân bay Tân Sơn Nhất', N'TP.HCM', N'Việt Nam', N'Hoạt động'),
('DAD', N'Sân bay Đà Nẵng', N'Đà Nẵng', N'Việt Nam', N'Hoạt động'),
('CXR', N'Sân bay Cam Ranh', N'Khánh Hòa', N'Việt Nam', N'Hoạt động'),
('PQC', N'Sân bay Phú Quốc', N'Kiên Giang', N'Việt Nam', N'Hoạt động'),
('HUI', N'Sân bay Phú Bài', N'Huế', N'Việt Nam', N'Hoạt động'),
('VCA', N'Sân bay Cần Thơ', N'Cần Thơ', N'Việt Nam', N'Hoạt động');

INSERT INTO MAYBAY VALUES
('VN-A321', 'VNA', N'Airbus A321', 184, N'Sẵn sàng'),
('VN-A350', 'VNA', N'Airbus A350', 305, N'Đang bay'),
('VJ-A320', 'VJC', N'Airbus A320', 180, N'Bảo trì'),
('VJ-A321', 'VJC', N'Airbus A321', 230, N'Sẵn sàng'),
('QH-B787', 'BAV', N'Boeing 787', 294, N'Sẵn sàng'),
('VU-A321', 'VTR', N'Airbus A321', 220, N'Sẵn sàng');

INSERT INTO TUYENBAY VALUES
('HANSGN', 'HAN', 'SGN', 1160, 125, 1200000, N'Hoạt động'),
('SGNHAN', 'SGN', 'HAN', 1160, 125, 1200000, N'Hoạt động'),
('SGNDAD', 'SGN', 'DAD', 600, 80, 800000, N'Hoạt động'),
('DADSGN', 'DAD', 'SGN', 600, 80, 800000, N'Hoạt động'),
('HANPQC', 'HAN', 'PQC', 1200, 135, 1500000, N'Hoạt động'),
('SGNVCA', 'SGN', 'VCA', 170, 45, 500000, N'Hoạt động');

INSERT INTO CHUYENBAY VALUES
('CB001', 'HANSGN', 'VN-A321', '2024-05-10', '07:00', '09:05', 'Gate 01', N'Đã hạ cánh'),
('CB002', 'HANSGN', 'VN-A350', '2024-05-10', '10:00', '12:05', 'Gate 02', N'Đã hạ cánh'),
('CB003', 'SGNHAN', 'VJ-A321', '2024-05-15', '13:00', '15:05', 'Gate 05', N'Đúng giờ'),
('CB004', 'SGNDAD', 'QH-B787', '2024-05-15', '14:00', '15:20', 'Gate 08', N'Bị hoãn'),
('CB005', 'HANPQC', 'VU-A321', '2024-05-16', '08:00', '10:15', 'Gate 03', N'Hủy chuyến'),
('CB006', 'SGNVCA', 'VJ-A320', '2024-05-15', '18:00', '18:45', 'Gate 01', N'Đúng giờ');

INSERT INTO GHE VALUES
('G-VN01', 'VN-A321', '01A', N'Thương gia', 1, 0),
('G-VN02', 'VN-A321', '01B', N'Thương gia', 0, 0),
('G-VN10', 'VN-A321', '10C', N'Phổ thông', 0, 1),
('G-VJ01', 'VJ-A321', '01A', N'Phổ thông', 1, 1),
('G-QH01', 'QH-B787', '01A', N'Thương gia', 1, 0);

INSERT INTO HANHKHACH VALUES
('HK001', N'Trần Văn An', '001090123456', N'Nam', '1988-02-15', N'Việt Nam', '0901112223', 'an.tv@gmail.com'),
('HK002', N'Lê Thị Bình', '079095678901', N'Nữ', '1995-10-20', N'Việt Nam', '0904445556', 'binh.lt@gmail.com'),
('HK003', N'Nguyễn Công Phượng', '038095000111', N'Nam', '1995-01-21', N'Việt Nam', '0907778889', 'phuong.nc@gmail.com'),
('HK004', N'Michael Jordan', 'B99887766', N'Nam', '1980-05-05', N'USA', '0123456789', 'mj@nike.com'),
('HK005', N'Hoàng Xuân Vinh', '001080999888', N'Nam', '1974-10-06', N'Việt Nam', '0909990001', 'vinh.hx@olympic.vn');

INSERT INTO VE VALUES
('V001', 'CB001', 'VNA', 'HK001', 'G-VN01', '2024-05-10', 125, 3500000, 350000, 3850000, N'Thẻ tín dụng', N'Đã thanh toán', N'Đã Checkin'),
('V002', 'CB001', 'VNA', 'HK002', 'G-VN02', '2024-05-10', 125, 3500000, 350000, 3850000, N'Thẻ tín dụng', N'Đã thanh toán', N'Đã Checkin'),
('V003', 'CB003', 'VJC', 'HK003', 'G-VJ01', '2024-05-15', 125, 1200000, 120000, 1320000, N'Chuyển khoản', N'Đã thanh toán', N'Chưa Checkin'),
('V004', 'CB004', 'BAV', 'HK004', 'G-QH01', '2024-05-15', 80, 2000000, 200000, 2200000, N'Ví điện tử', N'Đã thanh toán', N'Chưa Checkin'),
('V005', 'CB005', 'VTR', 'HK005', 'G-VN10', '2024-05-16', 135, 1800000, 180000, 1980000, N'Tiền mặt', N'Đã hủy', N'Chưa Checkin'),
('V006', 'CB006', 'VJC', 'HK001', 'G-VJ01', '2024-05-15', 45, 600000, 60000, 660000, N'Chuyển khoản', N'Chờ thanh toán', N'Chưa Checkin');

INSERT INTO THANHTOAN VALUES
('TT001', 'V001', N'Visa Card', '2024-05-01', 3850000, N'Thành công'),
('TT002', 'V002', N'Master Card', '2024-05-02', 3850000, N'Thành công'),
('TT003', 'V003', N'Momo', '2024-05-14', 1320000, N'Thành công'),
('TT004', 'V004', N'ZaloPay', '2024-05-14', 2200000, N'Thành công');

INSERT INTO CHECKIN VALUES
('CI001', 'V001', '2024-05-10 05:30:00'),
('CI002', 'V002', '2024-05-10 05:45:00');

INSERT INTO HANHLY VALUES
('HL001', 'V001', 30.0, 2, 1500000, 200000),
('HL002', 'V002', 20.0, 1, 1000000, 100000),
('HL003', 'V003', 45.0, 3, 2250000, 300000),
('HL004', 'V004', 15.0, 1, 750000, 100000);

INSERT INTO NHANVIEN VALUES
('NV01', 'VNA', N'Phan Thanh Tùng', N'Cơ trưởng', N'ATPL', 20, N'Phi công'),
('NV02', 'VNA', N'Nguyễn Cẩm Tú', N'Tiếp viên trưởng', N'Safety Cert', 10, N'Tiếp viên'),
('NV03', 'VJC', N'Ricardo', N'Cơ phó', N'CPL', 7, N'Phi công');

INSERT INTO PHANCONG VALUES
('PC001', 'VNA', 'CB001', 'HANSGN', 'VN-A321', 'NV01', N'Cơ trưởng', '06:00', '10:00'),
('PC002', 'VNA', 'CB001', 'HANSGN', 'VN-A321', 'NV02', N'Tiếp viên trưởng', '06:00', '10:00'),
('PC003', 'VJC', 'CB003', 'SGNHAN', 'VJ-A321', 'NV03', N'Cơ phó', '12:00', '16:00');

INSERT INTO ROLES VALUES
(1, N'Admin', N'Quản trị toàn hệ thống'),
(2, N'Hỗ trợ', N'Nhân viên mặt đất/phòng vé'),
(3, N'Khách hàng', N'Tài khoản thành viên');

INSERT INTO NGUOIDUNG VALUES
(1, 'admin_super', 'root123', N'Vương Quản Trị', 'admin@airport.gov.vn', '0900000000', 1, N'Hoạt động', '2023-01-01'),
(2, 'an_tran', 'an123', N'Trần Văn An', 'an.tv@gmail.com', '0901112223', 3, N'Hoạt động', '2024-01-15');
GO

-- -----------------------------------------------------------------------------
-- PHẦN 3: FUNCTIONS
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[fn_TinhTongTien]') AND type IN (N'FN', N'IF', N'TF', N'FS', N'FT'))
    DROP FUNCTION [dbo].[fn_TinhTongTien];
GO
CREATE FUNCTION fn_TinhTongTien (@GiaVe DECIMAL(12,2), @Thue DECIMAL(12,2))
RETURNS DECIMAL(12,2)
AS
BEGIN
    RETURN @GiaVe + @Thue
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[fn_KiemTraGheDaDat]') AND type IN (N'FN', N'IF', N'TF', N'FS', N'FT'))
    DROP FUNCTION [dbo].[fn_KiemTraGheDaDat];
GO
CREATE FUNCTION fn_KiemTraGheDaDat (@MaGhe VARCHAR(10), @MaChuyenBay VARCHAR(10))
RETURNS BIT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM VE WHERE MaGhe = @MaGhe AND MaChuyenBay = @MaChuyenBay)
        RETURN 1
    RETURN 0
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[fn_TinhPhiHanhLy]') AND type IN (N'FN', N'IF', N'TF', N'FS', N'FT'))
    DROP FUNCTION [dbo].[fn_TinhPhiHanhLy];
GO
CREATE FUNCTION fn_TinhPhiHanhLy (@TrongLuong FLOAT, @SoHL INT)
RETURNS DECIMAL(12,2)
AS
BEGIN
    DECLARE @Phi DECIMAL(12,2) = 0;
    IF @TrongLuong > 20
        SET @Phi = @Phi + ((@TrongLuong - 20) * 50000);
    IF @SoHL > 1
        SET @Phi = @Phi + ((@SoHL - 1) * 100000);
    RETURN @Phi;
END
GO

-- -----------------------------------------------------------------------------
-- PHẦN 4: STORED PROCEDURES
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DatVe]') AND type IN (N'P', N'PC'))
    DROP PROCEDURE [dbo].[DatVe];
GO
CREATE PROCEDURE DatVe
    @MaHK VARCHAR(10),
    @MaChuyenBay VARCHAR(10),
    @MaGhe VARCHAR(10),
    @HinhThucThanhToan NVARCHAR(30)
AS
BEGIN
    DECLARE @GiaVe DECIMAL(12,2), @Thue DECIMAL(12,2), @TongTien DECIMAL(12,2)
    DECLARE @ThoiGianBay INT
    DECLARE @MaHang VARCHAR(10)
    DECLARE @NgayBay DATE
    DECLARE @MaVe VARCHAR(20)

    SELECT @GiaVe = TB.GiaVeCoBan, @ThoiGianBay = TB.ThoiGianTrungBinh
    FROM TUYENBAY TB
    INNER JOIN CHUYENBAY CB ON TB.MaTuyenBay = CB.MaTuyenBay
    WHERE CB.MaChuyenBay = @MaChuyenBay

    SELECT @MaHang = MB.MaHang
    FROM CHUYENBAY CB
    INNER JOIN MAYBAY MB ON CB.MaMayBay = MB.MaMayBay
    WHERE CB.MaChuyenBay = @MaChuyenBay

    SELECT @NgayBay = CB.NgayBay
    FROM CHUYENBAY CB
    WHERE CB.MaChuyenBay = @MaChuyenBay

    SET @Thue = @GiaVe * 0.1
    SET @TongTien = @GiaVe + @Thue
    SET @MaVe = CONCAT('VE', FORMAT(GETDATE(), 'yyyyMMddHHmmss'))

    INSERT INTO VE (MaVe, MaChuyenBay, MaHang, MaHK, MaGhe, NgayBay, ThoiGianBay, GiaVe, Thue, TongTien, HinhThucThanhToan, TrangThai, CheckInTrangThai)
    VALUES (@MaVe, @MaChuyenBay, @MaHang, @MaHK, @MaGhe, @NgayBay, @ThoiGianBay, @GiaVe, @Thue, @TongTien, @HinhThucThanhToan, N'Chưa thanh toán', N'Chưa check-in')
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CapNhatTrangThaiChuyenBay]') AND type IN (N'P', N'PC'))
    DROP PROCEDURE [dbo].[CapNhatTrangThaiChuyenBay];
GO
CREATE PROCEDURE CapNhatTrangThaiChuyenBay
    @MaChuyenBay VARCHAR(10),
    @TrangThai NVARCHAR(30)
AS
BEGIN
    UPDATE CHUYENBAY SET TrangThai = @TrangThai WHERE MaChuyenBay = @MaChuyenBay
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ThanhToanVe]') AND type IN (N'P', N'PC'))
    DROP PROCEDURE [dbo].[ThanhToanVe];
GO
CREATE PROCEDURE ThanhToanVe
    @MaVe VARCHAR(20),
    @PhuongThuc NVARCHAR(30),
    @SoTien DECIMAL(12,2)
AS
BEGIN
    UPDATE VE SET TrangThai = N'Đã thanh toán' WHERE MaVe = @MaVe;
    DECLARE @MaThanhToan VARCHAR(20) = CONCAT('TT', FORMAT(GETDATE(), 'yyyyMMddHHmmss'));
    INSERT INTO THANHTOAN (MaThanhToan, MaVe, PhuongThuc, NgayThanhToan, SoTien, TrangThai)
    VALUES (@MaThanhToan, @MaVe, @PhuongThuc, GETDATE(), @SoTien, N'Thành công');
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[HuyVe]') AND type IN (N'P', N'PC'))
    DROP PROCEDURE [dbo].[HuyVe];
GO
CREATE PROCEDURE HuyVe
    @MaVe VARCHAR(20)
AS
BEGIN
    UPDATE VE SET TrangThai = N'Đã hủy' WHERE MaVe = @MaVe;
    DELETE FROM HANHLY WHERE MaVe = @MaVe;
    DELETE FROM CHECKIN WHERE MaVe = @MaVe;
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DoanhThuChuyenBay]') AND type IN (N'P', N'PC'))
    DROP PROCEDURE [dbo].[DoanhThuChuyenBay];
GO
CREATE PROCEDURE DoanhThuChuyenBay
    @MaChuyenBay VARCHAR(10)
AS
BEGIN
    SELECT CB.MaChuyenBay, SUM(VE.TongTien) AS TongDoanhThu, COUNT(VE.MaVe) AS SoLuongVe
    FROM CHUYENBAY CB
    INNER JOIN VE ON CB.MaChuyenBay = VE.MaChuyenBay
    WHERE CB.MaChuyenBay = @MaChuyenBay AND VE.TrangThai = N'Đã thanh toán'
    GROUP BY CB.MaChuyenBay;
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DanhSachHanhKhach]') AND type IN (N'P', N'PC'))
    DROP PROCEDURE [dbo].[DanhSachHanhKhach];
GO
CREATE PROCEDURE DanhSachHanhKhach
    @MaChuyenBay VARCHAR(10)
AS
BEGIN
    SELECT HK.MaHK, HK.FullName, HK.QuocTich, HK.SoDT, VE.MaVe, VE.TrangThai
    FROM HANHKHACH HK
    INNER JOIN VE ON HK.MaHK = VE.MaHK
    WHERE VE.MaChuyenBay = @MaChuyenBay;
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ThemHanhLy]') AND type IN (N'P', N'PC'))
    DROP PROCEDURE [dbo].[ThemHanhLy];
GO
CREATE PROCEDURE ThemHanhLy
    @MaVe VARCHAR(20),
    @TrongLuong FLOAT,
    @SoHL INT
AS
BEGIN
    DECLARE @MaHanhLy VARCHAR(20) = CONCAT('HL', FORMAT(GETDATE(), 'yyyyMMddHHmmss'));
    INSERT INTO HANHLY (MaHanhLy, MaVe, TrongLuong, SoHL, PhiHL, PhiQC)
    VALUES (@MaHanhLy, @MaVe, @TrongLuong, @SoHL, 0, 0);
END
GO

-- -----------------------------------------------------------------------------
-- PHẦN 5: TRIGGERS
-- -----------------------------------------------------------------------------
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_ThanhToan_UpdateTrangThaiVe')
    DROP TRIGGER trg_ThanhToan_UpdateTrangThaiVe;
GO
CREATE TRIGGER trg_ThanhToan_UpdateTrangThaiVe ON THANHTOAN AFTER INSERT
AS
BEGIN
    UPDATE VE SET TrangThai = N'Đã thanh toán' WHERE MaVe IN (SELECT MaVe FROM inserted)
END
GO

IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_TinhPhiHanhLy')
    DROP TRIGGER trg_TinhPhiHanhLy;
GO
CREATE TRIGGER trg_TinhPhiHanhLy ON HANHLY AFTER INSERT
AS
BEGIN
    UPDATE HL SET HL.PhiHL = i.TrongLuong * 50000, HL.PhiQC = i.SoHL * 100000
    FROM HANHLY HL INNER JOIN inserted i ON HL.MaHanhLy = i.MaHanhLy
END
GO

IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_CapNhatTrangThaiChuyenBay')
    DROP TRIGGER trg_CapNhatTrangThaiChuyenBay;
GO
CREATE TRIGGER trg_CapNhatTrangThaiChuyenBay ON CHUYENBAY AFTER UPDATE
AS
BEGIN
    UPDATE CHUYENBAY SET TrangThai = N'Hoàn thành'
    WHERE GioHaCanh < CONVERT(TIME, GETDATE()) AND NgayBay < CONVERT(DATE, GETDATE()) AND TrangThai <> N'Hoàn thành';
END
GO

IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_KiemTraTuyenBay')
    DROP TRIGGER trg_KiemTraTuyenBay;
GO
CREATE TRIGGER trg_KiemTraTuyenBay ON TUYENBAY INSTEAD OF INSERT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE SanBayDi = SanBayDen)
        THROW 50001, N'Tuyến bay không thể có sân bay đi và đến giống nhau!', 1;
    INSERT INTO TUYENBAY (MaTuyenBay, SanBayDi, SanBayDen, KhoangCach, ThoiGianTrungBinh, GiaVeCoBan, TrangThai)
    SELECT MaTuyenBay, SanBayDi, SanBayDen, KhoangCach, ThoiGianTrungBinh, GiaVeCoBan, TrangThai FROM inserted;
END
GO

IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_TinhTongTienVe')
    DROP TRIGGER trg_TinhTongTienVe;
GO
CREATE TRIGGER trg_TinhTongTienVe ON VE AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE v SET v.TongTien = v.GiaVe + v.Thue
    FROM VE v INNER JOIN inserted i ON v.MaVe = i.MaVe;
END
GO

-- -----------------------------------------------------------------------------
-- PHẦN 6: CURSOR
-- -----------------------------------------------------------------------------
/*
-- Ví dụ 1: Cursor duyệt qua tất cả chuyến bay, đưa kết quả vào bảng tạm
DECLARE @MaChuyenBay VARCHAR(10), @MaTuyenBay VARCHAR(10), @NgayBay DATE, @TrangThai NVARCHAR(30);
DECLARE @Kq TABLE (MaChuyenBay VARCHAR(10), MaTuyenBay VARCHAR(10), NgayBay DATE, TrangThai NVARCHAR(30));

DECLARE cur_ChuyenBay CURSOR LOCAL FORWARD_ONLY READ_ONLY FOR
    SELECT MaChuyenBay, MaTuyenBay, NgayBay, TrangThai FROM CHUYENBAY;

OPEN cur_ChuyenBay;
FETCH NEXT FROM cur_ChuyenBay INTO @MaChuyenBay, @MaTuyenBay, @NgayBay, @TrangThai;

WHILE @@FETCH_STATUS = 0
BEGIN
    INSERT INTO @Kq (MaChuyenBay, MaTuyenBay, NgayBay, TrangThai)
    VALUES (@MaChuyenBay, @MaTuyenBay, @NgayBay, @TrangThai);
    FETCH NEXT FROM cur_ChuyenBay INTO @MaChuyenBay, @MaTuyenBay, @NgayBay, @TrangThai;
END

CLOSE cur_ChuyenBay;
DEALLOCATE cur_ChuyenBay;

SELECT * FROM @Kq;
*/

/*
-- Ví dụ 2: Cursor duyệt qua vé (MaVe, TongTien), đưa kết quả vào bảng tạm
DECLARE @MaVe VARCHAR(20), @TongTien DECIMAL(12,2);
DECLARE @Kq TABLE (MaVe VARCHAR(20), TongTien DECIMAL(12,2));

DECLARE cur_Ve CURSOR LOCAL FORWARD_ONLY READ_ONLY FOR
    SELECT MaVe, TongTien FROM VE;

OPEN cur_Ve;
FETCH NEXT FROM cur_Ve INTO @MaVe, @TongTien;

WHILE @@FETCH_STATUS = 0
BEGIN
    INSERT INTO @Kq (MaVe, TongTien) VALUES (@MaVe, @TongTien);
    FETCH NEXT FROM cur_Ve INTO @MaVe, @TongTien;
END

CLOSE cur_Ve;
DEALLOCATE cur_Ve;

SELECT * FROM @Kq;
*/

-- An toàn thông tin
--Tạo role bán vé
CREATE ROLE RoleBanVe;
-- Cấp quyền Role bán vé
GRANT SELECT ON SANBAY TO RoleBanVe;
GRANT SELECT ON CHUYENBAY TO RoleBanVe;
GRANT SELECT ON GHE TO RoleBanVe;
GRANT SELECT, INSERT ON KHACHHANG TO RoleBanVe;
GRANT SELECT, INSERT ON VE TO RoleBanVe;
GRANT SELECT, INSERT ON THANHTOAN TO RoleBanVe;

--Tao Role quản lý chuyến bay
CREATE ROLE RoleQuanLyChuyenBay;
-- Cấp quyền cho Role quản lý chuyến bay
GRANT SELECT, INSERT, UPDATE ON SANBAY TO RoleQuanLyChuyenBay;
GRANT SELECT, INSERT, UPDATE ON CHUYENBAY TO RoleQuanLyChuyenBay;
GRANT SELECT, INSERT, UPDATE ON GHE TO RoleQuanLyChuyenBay;
GRANT SELECT ON VE TO RoleQuanLyChuyenBay;
GRANT SELECT ON THANHTOAN TO RoleQuanLyChuyenBay;

--Tạo Role quản trị hệ thống
CREATE ROLE RoleAdmin;
--Cấp quyền Quyền cho RoleAdmin(Toàn quyền hệ thống)
GRANT SELECT, INSERT, UPDATE, DELETE ON SANBAY TO RoleAdmin;
GRANT SELECT, INSERT, UPDATE, DELETE ON CHUYENBAY TO RoleAdmin;
GRANT SELECT, INSERT, UPDATE, DELETE ON GHE TO RoleAdmin;
GRANT SELECT, INSERT, UPDATE, DELETE ON KHACHHANG TO RoleAdmin;
GRANT SELECT, INSERT, UPDATE, DELETE ON VE TO RoleAdmin;
GRANT SELECT, INSERT, UPDATE, DELETE ON HOADON TO RoleAdmin;
GRANT SELECT, INSERT, UPDATE, DELETE ON NGUOIDUNG TO RoleAdmin;
GRANT SELECT, INSERT, UPDATE, DELETE ON ROLES TO RoleAdmin;

--Viết stored tạo người dùng
CREATE PROCEDURE sp_ThemNguoiDung 
@Username VARCHAR(50), @Password VARCHAR(100), @HoTen NVARCHAR(100), @Email VARCHAR(100),
@SoDT VARCHAR(15), @RoleID INT, @TrangThai NVARCHAR(30)
AS
BEGIN
SET NOCOUNT ON;
IF EXISTS (SELECT 1 FROM NGUOIDUNG WHERE Username=@Username) 
BEGIN 
  RAISERROR (N'Username đã tồn tại',16,1); 
  RETURN; 
END
   INSERT INTO NGUOIDUNG (Username,Password,HoTen,Email,SoDT,RoleID,TrangThai,NgayTao)
   VALUES (@Username,HASHBYTES('SHA2_256',@Password),@HoTen,@Email,@SoDT,@RoleID,@TrangThai,GETDATE());
END;

--Gọi stored thêm người dùng
EXEC sp_ThemNguoiDung 'nv_banve','123456',N'Nguyễn Văn Bán Vé','banve@gmail.com','0901111111',1,N'Hoạt động';
EXEC sp_ThemNguoiDung 'ql_chuyenbay','123456',N'Trần Văn Quản Lý','quanly@gmail.com','0902222222',2,N'Hoạt động';
EXEC sp_ThemNguoiDung 'admin_ht','123456',N'Quản Trị Hệ Thống','admin@gmail.com','0903333333',3,N'Hoạt động';

--Phân người dùng vào các role tương ứng
ALTER ROLE RoleBanVe ADD MEMBER nv_banve;
ALTER ROLE RoleQuanLyChuyenBay ADD MEMBER ql_chuyenbay;
ALTER ROLE RoleAdmin ADD MEMBER admin_ht;

-- Đăng nhập, xác thực tài khoản
CREATE PROCEDURE sp_DangNhap 
@Username VARCHAR(50), 
@Password VARCHAR(100)
AS
BEGIN
SET NOCOUNT ON;
SELECT UserID,Username,HoTen,Email,SoDT,RoleID 
FROM NGUOIDUNG 
WHERE Username=@Username AND Password=HASHBYTES('SHA2_256',@Password) AND TrangThai=N'Hoạt động';
END;
GO

--Backup dữ liệu
BACKUP DATABASE QuanLyChuyenBay
TO DISK = 'D:\Backup\QuanLyChuyenBay.bak'
WITH INIT;

-- Restore dữ liệu
RESTORE DATABASE QuanLyChuyenBay
FROM DISK = 'D:\Backup\QuanLyChuyenBay.bak'
WITH REPLACE;


PRINT N'Tạo database QuanLyChuyenBay hoàn tất.';
GO
