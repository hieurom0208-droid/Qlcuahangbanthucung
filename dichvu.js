// 1. Hiển thị thông báo khi click vào card dịch vụ
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
  card.addEventListener('click', () => {
    const serviceName = card.querySelector('h3').textContent;
    alert(`Bạn đã chọn dịch vụ: ${serviceName}`);
  });
});

// 2. Hiệu ứng đổi màu header khi scroll
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.backgroundColor = '#ff7a26'; // màu tối hơn khi scroll
    header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
  } else {
    header.style.backgroundColor = '#ff914d'; // màu gốc
    header.style.boxShadow = 'none';
  }
});
