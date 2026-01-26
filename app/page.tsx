'use client';

import { useState } from 'react';

interface QueryResult {
  queryIndex: number;
  query: string;
  success: boolean;
  data?: any[];
  rowsAffected?: number;
  isSelectQuery?: boolean;
  error?: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState<QueryResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookingDemo = `-- BƯỚC 1: Xem trạng thái TRƯỚC KHI đặt vé (ghế trống và chuyến bay)
SELECT 
    CB.MaChuyenBay,
    CB.NgayBay,
    CB.GioCatCanh,
    CB.GioHaCanh,
    CB.TrangThai AS TrangThaiChuyenBay,
    COUNT(G.MaGhe) AS TongGhe,
    COUNT(CASE WHEN V.MaVe IS NULL THEN 1 END) AS GheTrong,
    COUNT(V.MaVe) AS GheDaDat
FROM CHUYENBAY CB
LEFT JOIN MAYBAY MB ON CB.MaMayBay = MB.MaMayBay
LEFT JOIN GHE G ON MB.MaMayBay = G.MaMayBay
LEFT JOIN VE V ON G.MaGhe = V.MaGhe AND CB.MaChuyenBay = V.MaChuyenBay
WHERE CB.MaChuyenBay = 'CB001'
GROUP BY CB.MaChuyenBay, CB.NgayBay, CB.GioCatCanh, CB.GioHaCanh, CB.TrangThai;

-- BƯỚC 2: Xem danh sách ghế trống của chuyến bay
SELECT 
    G.MaGhe,
    G.SoGhe,
    G.LoaiGhe,
    CASE WHEN V.MaVe IS NULL THEN N'Trống' ELSE N'Đã đặt' END AS TrangThai
FROM CHUYENBAY CB
JOIN MAYBAY MB ON CB.MaMayBay = MB.MaMayBay
JOIN GHE G ON MB.MaMayBay = G.MaMayBay
LEFT JOIN VE V ON G.MaGhe = V.MaGhe AND CB.MaChuyenBay = V.MaChuyenBay
WHERE CB.MaChuyenBay = 'CB001' AND V.MaVe IS NULL;

-- BƯỚC 3: Tạo hành khách mới (nếu chưa có)
INSERT INTO HANHKHACH (MaHK, FullName, HoChieuCCCD, GioiTinh, NgaySinh, QuocTich, SoDT, Email)
SELECT 'HK001', N'Nguyễn Văn An', 'A12345678', N'Nam', '1990-05-15', N'Việt Nam', '0912345678', 'nguyenvanan@email.com'
WHERE NOT EXISTS (SELECT 1 FROM HANHKHACH WHERE MaHK = 'HK001');

-- BƯỚC 4: Đặt vé (book seat)
INSERT INTO VE (MaVe, MaChuyenBay, MaHang, MaHK, MaGhe, NgayBay, ThoiGianBay, GiaVe, Thue, TongTien, HinhThucThanhToan, TrangThai, CheckInTrangThai)
SELECT 
    'VE001' AS MaVe,
    'CB001' AS MaChuyenBay,
    (SELECT MaHang FROM CHUYENBAY CB JOIN MAYBAY MB ON CB.MaMayBay = MB.MaMayBay WHERE CB.MaChuyenBay = 'CB001') AS MaHang,
    'HK001' AS MaHK,
    (SELECT TOP 1 G.MaGhe FROM CHUYENBAY CB JOIN MAYBAY MB ON CB.MaMayBay = MB.MaMayBay JOIN GHE G ON MB.MaMayBay = G.MaMayBay LEFT JOIN VE V ON G.MaGhe = V.MaGhe AND CB.MaChuyenBay = V.MaChuyenBay WHERE CB.MaChuyenBay = 'CB001' AND V.MaVe IS NULL) AS MaGhe,
    (SELECT NgayBay FROM CHUYENBAY WHERE MaChuyenBay = 'CB001') AS NgayBay,
    120 AS ThoiGianBay,
    1500000.00 AS GiaVe,
    150000.00 AS Thue,
    1650000.00 AS TongTien,
    N'Thẻ tín dụng' AS HinhThucThanhToan,
    N'Đã thanh toán' AS TrangThai,
    N'Chưa check-in' AS CheckInTrangThai
WHERE NOT EXISTS (SELECT 1 FROM VE WHERE MaVe = 'VE001');

-- BƯỚC 5: Xem trạng thái SAU KHI đặt vé
SELECT 
    CB.MaChuyenBay,
    CB.NgayBay,
    CB.GioCatCanh,
    CB.GioHaCanh,
    CB.TrangThai AS TrangThaiChuyenBay,
    COUNT(G.MaGhe) AS TongGhe,
    COUNT(CASE WHEN V.MaVe IS NULL THEN 1 END) AS GheTrong,
    COUNT(V.MaVe) AS GheDaDat
FROM CHUYENBAY CB
LEFT JOIN MAYBAY MB ON CB.MaMayBay = MB.MaMayBay
LEFT JOIN GHE G ON MB.MaMayBay = G.MaMayBay
LEFT JOIN VE V ON G.MaGhe = V.MaGhe AND CB.MaChuyenBay = V.MaChuyenBay
WHERE CB.MaChuyenBay = 'CB001'
GROUP BY CB.MaChuyenBay, CB.NgayBay, CB.GioCatCanh, CB.GioHaCanh, CB.TrangThai;

-- BƯỚC 6: Xem vé vừa đặt
SELECT 
    V.MaVe,
    V.MaChuyenBay,
    HK.FullName AS TenHanhKhach,
    G.SoGhe,
    G.LoaiGhe,
    V.NgayBay,
    V.GiaVe,
    V.Thue,
    V.TongTien,
    V.TrangThai,
    V.CheckInTrangThai
FROM VE V
JOIN HANHKHACH HK ON V.MaHK = HK.MaHK
JOIN GHE G ON V.MaGhe = G.MaGhe
WHERE V.MaVe = 'VE001';`;

