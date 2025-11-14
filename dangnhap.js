// Lấy các phần tử
const loginBtn = document.getElementById("loginBtn");
const resetBtn = document.getElementById("resetBtn");
const showBtn = document.getElementById("showBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");
const message = document.getElementById("message");

// Fake tài khoản mẫu
const USER = "admin";
const PASS = "123";

// Nút đăng nhập
loginBtn.addEventListener("click", function () {
    if (username.value === "" || password.value === "") {
        message.style.color = "red";
        message.textContent = "Please fill out all fields!";
    } 
    else if (username.value === USER && password.value === PASS) {
        message.style.color = "green";
        message.textContent = "Login Successful!";
    }
    else {
        message.style.color = "red";
        message.textContent = "Incorrect username or password!";
    }
});

// Nút Reset
resetBtn.addEventListener("click", function () {
    username.value = "";
    password.value = "";
    message.textContent = "";
});

// Nút Show Password
showBtn.addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
        showBtn.textContent = "Hide";
    } else {
        password.type = "password";
        showBtn.textContent = "Show";
    }
});
