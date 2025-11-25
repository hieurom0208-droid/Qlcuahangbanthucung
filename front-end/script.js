// script.js (frontend - gọi API)
let page = 0;
let perPage = 6;

const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const filterLocation = document.getElementById("filterLocation");
const sortBy = document.getElementById("sortBy");

async function fetchProducts({ q='', type='', location='', sort='latest', page=0, perPage=6 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (type) params.set('type', type);
  if (location) params.set('location', location);
  if (sort) params.set('sort', sort);
  params.set('page', page);
  params.set('perPage', perPage);

  const res = await fetch('/api/products?' + params.toString());
  if (!res.ok) throw new Error('Fetch failed');
  return res.json(); // { data:[], meta:{} }
}

async function renderProducts(reset=false) {
  const grid = document.getElementById("grid");
  if (reset) {
    page = 0;
    grid.innerHTML = "";
  }

  const q = searchInput.value.trim();
  const type = filterType.value;
  const location = filterLocation.value;
  const sort = sortBy.value;

  try {
    const resp = await fetchProducts({ q, type, location, sort, page, perPage });
    const slice = resp.data;

    slice.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="media">
          <img src="${p.img}">
          <div class="tag-top">THÔNG TIN THÚ CƯNG</div>
          <div class="badge-price">${Number(p.price).toLocaleString()}₫</div>
          <div class="badge-location">${p.location}</div>
        </div>
        <div class="card-body">
          <div>
            <h3 class="title">${p.title}</h3>
            <div class="meta">Loại: ${p.type}</div>
          </div>
          <div class="actions">
            <button class="view-btn" data-id="${p.id}">Xem</button>
            <button class="ghost contact-btn" data-id="${p.id}">Liên hệ</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // tăng page nếu có dữ liệu
    if (slice.length > 0) page++;
    // nếu không còn dữ liệu, ẩn nút Tải thêm
    const loadMoreBtn = document.getElementById('loadMore');
    if (resp.meta.total <= page * perPage) loadMoreBtn.style.display = 'none';
    else loadMoreBtn.style.display = 'block';

  } catch (err) {
    console.error(err);
    alert('Lấy sản phẩm lỗi: ' + err.message);
  }
}

// Events
searchInput.addEventListener('input', () => renderProducts(true));
filterType.onchange = () => renderProducts(true);
filterLocation.onchange = () => renderProducts(true);
sortBy.onchange = () => renderProducts(true);
document.getElementById("clearFilters").onclick = () => {
  filterType.value = "";
  filterLocation.value = "";
  sortBy.value = "latest";
  searchInput.value = "";
  renderProducts(true);
};

document.getElementById('loadMore').onclick = () => renderProducts(false);

// view detail and contact
function createDetailPopup() {
  const popup = document.createElement("div");
  popup.id = "detailPopup";
  popup.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:9999`;
  popup.innerHTML = `
    <div style="background:white; padding:20px; border-radius:10px; width:320px; max-width:90%; box-shadow:0 4px 20px rgba(0,0,0,0.2); text-align:center;">
      <img id="detailImg" style="width:100%;border-radius:10px;">
      <h2 id="detailTitle" style="margin-top:10px"></h2>
      <p id="detailPrice"></p>
      <p id="detailLocation"></p>
      <div style="margin-top:10px;">
        <button id="closeDetail">Đóng</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  document.getElementById('closeDetail').onclick = () => popup.remove();
}

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('view-btn')) {
    const id = e.target.dataset.id;
    try {
      const res = await fetch('/api/products/' + id);
      if (!res.ok) throw new Error('Không tìm thấy');
      const pet = await res.json();
      createDetailPopup();
      document.getElementById('detailImg').src = pet.img;
      document.getElementById('detailTitle').innerText = pet.title;
      document.getElementById('detailPrice').innerText = 'Giá: ' + Number(pet.price).toLocaleString() + '₫';
      document.getElementById('detailLocation').innerText = 'Địa điểm: ' + pet.location;
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  }

  if (e.target.classList.contains('contact-btn')) {
    const id = Number(e.target.dataset.id);
    const name = prompt('Tên của bạn:');
    if (!name) return alert('Cần tên.');
    const phone = prompt('Số điện thoại:');
    if (!phone) return alert('Cần số điện thoại.');
    const message = prompt('Nội dung (tuỳ chọn):') || '';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ productId: id, name, phone, message })
      });
      if (!res.ok) throw new Error('Gửi thất bại');
      alert('Gửi liên hệ thành công. Người bán sẽ liên hệ bạn sớm.');
    } catch (err) {
      alert('Lỗi gửi liên hệ: ' + err.message);
    }
  }
});

// initial render
renderProducts(true);
