//Service
const express = require('express');
const { Service, Category } = require('./models');
const { authenticateToken } = require('./authRoutes');
const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: 1 });
        res.json(services);
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single service
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        console.error('Get service error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;