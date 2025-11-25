// API Configuration
const API_URL = 'http://localhost:5000/api';

// Load Categories from API
async function loadCategories() {
    try {
        console.log('Loading categories from API...');
        const response = await fetch(`${API_URL}/categories`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Categories response:', data);
        
        const categories = data.data || data;
        
        if (!Array.isArray(categories)) {
            throw new Error('Categories data is not an array');
        }
        const categoriesContainer = document.querySelector('.categories');
        if (!categoriesContainer) {
            console.error('Categories container not found');
            return;
        }
        
        categoriesContainer.innerHTML = '';
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-btn';
            button.textContent = `${category.icon} ${category.name}`;
            button.onclick = () => selectCategory(button, category);
            categoriesContainer.appendChild(button);
        });
        
        console.log(`✓ Loaded ${categories.length} categories`);
        
    } catch (error) {
        console.error('Error loading categories:', error);
        const categoriesContainer = document.querySelector('.categories');
        if (categoriesContainer) {
            categoriesContainer.innerHTML = `
                <div style="color: #dc2626; padding: 1rem; text-align: center; width: 100%;">
                    <strong>Lỗi:</strong> Không thể tải danh mục. ${error.message}
                    <br>
                    <small>Vui lòng kiểm tra backend server và seed dữ liệu.</small>
                </div>
            `;
        }
    }
}

async function loadServices() {
    try {
        console.log('Loading services from API...');
        const response = await fetch(`${API_URL}/services`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Services response:', data);
        
        const services = data.data || data;
        
        if (!Array.isArray(services)) {
            throw new Error('Services data is not an array');
        }
        const servicesGrid = document.querySelector('.services-grid');
        if (!servicesGrid) {
            console.error('Services grid not found');
            return;
        }
        
        servicesGrid.innerHTML = '';
        
        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <div class="service-icon">${service.icon}</div>
                <h3 class="service-title">${service.title}</h3>
                ${service.description ? `<p style="margin-top: 8px; color: #6b7280; font-size: 14px;">${service.description}</p>` : ''}
            `;
            
            if (service.link) {
                card.style.cursor = 'pointer';
                card.onclick = () => {
                    window.location.href = service.link;
                };
            }
            
            servicesGrid.appendChild(card);
        });
        
        console.log(`Loaded ${services.length} services`);
        
    } catch (error) {
        console.error('Error loading services:', error);
        
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            servicesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; color: #dc2626; padding: 2rem; text-align: center; background: #fee; border-radius: 8px;">
                    <strong>Lỗi:</strong> Không thể tải dịch vụ. ${error.message}
                    <br>
                    <small>Vui lòng kiểm tra backend server và seed dữ liệu tại 
                    <a href="http://localhost:5000/api/seed" target="_blank" style="color: #2563eb;">http://localhost:5000/api/seed</a>
                    </small>
                </div>
            `;
        }
    }
}

// Handle category selection
function selectCategory(button, category) {
    // Remove active class from all buttons
    const allButtons = document.querySelectorAll('.category-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    button.classList.add('active');
    console.log('Selected category:', category);
    
    // TODO: Filter products by category
}

async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const health = await response.json();
        console.log('API Health:', health);
        return health.status === 'ok';
    } catch (error) {
        console.error('API health check failed:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Pet Store Homepage...');
    
    const isHealthy = await checkAPIHealth();
    
    if (!isHealthy) {
        console.warn('API is not responding. Please check:');
        console.warn('   1. Backend server is running on http://localhost:5000');
        console.warn('   2. MongoDB is connected');
        console.warn('   3. Data is seeded at http://localhost:5000/api/seed');
    }
    
    // Load data
    console.log('Loading data from API...');
    await Promise.all([
        loadCategories(),
        loadServices()
    ]);
    
    console.log(' Homepage initialization complete!');
});

window.selectCategory = selectCategory;
window.loadCategories = loadCategories;
window.loadServices = loadServices;