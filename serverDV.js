const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const bookings = [];


app.post('/booking', (req, res) => {
  const { service, name, phone, date, note } = req.body;
  if (!service || !name || !phone || !date) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin!" });
  }
  const booking = { service, name, phone, date, note, createdAt: new Date() };
  bookings.push(booking);
  return res.status(201).json({ success: true, booking });
});


app.get('/booking', (req, res) => {

  return res.json(bookings.slice().reverse());
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Pet Shop booking server đang chạy tại cổng', PORT);
});