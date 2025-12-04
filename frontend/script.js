const API_URL = 'http://localhost:5001';

// Đăng ký
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;
        const message = document.getElementById('message');

        if (password !== confirm) {
            showMessage(message, 'Mật khẩu xác nhận không khớp!', 'error');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (data.success) {
                showMessage(message, data.message || 'Đăng ký thành công!', 'success');
                setTimeout(() => { window.location.href = 'dangnhap.html'; }, 2000);
            } else {
                showMessage(message, data.message, 'error');
            }
        } catch (err) {
            showMessage(message, 'Lỗi kết nối server!', 'error');
        }
    });
}

// Đăng nhập
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const message = document.getElementById('loginMessage');

        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                showMessage(message, data.message, 'success');
                setTimeout(() => {
                    alert(`Xin chào ${data.user.name}!`);
                    // window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showMessage(message, data.message, 'error');
            }
        } catch (err) {
            showMessage(message, 'Không kết nối được server!', 'error');
        }
    });
}

function showMessage(el, text, type) {
    const icon = type === 'success' ? '' : '';
    el.textContent = icon + text;
    el.className = `message ${type}`;
    el.style.display = 'block';
}
