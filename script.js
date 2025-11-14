
const sampleProducts = [
  { id:1, title:"Chó Phốc Sóc", type:"chó", price:1200000, location:"Đà Nẵng", img:"https://via.placeholder.com/640x400?text=Cho" },
  { id:2, title:"Mèo Anh Lông Ngắn", type:"mèo", price:900000, location:"Hà Nội", img:"https://via.placeholder.com/640x400?text=Meo" },
  { id:3, title:"Hamster", type:"hamster", price:150000, location:"Đà Nẵng", img:"https://via.placeholder.com/640x400?text=Hamster" },
  { id:4, title:"Chó Phú Quốc", type:"chó", price:2000000, location:"HCM", img:"https://via.placeholder.com/640x400?text=Cho" }
];

let page = 0;
let perPage = 6;


function renderProducts(reset=false) {
  const grid = document.getElementById("grid");
  if (reset) {
    page = 0;
    grid.innerHTML = "";
  }

  const filtered = filterProducts();
  const start = page * perPage;
  const slice = filtered.slice(start, start + perPage);

  slice.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="media">
        <img src="${p.img}">
        <div class="tag-top">THÔNG TIN THÚ CƯNG</div>
        <div class="badge-price">${p.price.toLocaleString()}₫</div>
        <div class="badge-location">${p.location}</div>
      </div>

      <div class="card-body">
        <div>
          <h3 class="title">${p.title}</h3>
          <div class="meta">Loại: ${p.type}</div>
        </div>

        <div class="actions">
          <button class="view-btn" data-id="${p.id}">Xem</button>
          <button class="ghost">Liên hệ</button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  page++;
}

// =========================
// TÌM KIẾM
// =========================
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  renderProducts(true);
});

const filterType = document.getElementById("filterType");
const filterLocation = document.getElementById("filterLocation");
const sortBy = document.getElementById("sortBy");

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


function filterProducts() {
  let data = [...sampleProducts];


  const keyword = searchInput.value.toLowerCase();
  if (keyword) {
    data = data.filter(p => p.title.toLowerCase().includes(keyword));
  }


  if (filterType.value) {
    data = data.filter(p => p.type === filterType.value);
  }

 
  if (filterLocation.value) {
    data = data.filter(p => p.location === filterLocation.value);
  }

  
  switch(sortBy.value) {
    case "priceAsc":
      data.sort((a,b)=>a.price - b.price);
      break;
    case "priceDesc":
      data.sort((a,b)=>b.price - a.price);
      break;
    default:
      data.sort((a,b)=>a.id - b.id); // mặc định là mới nhất
  }

  return data;
}

document.getElementById("loadMore").onclick = () => {
  renderProducts();
};


function createDetailPopup() {
  const popup = document.createElement("div");
  popup.id = "detailPopup";
  popup.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,0.5); 
    display:flex; align-items:center; justify-content:center;
  `;

  popup.innerHTML = `
    <div style="
      background:white; padding:20px; border-radius:10px;
      width:320px; max-width:90%;
      box-shadow:0 4px 20px rgba(0,0,0,0.2);
      text-align:center;
    ">
      <img id="detailImg" style="width:100%;border-radius:10px;">
      <h2 id="detailTitle" style="margin-top:10px"></h2>
      <p id="detailPrice"></p>
      <p id="detailLocation"></p>
      <button onclick="document.getElementById('detailPopup').remove()">Đóng</button>
    </div>
  `;
  document.body.appendChild(popup);
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("view-btn")) {
    const id = Number(e.target.dataset.id);
    const pet = sampleProducts.find(p => p.id === id);

    createDetailPopup();

    document.getElementById("detailImg").src = pet.img;
    document.getElementById("detailTitle").innerText = pet.title;
    document.getElementById("detailPrice").innerText = "Giá: " + pet.price.toLocaleString() + "₫";
    document.getElementById("detailLocation").innerText = "Địa điểm: " + pet.location;
  }
});

renderProducts();
