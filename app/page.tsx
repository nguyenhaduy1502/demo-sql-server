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

  const loadBookingDemo = () => {
    setQuery(bookingDemo);
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
          ✈️ Hệ Thống Quản Lý Chuyến Bay
        </h1>
        <p className="text-gray-600 mb-6">
          Demo đặt vé máy bay - Xem trạng thái database trước và sau khi đặt vé
        </p>

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
                ✈️ Demo Đặt Vé Máy Bay
              </button>
            </div>
          </div>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập câu lệnh SQL của bạn hoặc click 'Demo Đặt Vé Máy Bay' để xem ví dụ..."
            className="w-full h-48 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