  const resetDataQuery = `-- Xóa dữ liệu cũ (Theo thứ tự an toàn)

TRUNCATE TABLE CHECKIN; TRUNCATE TABLE THANHTOAN; TRUNCATE TABLE HANHLY;

DELETE FROM VE; DELETE FROM PHANCONG; DELETE FROM NHANVIEN;

DELETE FROM LICHBAY; DELETE FROM CHUYENBAY; DELETE FROM GHE;

DELETE FROM TUYENBAY; DELETE FROM MAYBAY; DELETE FROM SANBAY;

DELETE FROM HANHKHACH; DELETE FROM NGUOIDUNG; DELETE FROM ROLES; DELETE FROM HANGHANGKHONG;



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

(2, 'an_tran', 'an123', N'Trần Văn An', 'an.tv@gmail.com', '0901112223', 3, N'Hoạt động', '2024-01-15');`;

  const loadBookingDemo = () => {
    setQuery(bookingDemo);
    setError(null);
    setQueryResults(null);
  };

  const loadResetData = () => {
    setQuery(resetDataQuery);
    setError(null);
    setQueryResults(null);
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);
    setError(null);
    setQueryResults(null);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.success) {
        setQueryResults(data.results || []);
      } else {
        setError(data.error || 'An error occurred');
        setQueryResults(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to execute query');
      setQueryResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Demo SQL
        </h1>
        {/* <p className="text-gray-600 mb-6">
          Demo đặt vé máy bay - Xem trạng thái database trước và sau khi đặt vé
        </p> */}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <label
              htmlFor="query"
              className="block text-sm font-medium text-gray-700"
            >
              Enter SQL Query:
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={loadBookingDemo}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
              >
                Test query
              </button>
              <button
                onClick={loadResetData}
                className="px-4 py-2 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors font-medium"
              >
                Reset & Seed Data
              </button>
            </div>
          </div>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập câu lệnh SQL hoặc click 'Test query' để xem ví dụ..."
            className="w-full h-[600px] p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={executeQuery}
            disabled={loading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Executing...' : 'Execute Query'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Display results for each query */}
        {queryResults && queryResults.length > 0 && (
          <div className="space-y-6">
            {queryResults.map((result, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                {/* Query header */}
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {result.query.includes('TRƯỚC KHI') ? (
                        <span className="flex items-center gap-2">
                          <span className="text-blue-600">📊 TRƯỚC KHI ĐẶT VÉ</span>
                        </span>
                      ) : result.query.includes('SAU KHI') ? (
                        <span className="flex items-center gap-2">
                          <span className="text-green-600">✅ SAU KHI ĐẶT VÉ</span>
                        </span>
                      ) : result.query.includes('BƯỚC 3') || result.query.includes('BƯỚC 4') ? (
                        <span className="flex items-center gap-2">
                          <span className="text-orange-600">⚙️ THỰC HIỆN ĐẶT VÉ</span>
                        </span>
                      ) : (
                        `Query ${result.queryIndex}`
                      )}
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

                {/* Error message */}
                {!result.success && result.error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}

                {/* Success message for INSERT/UPDATE/DELETE */}
                {result.success && result.rowsAffected !== undefined && !result.isSelectQuery && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                    <strong>Success!</strong> Query executed successfully.
                    {result.rowsAffected > 0 ? (
                      <span> {result.rowsAffected} row(s) affected.</span>
                    ) : (
                      <span> No rows affected.</span>
                    )}
                  </div>
                )}

                {/* Results table for SELECT queries */}
                {result.success && result.isSelectQuery && result.data && result.data.length > 0 && (
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-3">
                      Results ({result.data.length} row{result.data.length !== 1 ? 's' : ''})
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
                              {Object.values(row).map((value: any, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                  {value !== null && value !== undefined
                                    ? String(value)
                                    : 'NULL'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Empty result set message */}
                {result.success && result.isSelectQuery && result.data && result.data.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
                    Query executed successfully, but no rows were returned.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

