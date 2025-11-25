//Script để import dữ liệu vào MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

//Schema
const categorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    icon: String,
    description: String
});

const serviceSchema = new mongoose.Schema({
    title: String,
    icon: String,
    description: String,
    link: String
});

const Category = mongoose.model('Category', categorySchema);
const Service = mongoose.model('Service', serviceSchema);

// Dữ liệu Categories
const categoriesData = [
    {
        name: "Chó",
        slug: "cho",
        icon: "🐕",
        description: "Các giống chó cưng đáng yêu, trung thành"
    },
    {
        name: "Mèo",
        slug: "meo",
        icon: "🐱",
        description: "Các giống mèo cưng xinh xắn, dễ thương"
    },
    {
        name: "Cá",
        slug: "ca",
        icon: "🐠",
        description: "Cá cảnh đẹp, trang trí nhà cửa"
    },
    {
        name: "Chim",
        slug: "chim",
        icon: "🐦",
        description: "Các loại chim cảnh dễ thương, hót hay"
    },
    {
        name: "Thú cưng khác",
        slug: "thu-cung-khac",
        icon: "🐾",
        description: "Các loại thú cưng độc đáo, thú vị"
    }
];

// Dữ liệu Services
const servicesData = [
    {
        title: "Mua bán thú cưng",
        icon: "🐾",
        description: "Mua bán các loại thú cưng uy tín, đảm bảo sức khỏe tốt",
        link: "/pets"
    },
    {
        title: "Phối giống cho thú",
        icon: "💕",
        description: "Dịch vụ phối giống chuyên nghiệp, chất lượng cao",
        link: "/breeding"
    },
    {
        title: "Sự kiện khuyến mãi",
        icon: "🎉",
        description: "Các chương trình khuyến mãi hấp dẫn, giảm giá sốc hàng tháng",
        link: "/promotions"
    },
    {
        title: "Cẩm nang thú cưng",
        icon: "📚",
        description: "Kiến thức chăm sóc thú cưng từ A-Z, hướng dẫn chi tiết",
        link: "/guide"
    }
];

// Import function
async function importData() {
    try {
        await Category.deleteMany({});
        await Service.deleteMany({});

        const categories = await Category.insertMany(categoriesData);
        const services = await Service.insertMany(servicesData);

        console.log(`\nCategories: ${categories.length} items`);
        console.log(`Services: ${services.length} items\n`);

        console.log('Categories:');
        categories.forEach((cat, i) => {
            console.log(`  ${i + 1}. ${cat.icon} ${cat.name} (${cat.slug})`);
        });

        console.log('\nServices:');
        services.forEach((srv, i) => {
            console.log(`  ${i + 1}. ${srv.icon} ${srv.title}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi import:', error);
        process.exit(1);
    }
}

importData();