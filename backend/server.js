const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with improved settings
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/petstore';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  maxPoolSize: 10
})
.then(() => {
  console.log('✓ MongoDB connected successfully');
  console.log('  Database:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error('✗ MongoDB connection error:', err.message);
  console.error('  Connection string:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  process.exit(1); // Exit if can't connect to database
});

// Monitor connection status
mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✓ MongoDB reconnected');
});

// ===== MODELS =====
const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  icon: String,
  description: String
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
  link: String
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Service = mongoose.model('Service', serviceSchema);

// ===== API ENDPOINTS =====
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().maxTimeMS(10000);
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find().maxTimeMS(10000);
    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Seed data endpoint with improved error handling
const seedDataHandler = async (req, res) => {
  try {
    // Check MongoDB connection first
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not connected. Please check your connection.');
    }

    console.log('🌱 Starting seed process...');

    // Check existing data
    const existingCategories = await Category.countDocuments().maxTimeMS(10000);
    const existingServices = await Service.countDocuments().maxTimeMS(10000);

    if (existingCategories > 0 || existingServices > 0) {
      console.log(`  Found existing data: ${existingCategories} categories, ${existingServices} services`);
      console.log('  Clearing old data...');
      
      await Promise.all([
        Category.deleteMany({}).maxTimeMS(10000),
        Service.deleteMany({}).maxTimeMS(10000)
      ]);
      
      console.log('  ✓ Old data cleared');
    }

    // Seed categories
    const categoriesData = [
      {
        name: 'Chó',
        slug: 'cho',
        icon: '🐕',
        description: 'Các giống chó cưng đáng yêu, trung thành'
      },
      {
        name: 'Mèo',
        slug: 'meo',
        icon: '🐱',
        description: 'Các giống mèo cưng xinh xắn, dễ thương'
      },
      {
        name: 'Cá',
        slug: 'ca',
        icon: '🐠',
        description: 'Cá cảnh đẹp, trang trí nhà cửa'
      },
      {
        name: 'Chim',
        slug: 'chim',
        icon: '🐦',
        description: 'Các loại chim cảnh dễ thương, hót hay'
      },
      {
        name: 'Thú cưng khác',
        slug: 'thu-cung-khac',
        icon: '🐾',
        description: 'Các loại thú cưng độc đáo, thú vị'
      }
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log(`  ✓ Created ${categories.length} categories`);

    // Seed services
    const servicesData = [
      {
        title: 'Mua bán thú cưng',
        icon: '🐾',
        description: 'Mua bán các loại thú cưng uy tín, đảm bảo sức khỏe tốt',
        link: '/pets'
      },
      {
        title: 'Phối giống cho thú',
        icon: '💕',
        description: 'Dịch vụ phối giống chuyên nghiệp, chất lượng cao',
        link: '/breeding'
      },
      {
        title: 'Sự kiện khuyến mãi',
        icon: '🎉',
        description: 'Các chương trình khuyến mãi hấp dẫn, giảm giá sốc hàng tháng',
        link: '/promotions'
      },
      {
        title: 'Cẩm nang thú cưng',
        icon: '📚',
        description: 'Kiến thức chăm sóc thú cưng từ A-Z, hướng dẫn chi tiết',
        link: '/guide'
      }
    ];

    const services = await Service.insertMany(servicesData);
    console.log(`  ✓ Created ${services.length} services`);
    console.log('Seed process completed successfully!');

    // Response based on request method
    if (req.method === 'GET') {
      res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Seed Thành Công</title>
  <style>
    body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
    .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; }
    .info { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; }
    h1 { color: #155724; }
    ul { line-height: 1.8; }
    a { color: #007bff; text-decoration: none; margin: 10px; display: inline-block; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="success">
    <h1>✓ Seed Database Thành Công!</h1>
    <div class="info">
      <strong>Tóm tắt:</strong><br>
      Categories: ${categories.length} items<br>
      Services: ${services.length} items
    </div>
    
    <h3>Categories đã tạo:</h3>
    <ul>
      ${categories.map(cat => `<li>${cat.icon} ${cat.name} (${cat.slug})</li>`).join('')}
    </ul>
    
    <h3>Services đã tạo:</h3>
    <ul>
      ${services.map(srv => `<li>${srv.icon} ${srv.title}</li>`).join('')}
    </ul>
    
    <div style="margin-top: 20px;">
      <a href="/api/categories">Xem Categories JSON</a>
      <a href="/api/services">Xem Services JSON</a>
      <a href="/">Về API Home</a>
    </div>
  </div>
</body>
</html>`);
    } else {
      res.json({
        success: true,
        message: 'Seed thành công!',
        data: {
          categories: categories.length,
          services: services.length
        }
      });
    }

  } catch (error) {
    console.error('✗ Seed error:', error);
    
    if (req.method === 'GET') {
      res.status(500).send(`<!DOCTYPE html>
<html>
<head>
  <title>Lỗi Seed</title>
  <style>
    body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
    .error { background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 5px; }
    h1 { color: #721c24; }
    pre { background: #fff; padding: 15px; border: 1px solid #ddd; overflow-x: auto; }
    a { color: #007bff; }
  </style>
</head>
<body>
  <div class="error">
    <h1>✗ Lỗi Seed Data</h1>
    <p><strong>Chi tiết lỗi:</strong></p>
    <pre>${error.message}</pre>
    <p><strong>Nguyên nhân có thể:</strong></p>
    <ul>
      <li>MongoDB chưa được khởi động</li>
      <li>Chuỗi kết nối không đúng</li>
      <li>Timeout khi kết nối đến database</li>
    </ul>
    <a href="/">← Về trang chủ</a>
  </div>
</body>
</html>`);
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
        possibleCauses: [
          'MongoDB chưa được khởi động',
          'Chuỗi kết nối không đúng',
          'Timeout khi kết nối đến database'
        ]
      });
    }
  }
};

app.get('/api/seed', seedDataHandler);
app.post('/api/seed', seedDataHandler);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: dbStatus === 1 ? 'ok' : 'error',
    message: 'Server đang chạy',
    mongodb: statusMap[dbStatus],
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Home endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Pet Store API',
    version: '1.0.1',
    status: 'online',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      health: 'GET /api/health - Kiểm tra trạng thái server',
      categories: 'GET /api/categories - Lấy danh sách categories',
      services: 'GET /api/services - Lấy danh sách services',
      seed: 'GET|POST /api/seed - Seed dữ liệu mẫu'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║      Pet Store API Server v1.0.1       ║
║                                        ║
║  Port: ${PORT}                            ║
║  Status: Running ✓                     ║
╚════════════════════════════════════════╝

📍 Endpoints:
   - GET  /                  → API info
   - GET  /api/health        → Health check
   - GET  /api/categories    → List categories
   - GET  /api/services      → List services
   - GET  /api/seed          → Seed data (browser)
   - POST /api/seed          → Seed data (API)

🔗 Quick links:
   1. Health: http://localhost:${PORT}/api/health
   2. Seed:   http://localhost:${PORT}/api/seed
   3. Test:   http://localhost:${PORT}/api/categories
`);
});