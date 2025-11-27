// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const sql = require('mssql/msnodesqlv8'); // Windows Authentication
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// مؤقت: dummy routes
// --------------------
const authRoutes = express.Router();
authRoutes.post('/register', (req, res) => res.json({ message: 'Register endpoint works!' }));
authRoutes.post('/login', (req, res) => res.json({ message: 'Login endpoint works!' }));

const adminRoutes = express.Router();
adminRoutes.get('/', (req, res) => res.json({ message: 'Admin endpoint works!' }));

const restaurantRoutes = express.Router();
restaurantRoutes.get('/', (req, res) => res.json({ message: 'Restaurants endpoint works!' }));

const dishRoutes = express.Router();
dishRoutes.get('/', (req, res) => res.json({ message: 'Dishes endpoint works!' }));

const orderRoutes = express.Router();
orderRoutes.get('/', (req, res) => res.json({ message: 'Orders endpoint works!' }));

const reviewRoutes = express.Router();
reviewRoutes.get('/', (req, res) => res.json({ message: 'Reviews endpoint works!' }));

const trackingRoutes = express.Router();
trackingRoutes.get('/', (req, res) => res.json({ message: 'Tracking endpoint works!' }));

const reportRoutes = express.Router();
reportRoutes.get('/', (req, res) => res.json({ message: 'Reports endpoint works!' }));

// --------------------
// Serve frontend
// --------------------
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// --------------------
// SQL Server config
// --------------------
const dbConfig = {
    server: '.\\SQLEXPRESS',
    database: 'Food_Ordering_Website',
    driver: 'msnodesqlv8',
    options: { trustedConnection: true, trustServerCertificate: true }
};

sql.connect(dbConfig)
    .then(() => console.log('✅ Connected to SQL Server'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// --------------------
// Mount API routes
// --------------------
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Catch-all: serve frontend index.html for any other request
app.use((req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
