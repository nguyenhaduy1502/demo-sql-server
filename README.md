# SQL Server Query Tool

A simple Next.js application to execute SQL queries against a local SQL Server database.

## Features

- Connect to SQL Server using environment-based configuration
- Execute SQL queries via a textarea input
- Display query results in a formatted table
- Support for multiple queries (separated by semicolons)
- Built with Next.js 14, TypeScript, and Tailwind CSS

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   - Copy `.env.example` to `.env.local`:

   - Edit `.env.local` and fill in your SQL Server connection details:
     ```
     DB_SERVER=your-server-name
     DB_DATABASE=QuanLyChuyenBay
     DB_USER=your-username
     DB_PASSWORD=your-password
     DB_ENCRYPT=true
     DB_TRUST_SERVER_CERTIFICATE=true
     ```

   **Notes:**

   - `DB_SERVER`: Your SQL Server instance name (e.g., `localhost`, `localhost\\SQLEXPRESS`, or a named instance)
   - `DB_DATABASE`: Database name (default: `QuanLyChuyenBay`)
   - `DB_USER` and `DB_PASSWORD`: Leave empty for Windows Authentication, or provide SQL Server credentials
   - `DB_ENCRYPT`: Set to `true` for encrypted connections, `false` otherwise
   - `DB_TRUST_SERVER_CERTIFICATE`: Set to `true` to trust server certificate (useful for local development)

3. **Create the database:**

   - Open SQL Server Management Studio
   - Connect to your SQL Server instance
   - Run the SQL script provided below to create `QuanLyChuyenBay` database with sample data

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## SQL Script to Create Database

Run this in SQL Server Management Studio to create the `QuanLyChuyenBay` (Flight Management) database:

```sql
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

CREATE TABLE VE (
    MaVe VARCHAR(10) PRIMARY KEY,
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
    MaHanhLy VARCHAR(10) PRIMARY KEY,
    MaVe VARCHAR(10),
    TrongLuong FLOAT,
    SoHL INT,
    PhiHL DECIMAL(12,2),
    PhiQC DECIMAL(12,2),
    FOREIGN KEY (MaVe) REFERENCES VE(MaVe)
);

CREATE TABLE THANHTOAN (
    MaThanhToan VARCHAR(10) PRIMARY KEY,
    MaVe VARCHAR(10),
    PhuongThuc NVARCHAR(30),
    NgayThanhToan DATE,
    SoTien DECIMAL(12,2),
    TrangThai NVARCHAR(30),
    FOREIGN KEY (MaVe) REFERENCES VE(MaVe)
);

CREATE TABLE CHECKIN (
    MaCheckIn VARCHAR(10) PRIMARY KEY,
    MaVe VARCHAR(10),
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

-- Insert sample data
-- Xóa dữ liệu cũ (Theo thứ tự an toàn)
TRUNCATE TABLE CHECKIN; TRUNCATE TABLE THANHTOAN; TRUNCATE TABLE HANHLY;
DELETE FROM VE; DELETE FROM PHANCONG; DELETE FROM NHANVIEN;
DELETE FROM LICHBAY; DELETE FROM CHUYENBAY; DELETE FROM GHE;
DELETE FROM TUYENBAY; DELETE FROM MAYBAY; DELETE FROM SANBAY;
DELETE FROM NGUOIDUNG; DELETE FROM ROLES; DELETE FROM HANGHANGKHONG;

-- 1. HANGHANGKHONG (Hãng hàng không)
INSERT INTO HANGHANGKHONG VALUES
('VNA', N'Vietnam Airlines', N'Việt Nam', 1956, N'Hà Nội'),
('VJC', N'Vietjet Air', N'Việt Nam', 2007, N'TP.HCM'),
('BAV', N'Bamboo Airways', N'Việt Nam', 2017, N'Hà Nội'),
('VTR', N'Vietravel Airlines', N'Việt Nam', 2019, N'Thừa Thiên Huế');

-- 2. SANBAY (Sân bay đa dạng vùng miền)
INSERT INTO SANBAY VALUES
('HAN', N'Sân bay Nội Bài', N'Hà Nội', N'Việt Nam', N'Hoạt động'),
('SGN', N'Sân bay Tân Sơn Nhất', N'TP.HCM', N'Việt Nam', N'Hoạt động'),
('DAD', N'Sân bay Đà Nẵng', N'Đà Nẵng', N'Việt Nam', N'Hoạt động'),
('CXR', N'Sân bay Cam Ranh', N'Khánh Hòa', N'Việt Nam', N'Hoạt động'),
('PQC', N'Sân bay Phú Quốc', N'Kiên Giang', N'Việt Nam', N'Hoạt động'),
('HUI', N'Sân bay Phú Bài', N'Huế', N'Việt Nam', N'Hoạt động'),
('VCA', N'Sân bay Cần Thơ', N'Cần Thơ', N'Việt Nam', N'Hoạt động');

-- 3. MAYBAY (Đầy đủ các trạng thái)
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

-- 5. CHUYENBAY (Đầy đủ các trạng thái: Đã hạ cánh, Đúng giờ, Bị hoãn, Hủy chuyến)
INSERT INTO CHUYENBAY VALUES
('CB001', 'HANSGN', 'VN-A321', '2024-05-10', '07:00', '09:05', 'Gate 01', N'Đã hạ cánh'),
('CB002', 'HANSGN', 'VN-A350', '2024-05-10', '10:00', '12:05', 'Gate 02', N'Đã hạ cánh'),
('CB003', 'SGNHAN', 'VJ-A321', '2024-05-15', '13:00', '15:05', 'Gate 05', N'Đúng giờ'),
('CB004', 'SGNDAD', 'QH-B787', '2024-05-15', '14:00', '15:20', 'Gate 08', N'Bị hoãn'),
('CB005', 'HANPQC', 'VU-A321', '2024-05-16', '08:00', '10:15', 'Gate 03', N'Hủy chuyến'),
('CB006', 'SGNVCA', 'VJ-A320', '2024-05-15', '18:00', '18:45', 'Gate 01', N'Đúng giờ');

-- 6. GHE (Tạo danh mục ghế mẫu)
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

-- 8. VE (Trạng thái thanh toán và Check-in đa dạng)
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

-- 11. HANHLY
INSERT INTO HANHLY VALUES
('HL001', 'V001', 30.0, 2, 0, 0),
('HL002', 'V002', 20.0, 1, 0, 0),
('HL003', 'V003', 45.0, 3, 600000, 200000),
('HL004', 'V004', 15.0, 1, 0, 0);

-- 12. NHANVIEN & PHANCONG (Nhân sự cho các chuyến bay)
INSERT INTO NHANVIEN VALUES
('NV01', 'VNA', N'Phan Thanh Tùng', N'Cơ trưởng', N'ATPL', 20, N'Phi công'),
('NV02', 'VNA', N'Nguyễn Cẩm Tú', N'Tiếp viên trưởng', N'Safety Cert', 10, N'Tiếp viên'),
('NV03', 'VJC', N'Ricardo', N'Cơ phó', N'CPL', 7, N'Phi công');

INSERT INTO PHANCONG VALUES
('PC001', 'VNA', 'CB001', 'HANSGN', 'VN-A321', 'NV01', N'Cơ trưởng', '06:00', '10:00'),
('PC002', 'VNA', 'CB001', 'HANSGN', 'VN-A321', 'NV02', N'Tiếp viên trưởng', '06:00', '10:00'),
('PC003', 'VJC', 'CB003', 'SGNHAN', 'VJ-A321', 'NV03', N'Cơ phó', '12:00', '16:00');

-- 13. ROLES & NGUOIDUNG
INSERT INTO ROLES VALUES
(1, N'Admin', N'Quản trị toàn hệ thống'),
(2, N'Hỗ trợ', N'Nhân viên mặt đất/phòng vé'),
(3, N'Khách hàng', N'Tài khoản thành viên');

INSERT INTO NGUOIDUNG VALUES
(1, 'admin_super', 'root123', N'Vương Quản Trị', 'admin@airport.gov.vn', '0900000000', 1, N'Hoạt động', '2023-01-01'),
(2, 'an_tran', 'an123', N'Trần Văn An', 'an.tv@gmail.com', '0901112223', 3, N'Hoạt động', '2024-01-15');
GO
```

