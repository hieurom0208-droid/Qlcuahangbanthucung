//Database Models
const mongoose = require('mongoose');

// User
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    address: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

// Category
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    icon: String,
    createdAt: { type: Date, default: Date.now }
});

// Pet
const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    breed: String,
    age: Number,
    price: { type: Number, required: true },
    description: String,
    images: [String],
    status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

// Service
const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    icon: String,
    link: String,
    createdAt: { type: Date, default: Date.now }
});

// Export
const User = mongoose.model('User', userSchema);
const Category = mongoose.model('Category', categorySchema);
const Pet = mongoose.model('Pet', petSchema);
const Service = mongoose.model('Service', serviceSchema);

module.exports = {
    User,
    Category,
    Pet,
    Service
};