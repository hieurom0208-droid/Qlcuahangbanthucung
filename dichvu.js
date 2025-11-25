const serviceDetails = {
  1: {
    title: "Tắm rửa thú cưng",
    steps: [
      "Nhận thú cưng & kiểm tra cơ bản",
      "Tắm với sữa tắm chuyên dụng",
      "Sấy lông khô & vệ sinh tai",
      "Cắt móng và kiểm tra móng",
      "Kiểm tra lại toàn bộ & bàn giao"
    ],
    price: "100.000 VNĐ",
  },
  2: {
    title: "Cắt tỉa lông",
    steps: [
      "Tham khảo ý kiến chủ nuôi",
      "Chải lông & kiểm tra da",
      "Cắt tỉa tạo kiểu theo yêu cầu",
      "Dọn vệ sinh lông vụn",
    ],
    price: "150.000 VNĐ",
  },
  3: {
    title: "Khám sức khỏe",
    steps: [
      "Khám tổng quát",
      "Kiểm tra mắt, tai, mũi, miệng",
      "Đo nhiệt độ & kiểm tra da",
      "Tư vấn sức khoẻ & phòng bệnh"
    ],
    price: "200.000 VNĐ",
  },
  4: {
    title: "Khách sạn thú cưng",
    steps: [
      "Nhận & kiểm tra thú cưng",
      "Bố trí phòng nghỉ",
      "Theo dõi & chăm sóc 24/7",
      "Cập nhật thông tin cho chủ nuôi mỗi ngày"
    ],
    price: "250.000 VNĐ/ngày",
  }
};

const cards = document.querySelectorAll('.service-card');
const modal = document.getElementById('service-modal');
const modalTitle = document.getElementById('modal-title');
const modalSteps = document.getElementById('modal-steps');
const modalPrice = document.getElementById('modal-price');
const closeBtn = document.querySelector('.close-btn');
const bookingForm = document.getElementById('booking-form');

let currentService = null;

function openModal(id) {
  const detail = serviceDetails[id];
  if (!detail) return;
  currentService = detail.title;

  modalTitle.textContent = detail.title;
  modalSteps.innerHTML = "";
  detail.steps.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    modalSteps.appendChild(li);
  });
  modalPrice.textContent = detail.price;
  
  bookingForm.reset();
  modal.style.display = 'flex';
}

closeBtn.onclick = function() {
  modal.style.display = 'none';
};
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

cards.forEach(card => {
  card.addEventListener('click', function() {
    const id = this.getAttribute('data-id');
    openModal(id);
  });
});

bookingForm.onsubmit = function(e) {
  e.preventDefault();

  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const date = document.getElementById('booking-date').value;
  const note = document.getElementById('customer-note').value.trim();
  
  if (!name || !phone || !date) {
    alert('Vui lòng nhập đủ thông tin!');
    return;
  }
  
  alert(
    `Đặt lịch thành công!\n\nDịch vụ: ${currentService}\nTên KH: ${name}\nSĐT: ${phone}\nNgày: ${date}\nGhi chú: ${note||"Không có"}`
  );

  modal.style.display = 'none';
};

