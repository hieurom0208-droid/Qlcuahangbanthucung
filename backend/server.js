const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

// FIX LỖI KẾT NỐI 100% - thêm 2 dòng này
app.use(cors());
app.use(express.json());

// Tự tạo thư mục data + users.json nếu chưa có
const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');

const readUsers = () => JSON.parse(fs.readFileSync(usersFile));
const writeUsers = (users) => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

// API Đăng ký
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const users = readUsers();
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'Email này đã được đăng ký!' });
        }
        const hashed = await bcrypt.hash(password, 10);
        users.push({ id: Date.now().toString(), name, email, password: hashed });
        writeUsers(users);
        res.json({ success: true, message: 'Đăng ký thành công! Chào mừng đến với Quản lý thú cưng 🐾' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API Đăng nhập
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = readUsers();
        const user = users.find(u => u.email === email);
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }
        res.json({ success: true, message: `Woof woof! Chào mừng ${user.name} quay lại ❤️`, user: { name: user.name, email } });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

app.get('/', (req, res) => {
    res.send('Backend Quản lý thú cưng đang chạy ngon lành!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});