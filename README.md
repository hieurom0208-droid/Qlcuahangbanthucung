# Quản Lý Cửa Hàng Bán Thú Cưng  
**Phần: Đăng Nhập & Đăng Ký**  
**Thành viên:** Nguyễn Quốc Hoàng  
**Branch:** `frontend/QHoang`

---

### Mô tả dự án
Hoàn thành 100% chức năng **Đăng ký** và **Đăng nhập** với giao diện cực dễ thương và bảo mật thật (mật khẩu được mã hóa bằng bcrypt).

### Tính năng đã hoàn thiện
- Đăng ký tài khoản mới (kiểm tra email trùng, xác nhận mật khẩu)
- Đăng nhập an toàn (so sánh mật khẩu đã mã hóa)
- Thông báo thành công/thất bại siêu cute
- Backend Node.js + Express hoạt động thật
- Lưu trữ người dùng trong file `backend/data/users.json`
- Responsive 100%, màu pastel dễ thương

### Công nghệ sử dụng
- **Frontend**: HTML, CSS thuần, JavaScript (ES6)
- **Backend**: Node.js + Express
- **Bảo mật**: bcryptjs
- **CORS**: đã bật để frontend gọi backend mượt mà

### Cách chạy dự án
1. Mở Terminal, vào thư mục backend:
   ```bash
   cd backend
   npx nodemon server.js
→ Thấy dòng Server đang chạy tại http://localhost:5001 là OK

Mở file dangnhap.html (trang đăng nhập) bằng Live Server trong VS Code
Thử ngay:
Đăng ký tài khoản mới → thành công sẽ tự chuyển sang trang đăng nhập
Đăng nhập bằng tài khoản vừa tạo → hiện thông báo “Woof woof! Chào mừng …”


Cấu trúc thư mục quan trọng
textpet-manager/
├── dangnhap.html          → Trang đăng nhập
├── dangky.html         → Trang đăng ký
├── style.css           → Giao diện dễ thương
├── script.js           → Xử lý đăng ký + đăng nhập + gọi API
├── backend/
│   ├── server.js       → Backend Node.js + Express
│   └── data/
│       └── users.json  → Danh sách người dùng (mật khẩu đã mã hóa)

Cảm ơn thầy cô và các bạn trong nhóm đã hỗ trợ!
Hoàng rất mong nhận được góp ý để dự án hoàn thiện hơn ạ!
— Nguyễn Quốc Hoàng —
