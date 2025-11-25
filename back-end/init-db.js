// init-db.js
const Database = require('better-sqlite3');
const db = new Database('./data.db');

db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT,
  price INTEGER,
  location TEXT,
  img TEXT
);

CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  productId INTEGER,
  name TEXT,
  phone TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(productId) REFERENCES products(id) ON DELETE SET NULL
);
`);

// sample data (tương tự sampleProducts)
const sample = [
  { title:"Chó Phốc Sóc", type:"chó", price:1200000, location:"Đà Nẵng", img:"https://via.placeholder.com/640x400?text=Cho" },
  { title:"Mèo Anh Lông Ngắn", type:"mèo", price:900000, location:"Hà Nội", img:"https://via.placeholder.com/640x400?text=Meo" },
  { title:"Hamster", type:"hamster", price:150000, location:"Đà Nẵng", img:"https://via.placeholder.com/640x400?text=Hamster" },
  { title:"Chó Phú Quốc", type:"chó", price:2000000, location:"HCM", img:"https://via.placeholder.com/640x400?text=Cho" }
];

const insert = db.prepare('INSERT INTO products (title,type,price,location,img) VALUES (@title,@type,@price,@location,@img)');

const count = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
if (count === 0) {
  const txn = db.transaction((rows) => {
    for (const r of rows) insert.run(r);
  });
  txn(sample);
  console.log('Inserted sample products.');
} else {
  console.log('Products already exist in DB.');
}

console.log('DB initialized.');
db.close();
