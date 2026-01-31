# SQL Server Query Tool

Ứng dụng Next.js dùng để chạy truy vấn SQL và demo các đối tượng T-SQL (Functions, Stored Procedures, Triggers, Cursor) trên database **QuanLyChuyenBay** (Quản lý chuyến bay).

## Tính năng

- Kết nối SQL Server qua biến môi trường (`.env.local`)
- Giao diện demo theo nhóm: **Functions**, **Procedures**, **Triggers**, **Cursor**
- Mỗi demo có sẵn câu lệnh mẫu, bấm **Run** để thực thi và xem kết quả dạng bảng
- Hỗ trợ nhiều câu lệnh (ngăn cách bằng dấu `;`) hoặc chạy nguyên một batch (dùng cho Cursor)
- Công nghệ: Next.js 14, TypeScript, Tailwind CSS

## Hướng dẫn chạy project

### 1. Cài đặt dependency

```bash
npm install
```

### 2. Cấu hình biến môi trường

- Copy `.env.example` thành `.env.local`
- Sửa `.env.local` với thông tin kết nối SQL Server của bạn:

```env
DB_SERVER=localhost
DB_DATABASE=QuanLyChuyenBay
DB_USER=your-username
DB_PASSWORD=your-password
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

**Ghi chú:**

- `DB_SERVER`: Tên instance SQL Server (vd: `localhost`, `localhost\SQLEXPRESS`)
- `DB_DATABASE`: Tên database (mặc định: `QuanLyChuyenBay`)
- `DB_USER` / `DB_PASSWORD`: Để trống nếu dùng Windows Authentication; điền nếu dùng SQL Authentication
- `DB_ENCRYPT`: `true` nếu bật mã hóa kết nối
- `DB_TRUST_SERVER_CERTIFICATE`: `true` thường dùng cho môi trường local

### 3. Tạo database

Script tạo database và dữ liệu mẫu nằm trong thư mục **`export/`**:

| File | Mục đích |
|------|----------|
| **`export/QuanLyChuyenBay_Full.sql`** | Tạo database, bảng, dữ liệu mẫu, Functions, Procedures, Triggers (chạy lần đầu hoặc tạo lại từ đầu) |
| **`export/QuanLyChuyenBay_ResetSeed.sql`** | Xóa dữ liệu cũ và chèn lại dữ liệu mẫu (giữ nguyên bảng và đối tượng) |

**Cách làm:**

1. Mở **SQL Server Management Studio**, kết nối tới SQL Server.
2. Mở file **`export/QuanLyChuyenBay_Full.sql`**.
3. Chạy toàn bộ script (F5).

Nếu database đã tồn tại và chỉ muốn reset dữ liệu, chạy **`export/QuanLyChuyenBay_ResetSeed.sql`**. Chi tiết cách dùng từng script xem trong **`export/README.md`**.

### 4. Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt: [http://localhost:3000](http://localhost:3000)

### 5. Sử dụng giao diện

- Chọn nhóm demo: **Functions**, **Procedures**, **Triggers**, **Cursor**.
- Chọn từng demo trong danh sách; câu lệnh mẫu sẽ hiện trong ô SQL.
- Bấm **Run** để thực thi và xem kết quả bên dưới.

## Cấu trúc demo

- **Functions**: Hàm T-SQL (vd: tính phí hành lý, thống kê theo hãng, …).
- **Procedures**: Stored procedure (đặt vé, thanh toán, thêm hành lý, …).
- **Triggers**: Trigger trên bảng (tính tổng tiền vé, kiểm tra tuyến bay, cập nhật trạng thái chuyến bay, …).
- **Cursor**: Demo duyệt từng dòng (chuyến bay, vé) bằng Cursor T-SQL; kết quả trả về qua bảng tạm.

## Cấu hình kết nối

Kết nối database đọc từ `.env.local`:

| Biến | Ý nghĩa |
|------|--------|
| `DB_SERVER` | Tên server (bắt buộc) |
| `DB_DATABASE` | Tên database (mặc định: `QuanLyChuyenBay`) |
| `DB_USER` | User SQL (tùy chọn; bỏ trống nếu dùng Windows Auth) |
| `DB_PASSWORD` | Mật khẩu SQL (tùy chọn) |
| `DB_ENCRYPT` | Bật/tắt mã hóa (`true`/`false`) |
| `DB_TRUST_SERVER_CERTIFICATE` | Tin certificate server (`true`/`false`) |

## Lưu ý

- Đảm bảo `.env.local` đã cấu hình đúng trước khi chạy `npm run dev`.
- Không commit `.env.local` (đã có trong `.gitignore`).
- Ứng dụng dùng cho mục đích demo/học tập; không áp dụng trực tiếp cho môi trường production.
- Mỗi lần bấm Run, app sẽ kết nối SQL Server và thực thi câu lệnh tương ứng.