## Test Queries

Try these queries in the app to explore the database:

**Basic queries:**

- `SELECT * FROM HANGHANGKHONG;`
- `SELECT * FROM CHUYENBAY WHERE TrangThai = N'Đúng giờ';`
- `SELECT * FROM HANHKHACH;`

**Join queries:**

- `SELECT CB.MaChuyenBay, TB.SanBayDi, TB.SanBayDen, CB.NgayBay, CB.TrangThai FROM CHUYENBAY CB JOIN TUYENBAY TB ON CB.MaTuyenBay = TB.MaTuyenBay;`
- `SELECT V.MaVe, HK.FullName, CB.MaChuyenBay, V.TongTien, V.TrangThai FROM VE V JOIN HANHKHACH HK ON V.MaHK = HK.MaHK JOIN CHUYENBAY CB ON V.MaChuyenBay = CB.MaChuyenBay;`

**Aggregate queries:**

- `SELECT MaHang, COUNT(*) as SoChuyenBay FROM CHUYENBAY GROUP BY MaHang;`
- `SELECT TrangThai, COUNT(*) as SoVe FROM VE GROUP BY TrangThai;`
- `SELECT AVG(TongTien) as GiaVeTrungBinh FROM VE WHERE TrangThai = N'Đã thanh toán';`

## Configuration

The database connection is configured via environment variables in the `.env.local` file. The application supports both:

- **SQL Server Authentication**: Provide `DB_USER` and `DB_PASSWORD` in `.env.local`
- **Windows Authentication**: Leave `DB_USER` and `DB_PASSWORD` empty (or omit them)

**Environment Variables:**

- `DB_SERVER`: SQL Server instance name (required)
- `DB_DATABASE`: Database name (default: `QuanLyChuyenBay`)
- `DB_USER`: SQL Server username (optional, for SQL Authentication)
- `DB_PASSWORD`: SQL Server password (optional, for SQL Authentication)
- `DB_ENCRYPT`: Enable encryption (`true`/`false`)
- `DB_TRUST_SERVER_CERTIFICATE`: Trust server certificate (`true`/`false`, useful for local development)

## Notes

- Make sure your `.env.local` file is properly configured before starting the application
- The `.env.local` file should not be committed to version control (it's in `.gitignore`)
- No security measures are implemented (for local demo/learning purposes only)
- The app connects to SQL Server on each query execution
- You can execute multiple queries at once by separating them with semicolons
