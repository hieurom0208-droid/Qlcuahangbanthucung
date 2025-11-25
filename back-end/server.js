// server.js
const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const db = new Database('./data.db');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Serve static frontend (place your index.html, style.css, script.js in /public)
app.use('/', express.static(path.join(__dirname, 'public')));

// Utility: map SQL row to object
function toProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    price: row.price,
    location: row.location,
    img: row.img
  };
}

// GET /api/products
// Query: q, type, location, sort (latest|priceAsc|priceDesc), page (0-based), perPage
app.get('/api/products', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  const type = req.query.type || '';
  const location = req.query.location || '';
  const sort = req.query.sort || 'latest';
  const page = Math.max(0, parseInt(req.query.page || '0', 10));
  const perPage = Math.max(1, parseInt(req.query.perPage || '6', 10));

  let whereParts = [];
  let params = {};

  if (q) {
    whereParts.push('(LOWER(title) LIKE @q)');
    params.q = `%${q}%`;
  }
  if (type) {
    whereParts.push('type = @type');
    params.type = type;
  }
  if (location) {
    whereParts.push('location = @location');
    params.location = location;
  }

  const where = whereParts.length ? 'WHERE ' + whereParts.join(' AND ') : '';

  let orderBy = 'ORDER BY id DESC'; // newest by id desc
  if (sort === 'priceAsc') orderBy = 'ORDER BY price ASC';
  if (sort === 'priceDesc') orderBy = 'ORDER BY price DESC';

  const totalRow = db.prepare(`SELECT COUNT(*) as c FROM products ${where}`).get(params);
  const total = totalRow ? totalRow.c : 0;

  const stmt = db.prepare(`
    SELECT * FROM products
    ${where}
    ${orderBy}
    LIMIT @limit OFFSET @offset
  `);

  const rows = stmt.all({ ...params, limit: perPage, offset: page * perPage });

  res.json({
    data: rows.map(toProduct),
    meta: { total, page, perPage }
  });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(toProduct(row));
});

// POST /api/products
app.post('/api/products', (req, res) => {
  const { title, type, price, location, img } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const stmt = db.prepare('INSERT INTO products (title,type,price,location,img) VALUES (@title,@type,@price,@location,@img)');
  const info = stmt.run({ title, type, price: price || 0, location, img });
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(toProduct(row));
});

// PUT /api/products/:id
app.put('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, type, price, location, img } = req.body;
  const exists = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
  if (!exists) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE products SET title=@title,type=@type,price=@price,location=@location,img=@img WHERE id=@id')
    .run({ title, type, price: price || 0, location, img, id });
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.json(toProduct(row));
});

// DELETE /api/products/:id
app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

// POST /api/contact
app.post('/api/contact', (req, res) => {
  const { productId, name, phone, message } = req.body;
  const stmt = db.prepare('INSERT INTO contacts (productId,name,phone,message) VALUES (@productId,@name,@phone,@message)');
  const info = stmt.run({ productId: productId || null, name, phone, message });
  res.status(201).json({ id: info.lastInsertRowid, created_at: new Date().toISOString() });
});

// Simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
