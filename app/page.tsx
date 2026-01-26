"use client";

import { useState } from "react";

interface QueryResult {
  queryIndex: number;
  query: string;
  success: boolean;
  data?: any[];
  rowsAffected?: number;
  isSelectQuery?: boolean;
  error?: string;
}

interface Demo {
  id: string;
  title: string;
  description: string; // B1: Bài toán
  relatedTables: string[]; // B3: Các bảng liên quan
  beforeQuery?: string; // Query để xem dữ liệu trước
  mainQuery: string; // B2: Câu truy vấn SQL chính
  afterQuery?: string; // B5: Query để xem dữ liệu sau
}

export default function Home() {
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);
  const [beforeData, setBeforeData] = useState<any[] | null>(null);
  const [queryResults, setQueryResults] = useState<QueryResult[] | null>(null);
  const [afterData, setAfterData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"demos" | "custom">("demos");

  const demos: Demo[] = [
    {
      id: "function-tinhtongtien",
      title: "Function: Tính tổng tiền vé",
      description: `Bài toán: Xây dựng Function để tính tổng tiền vé (giá vé + thuế).
      
Mục đích: Tạo một function có thể tái sử dụng để tính toán tổng tiền, đảm bảo logic tính toán nhất quán trong toàn hệ thống.`,
      relatedTables: ["VE"],
      beforeQuery: `SELECT MaVe, GiaVe, Thue, TongTien 
FROM VE 
WHERE MaVe = 'V001';`,
      mainQuery: `-- Sử dụng Function fn_TinhTongTien
SELECT 
    MaVe,
    GiaVe,
    Thue,
    dbo.fn_TinhTongTien(GiaVe, Thue) AS TongTienTinhBangFunction,
    TongTien AS TongTienTrongDB,
    CASE 
        WHEN dbo.fn_TinhTongTien(GiaVe, Thue) = TongTien THEN N'Khớp'
        ELSE N'Không khớp'
    END AS KetQua
FROM VE
WHERE MaVe = 'V001';`,
      afterQuery: `SELECT MaVe, GiaVe, Thue, TongTien 
FROM VE 
WHERE MaVe = 'V001';`,
    },
    {
      id: "function-kiemtraghedadat",
      title: "Function: Kiểm tra ghế đã đặt",
      description: `Bài toán: Xây dựng Function để kiểm tra xem một ghế đã được đặt cho chuyến bay chưa.
      
Mục đích: Tạo function tiện ích để kiểm tra trạng thái ghế, hỗ trợ quy trình đặt vé.`,
      relatedTables: ["VE", "GHE"],
      beforeQuery: `SELECT G.MaGhe, G.SoGhe, G.LoaiGhe, 
    CASE WHEN V.MaVe IS NULL THEN N'Trống' ELSE N'Đã đặt' END AS TrangThai
FROM GHE G
LEFT JOIN VE V ON G.MaGhe = V.MaGhe AND V.MaChuyenBay = 'CB001'
WHERE G.MaMayBay = (SELECT MaMayBay FROM CHUYENBAY WHERE MaChuyenBay = 'CB001');`,
      mainQuery: `-- Sử dụng Function fn_KiemTraGheDaDat
SELECT 
    G.MaGhe,
    G.SoGhe,
    G.LoaiGhe,
    dbo.fn_KiemTraGheDaDat(G.MaGhe, 'CB001') AS GheDaDat,
    CASE 
        WHEN dbo.fn_KiemTraGheDaDat(G.MaGhe, 'CB001') = 1 THEN N'Đã đặt'
        ELSE N'Trống'
    END AS TrangThai
FROM GHE G
WHERE G.MaMayBay = (SELECT MaMayBay FROM CHUYENBAY WHERE MaChuyenBay = 'CB001');`,
      afterQuery: `SELECT G.MaGhe, G.SoGhe, G.LoaiGhe, 
    CASE WHEN V.MaVe IS NULL THEN N'Trống' ELSE N'Đã đặt' END AS TrangThai
FROM GHE G
LEFT JOIN VE V ON G.MaGhe = V.MaGhe AND V.MaChuyenBay = 'CB001'
WHERE G.MaMayBay = (SELECT MaMayBay FROM CHUYENBAY WHERE MaChuyenBay = 'CB001');`,
    },
    {
      id: "procedure-datve",
      title: "Procedure: Đặt vé máy bay",
      description: `Bài toán: Xây dựng Stored Procedure để đặt vé máy bay tự động tính giá vé, thuế và tạo mã vé.
      
Mục đích: Tự động hóa quy trình đặt vé, đảm bảo tính toán chính xác và nhất quán.`,
      relatedTables: ["VE", "CHUYENBAY", "TUYENBAY", "MAYBAY"],
      beforeQuery: `SELECT 
    CB.MaChuyenBay,
    COUNT(V.MaVe) AS SoVeDaDat,
    TB.GiaVeCoBan,
    TB.ThoiGianTrungBinh
FROM CHUYENBAY CB
LEFT JOIN VE V ON CB.MaChuyenBay = V.MaChuyenBay
LEFT JOIN TUYENBAY TB ON CB.MaTuyenBay = TB.MaTuyenBay
WHERE CB.MaChuyenBay = 'CB001'
GROUP BY CB.MaChuyenBay, TB.GiaVeCoBan, TB.ThoiGianTrungBinh;`,
      mainQuery: `-- Tạo hành khách mới (nếu chưa có)
INSERT INTO HANHKHACH (MaHK, FullName, HoChieuCCCD, GioiTinh, NgaySinh, QuocTich, SoDT, Email)
SELECT 'HK007', N'Lê Văn Bình', 'B87654321', N'Nam', '1992-08-20', N'Việt Nam', '0987654321', 'binh.lv@email.com'
WHERE NOT EXISTS (SELECT 1 FROM HANHKHACH WHERE MaHK = 'HK007');

-- Sử dụng Procedure DatVe để đặt vé
EXEC DatVe 
    @MaHK = 'HK007',
    @MaChuyenBay = 'CB001',
    @MaGhe = 'G-VN10',
    @HinhThucThanhToan = N'Thẻ tín dụng';`,
      afterQuery: `-- Xem vé vừa đặt (lấy vé mới nhất)
SELECT TOP 1
    V.MaVe,
    V.MaChuyenBay,
    HK.FullName AS TenHanhKhach,
    G.SoGhe,
    V.GiaVe,
    V.Thue,
    V.TongTien,
    V.TrangThai,
    V.HinhThucThanhToan
FROM VE V
JOIN HANHKHACH HK ON V.MaHK = HK.MaHK
JOIN GHE G ON V.MaGhe = G.MaGhe
WHERE V.MaChuyenBay = 'CB001' AND V.MaHK = 'HK007'
ORDER BY V.MaVe DESC;`,
    },
    {
      id: "procedure-thanhtoanve-trigger",
      title: "Procedure: Thanh toán vé (kèm Trigger)",
      description: `Bài toán: Xây dựng Procedure thanh toán vé và Trigger tự động cập nhật trạng thái vé khi có thanh toán.
      
Mục đích: Đảm bảo trạng thái vé được cập nhật tự động khi thanh toán thành công, không cần can thiệp thủ công.`,
      relatedTables: ["VE", "THANHTOAN"],
      beforeQuery: `SELECT V.MaVe, V.TrangThai AS TrangThaiVe, 
    COUNT(TT.MaThanhToan) AS SoLanThanhToan
FROM VE V
LEFT JOIN THANHTOAN TT ON V.MaVe = TT.MaVe
WHERE V.MaVe = 'V003'
GROUP BY V.MaVe, V.TrangThai;`,
      mainQuery: `-- Sử dụng Procedure ThanhToanVe
-- Trigger trg_ThanhToan_UpdateTrangThaiVe sẽ tự động cập nhật trạng thái vé
EXEC ThanhToanVe 
    @MaVe = 'V003',
    @PhuongThuc = N'Visa Card',
    @SoTien = 1320000;`,
      afterQuery: `-- Xem kết quả sau khi thanh toán (Trigger đã tự động cập nhật)
SELECT V.MaVe, V.TrangThai AS TrangThaiVe, 
    TT.MaThanhToan,
    TT.PhuongThuc,
    TT.SoTien,
    TT.TrangThai AS TrangThaiThanhToan
FROM VE V
LEFT JOIN THANHTOAN TT ON V.MaVe = TT.MaVe
WHERE V.MaVe = 'V003'
ORDER BY TT.NgayThanhToan DESC;`,
    },
    {
      id: "procedure-themhanhly-trigger",
      title: "Procedure: Thêm hành lý (kèm Trigger)",
      description: `Bài toán: Xây dựng Procedure thêm hành lý và Trigger tự động tính phí hành lý.
      
Mục đích: Tự động tính phí hành lý dựa trên trọng lượng và số lượng, đảm bảo tính nhất quán.`,
      relatedTables: ["HANHLY", "VE"],
      beforeQuery: `SELECT V.MaVe, 
    COUNT(HL.MaHanhLy) AS SoHanhLy,
    SUM(HL.PhiHL + HL.PhiQC) AS TongPhiHanhLy
FROM VE V
LEFT JOIN HANHLY HL ON V.MaVe = HL.MaVe
WHERE V.MaVe = 'V001'
GROUP BY V.MaVe;`,
      mainQuery: `-- Sử dụng Procedure ThemHanhLy
-- Trigger trg_TinhPhiHanhLy sẽ tự động tính phí
EXEC ThemHanhLy 
    @MaVe = 'V001',
    @TrongLuong = 25.5,
    @SoHL = 2;`,
      afterQuery: `-- Xem hành lý sau khi thêm (Trigger đã tự động tính phí)
SELECT HL.MaHanhLy,
    HL.MaVe,
    HL.TrongLuong,
    HL.SoHL,
    HL.PhiHL,
    HL.PhiQC,
    HL.PhiHL + HL.PhiQC AS TongPhi
FROM HANHLY HL
WHERE HL.MaVe = 'V001'
ORDER BY HL.MaHanhLy DESC;`,
    },
    {
      id: "procedure-doanhthuchuyenbay",
      title: "Procedure: Thống kê doanh thu chuyến bay",
      description: `Bài toán: Xây dựng Procedure để thống kê doanh thu của một chuyến bay cụ thể.
      
Mục đích: Cung cấp báo cáo doanh thu nhanh chóng cho từng chuyến bay, hỗ trợ phân tích kinh doanh.`,
      relatedTables: ["CHUYENBAY", "VE"],
      beforeQuery: `SELECT CB.MaChuyenBay,
    COUNT(V.MaVe) AS TongSoVe,
    SUM(CASE WHEN V.TrangThai = N'Đã thanh toán' THEN V.TongTien ELSE 0 END) AS DoanhThu
FROM CHUYENBAY CB
LEFT JOIN VE V ON CB.MaChuyenBay = V.MaChuyenBay
WHERE CB.MaChuyenBay = 'CB001'
GROUP BY CB.MaChuyenBay;`,
      mainQuery: `-- Sử dụng Procedure DoanhThuChuyenBay
EXEC DoanhThuChuyenBay @MaChuyenBay = 'CB001';`,
      afterQuery: `SELECT CB.MaChuyenBay,
    COUNT(V.MaVe) AS TongSoVe,
    SUM(CASE WHEN V.TrangThai = N'Đã thanh toán' THEN V.TongTien ELSE 0 END) AS DoanhThu
FROM CHUYENBAY CB
LEFT JOIN VE V ON CB.MaChuyenBay = V.MaChuyenBay
WHERE CB.MaChuyenBay = 'CB001'
GROUP BY CB.MaChuyenBay;`,
    },
    {
      id: "procedure-danhsachhanhkhach",
      title: "Procedure: Danh sách hành khách theo chuyến bay",
      description: `Bài toán: Xây dựng Procedure để lấy danh sách hành khách của một chuyến bay.
      
Mục đích: Cung cấp thông tin hành khách nhanh chóng cho nhân viên mặt đất và phi hành đoàn.`,
      relatedTables: ["HANHKHACH", "VE", "CHUYENBAY"],
      beforeQuery: `SELECT COUNT(*) AS TongHanhKhach
FROM VE V
WHERE V.MaChuyenBay = 'CB001';`,
      mainQuery: `-- Sử dụng Procedure DanhSachHanhKhach
EXEC DanhSachHanhKhach @MaChuyenBay = 'CB001';`,
      afterQuery: `SELECT COUNT(*) AS TongHanhKhach
FROM VE V
WHERE V.MaChuyenBay = 'CB001';`,
    },
    {
      id: "trigger-thanhtoan",
      title: "Trigger: Tự động cập nhật trạng thái vé khi thanh toán",
      description: `Bài toán: Xây dựng Trigger tự động cập nhật trạng thái vé thành "Đã thanh toán" khi có bản ghi thanh toán mới.
      
Mục đích: Đảm bảo trạng thái vé luôn được cập nhật tự động khi thanh toán, không cần can thiệp thủ công.`,
      relatedTables: ["VE", "THANHTOAN"],
      beforeQuery: `SELECT V.MaVe, V.TrangThai AS TrangThaiVe
FROM VE V
WHERE V.MaVe = 'V006';`,
      mainQuery: `-- Thêm bản ghi thanh toán (Trigger sẽ tự động cập nhật trạng thái vé)
DECLARE @MaThanhToan VARCHAR(10) = CONCAT('TT', FORMAT(GETDATE(), 'yyyyMMddHHmmss'));
INSERT INTO THANHTOAN (MaThanhToan, MaVe, PhuongThuc, NgayThanhToan, SoTien, TrangThai)
VALUES (@MaThanhToan, 'V006', N'Momo', GETDATE(), 660000, N'Thành công');`,
      afterQuery: `-- Xem trạng thái vé sau khi trigger chạy
SELECT V.MaVe, V.TrangThai AS TrangThaiVe,
    TT.MaThanhToan,
    TT.PhuongThuc,
    TT.SoTien
FROM VE V
LEFT JOIN THANHTOAN TT ON V.MaVe = TT.MaVe
WHERE V.MaVe = 'V006'
ORDER BY TT.NgayThanhToan DESC;`,
    },
    {
      id: "trigger-tinhphihanhly",
      title: "Trigger: Tự động tính phí hành lý",
      description: `Bài toán: Xây dựng Trigger tự động tính phí hành lý (PhiHL và PhiQC) khi thêm hành lý mới.
      
Mục đích: Đảm bảo phí hành lý luôn được tính tự động và nhất quán: PhiHL = TrongLuong * 50000, PhiQC = SoHL * 100000.`,
      relatedTables: ["HANHLY"],
      beforeQuery: `SELECT COUNT(*) AS SoHanhLyHienTai
FROM HANHLY
WHERE MaVe = 'V002';`,
      mainQuery: `-- Thêm hành lý mới (Trigger sẽ tự động tính phí)
-- Lưu ý: Procedure ThemHanhLy cũng sử dụng trigger này
INSERT INTO HANHLY (MaHanhLy, MaVe, TrongLuong, SoHL, PhiHL, PhiQC)
VALUES ('HL-TEST', 'V002', 35.0, 2, 0, 0);
-- Trigger trg_TinhPhiHanhLy sẽ tự động cập nhật PhiHL = 35.0 * 50000 = 1750000
-- và PhiQC = 2 * 100000 = 200000`,
      afterQuery: `-- Xem hành lý sau khi trigger tính phí
SELECT HL.MaHanhLy,
    HL.MaVe,
    HL.TrongLuong,
    HL.SoHL,
    HL.PhiHL,
    HL.PhiQC,
    HL.PhiHL + HL.PhiQC AS TongPhi,
    CASE 
        WHEN HL.PhiHL = HL.TrongLuong * 50000 AND HL.PhiQC = HL.SoHL * 100000 
        THEN N'Đúng'
        ELSE N'Sai'
    END AS KiemTraTinhToan
FROM HANHLY HL
WHERE HL.MaVe = 'V002'
ORDER BY HL.MaHanhLy DESC;`,
    },
  ];

  const resetDataQuery = `-- Xóa dữ liệu cũ (Theo thứ tự an toàn)
TRUNCATE TABLE CHECKIN; TRUNCATE TABLE THANHTOAN; TRUNCATE TABLE HANHLY;
DELETE FROM VE; DELETE FROM PHANCONG; DELETE FROM NHANVIEN;
DELETE FROM LICHBAY; DELETE FROM CHUYENBAY; DELETE FROM GHE;
DELETE FROM TUYENBAY; DELETE FROM MAYBAY; DELETE FROM SANBAY;
DELETE FROM HANHKHACH; DELETE FROM NGUOIDUNG; DELETE FROM ROLES; DELETE FROM HANGHANGKHONG;

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
('CB001', 'HANSGN', 'VN-A321', '2024-05-10', '07:00', '09:05', 'Gate 01', N'Đúng giờ'),
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

-- 11. HANHLY
INSERT INTO HANHLY VALUES 
('HL001', 'V001', 30.0, 2, 0, 0),
('HL002', 'V002', 20.0, 1, 0, 0),
('HL003', 'V003', 45.0, 3, 600000, 200000),
('HL004', 'V004', 15.0, 1, 0, 0);

-- 12. NHANVIEN & PHANCONG
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
(2, 'an_tran', 'an123', N'Trần Văn An', 'an.tv@gmail.com', '0901112223', 3, N'Hoạt động', '2024-01-15');`;

  const executeQuery = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.success) {
        return data.results || [];
      } else {
        throw new Error(data.error || "An error occurred");
      }
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = async (demo: Demo) => {
    setSelectedDemo(demo);
    setBeforeData(null);
    setQueryResults(null);
    setAfterData(null);
    setError(null);

    // B3: Load dữ liệu trước khi thực thi
    if (demo.beforeQuery) {
      try {
        const results = await executeQuery(demo.beforeQuery);
        if (results.length > 0 && results[0].isSelectQuery && results[0].data) {
          setBeforeData(results[0].data);
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const runDemo = async () => {
    if (!selectedDemo) return;

    setError(null);
    setQueryResults(null);
    setAfterData(null);

    try {
      // B4: Thực thi câu lệnh chính
      const results = await executeQuery(selectedDemo.mainQuery);
      setQueryResults(results);

      // B5: Load dữ liệu sau khi thực thi
      if (selectedDemo.afterQuery) {
        const afterResults = await executeQuery(selectedDemo.afterQuery);
        if (afterResults.length > 0) {
          // Lấy tất cả dữ liệu từ các query SELECT
          const allData: any[] = [];
          afterResults.forEach((result: QueryResult) => {
            if (result.isSelectQuery && result.data) {
              allData.push(...result.data);
            }
          });
          if (allData.length > 0) {
            setAfterData(allData);
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const executeCustomQuery = async (query: string) => {
    if (!query.trim()) {
      setError("Please enter a query");
      return;
    }

    setError(null);
    setQueryResults(null);

    try {
      const results = await executeQuery(query);
      setQueryResults(results);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const DataTable = ({ data, title }: { data: any[]; title: string }) => {
    if (!data || data.length === 0) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value: any, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {value !== null && value !== undefined
                        ? String(value)
                        : "NULL"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Demo SQL Server
        </h1>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-300">
            <button
              onClick={() => setActiveTab("demos")}
              className={`px-4 py-2 font-medium ${
                activeTab === "demos"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Demos (B1-B5)
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`px-4 py-2 font-medium ${
                activeTab === "custom"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Custom Query
            </button>
          </div>
        </div>

        {activeTab === "demos" ? (
          <div className="space-y-6">
            {/* Demo Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Chọn Demo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {demos.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => loadDemo(demo)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      selectedDemo?.id === demo.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {demo.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {demo.description.split("\n")[0]}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Demo Details */}
            {selectedDemo && (
              <div className="space-y-6">
                {/* B1: Bài toán */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    B1: Bài toán
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line text-gray-700">
                    {selectedDemo.description}
                  </div>
                </div>

                {/* B2: Câu truy vấn SQL */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    B2: Câu truy vấn SQL
                  </h2>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {selectedDemo.mainQuery}
                    </pre>
                  </div>
                </div>

                {/* B3: Bảng dữ liệu trước khi thực thi */}
                {selectedDemo.relatedTables.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      B3: Các bảng dữ liệu liên quan
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Bảng sẽ bị thay đổi:{" "}
                      {selectedDemo.relatedTables.join(", ")}
                    </p>
                    {beforeData && (
                      <DataTable
                        data={beforeData}
                        title="Dữ liệu trước khi thực thi"
                      />
                    )}
                    {!beforeData && selectedDemo.beforeQuery && (
                      <p className="text-gray-500 italic">
                        Click "Load Demo" để xem dữ liệu trước
                      </p>
                    )}
                  </div>
                )}

                {/* B4: Nút thực thi */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    B4: Thực thi câu lệnh
                  </h2>
                  <button
                    onClick={runDemo}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {loading ? "Đang thực thi..." : "Thực thi câu lệnh"}
                  </button>
                </div>

                {/* Results */}
                {queryResults && queryResults.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Kết quả thực thi
                    </h2>
                    <div className="space-y-4">
                      {queryResults.map((result, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-blue-500 pl-4"
                        >
                          {result.success ? (
                            <div>
                              {result.isSelectQuery && result.data && (
                                <DataTable
                                  data={result.data}
                                  title={`Query ${result.queryIndex}`}
                                />
                              )}
                              {!result.isSelectQuery && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                                  <strong>Thành công!</strong>{" "}
                                  {result.rowsAffected || 0} dòng bị ảnh hưởng.
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                              <strong>Lỗi:</strong> {result.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* B5: Bảng dữ liệu sau khi thực thi */}
                {afterData && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      B5: Dữ liệu sau khi thực thi
                    </h2>
                    <DataTable
                      data={afterData}
                      title="Kết quả sau khi thực thi"
                    />
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Custom Query Tab */
          <CustomQueryTab
            resetDataQuery={resetDataQuery}
            executeQuery={executeCustomQuery}
            queryResults={queryResults}
            loading={loading}
            error={error}
            setError={setError}
          />
        )}
      </div>
    </main>
  );
}

function CustomQueryTab({
  resetDataQuery,
  executeQuery,
  queryResults,
  loading,
  error,
  setError,
}: {
  resetDataQuery: string;
  executeQuery: (query: string) => Promise<void>;
  queryResults: QueryResult[] | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}) {
  const [query, setQuery] = useState("");

  const loadResetData = () => {
    setQuery(resetDataQuery);
    setError(null);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <label
            htmlFor="query"
            className="block text-sm font-medium text-gray-700"
          >
            Enter SQL Query:
          </label>
          <button
            onClick={loadResetData}
            className="px-4 py-2 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors font-medium"
          >
            Reset & Seed Data
          </button>
        </div>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập câu lệnh SQL..."
          className="w-full h-[400px] p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={() => executeQuery(query)}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Executing..." : "Execute Query"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {queryResults && queryResults.length > 0 && (
        <div className="space-y-6">
          {queryResults.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Query {result.queryIndex}
                  </h2>
                  {result.success ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      Success
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                      Failed
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded">
                  {result.query}
                </p>
              </div>

              {!result.success && result.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                  <strong>Error:</strong> {result.error}
                </div>
              )}

              {result.success &&
                result.rowsAffected !== undefined &&
                !result.isSelectQuery && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                    <strong>Success!</strong> {result.rowsAffected} row(s)
                    affected.
                  </div>
                )}

              {result.success &&
                result.isSelectQuery &&
                result.data &&
                result.data.length > 0 && (
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-3">
                      Results ({result.data.length} row
                      {result.data.length !== 1 ? "s" : ""})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(result.data[0]).map((key) => (
                              <th
                                key={key}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {result.data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.values(row).map(
                                (value: any, cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                  >
                                    {value !== null && value !== undefined
                                      ? String(value)
                                      : "NULL"}
                                  </td>
                                )
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {result.success &&
                result.isSelectQuery &&
                result.data &&
                result.data.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
                    Query executed successfully, but no rows were returned.
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
