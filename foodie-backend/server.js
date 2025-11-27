// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sql = require('mssql/msnodesqlv8'); // Windows Authentication
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// Serve frontend
// --------------------
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));
app.use(express.static(path.join(__dirname, 'public')));


// --------------------
// Multer (image uploads to public/images)
// --------------------
const uploadDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.random().toString(36).slice(2,8);
    const ext = path.extname(file.originalname) || '.jpeg';
    cb(null, `${unique}${ext}`); // ✅ لازم backticks هنا
  }
});
const upload = multer({ storage });

// Route لرفع الصور
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    res.json({
      message: '✅ Image uploaded successfully',
      filename: req.file.filename,
      url: `/images/${req.file.filename}`
    });
  } catch (err) {
    console.error('❌ Error uploading image:', err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// SQL Server config
// --------------------
const dbConfig = {
    server: '.\\SQLEXPRESS',
    database: 'Food_Ordering_Website',
    driver: 'msnodesqlv8',
    options: { trustedConnection: true, trustServerCertificate: true }
};

// Connect once at startup
sql.connect(dbConfig)
    .then(() => console.log('✅ Connected to SQL Server'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// --------------------
// API routes
// --------------------

// Register
app.post('/api/auth/register', async (req, res) => {
  const { full_name, email, phone, password } = req.body;
  try {
    await sql.query`
      INSERT INTO users (full_name, email, phone, password)
      VALUES (${full_name}, ${email}, ${phone}, ${password})
    `;
    res.json({ message: '✅ User registered successfully' });
  } catch (err) {
    console.error('❌ Error in /api/auth/register:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await sql.query`
      SELECT * FROM users WHERE Email=${email} AND Password=${password}
    `;
    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      res.json({ message: '✅ Login successful', userId: user.UserId });
    } else {
      res.status(401).json({ message: '❌ Invalid credentials' });
    }
  } catch (err) {
    console.error('❌ Error in /api/auth/login:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await sql.query`
      SELECT * FROM admins WHERE Email=${email} AND Password=${password}
    `;
    if (result.recordset.length > 0) {
      const admin = result.recordset[0];
      res.json({ message: '✅ Admin login successful', adminId: admin.AdminId });
    } else {
      res.status(401).json({ message: '❌ Invalid admin credentials' });
    }
  } catch (err) {
    console.error('❌ Error in /api/admin/login:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin route
app.get('/api/admin', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM admins`;
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error in /api/admin:', err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Restaurants routes
// --------------------
app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await sql.query`
      SELECT restaurant_id, name, description, location, phone, image, created_at
      FROM restaurants
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error in /api/restaurants:', err);
    res.status(500).json({ error: err.message });
  }
});

// Single restaurant info
app.get('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.query`
      SELECT restaurant_id, name, description, location, phone, image, created_at
      FROM restaurants
      WHERE restaurant_id = ${id}
    `;
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ error: 'Restaurant not found' });
    }
  } catch (err) {
    console.error('❌ Error in /api/restaurants/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Menu route (by restaurant)
// --------------------
app.get('/api/menu/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await sql.query`
      SELECT d.dish_id, d.name, d.description, d.price, d.image, c.name AS category
      FROM dishes d
      INNER JOIN categories c 
        ON d.category_id = c.category_id AND d.restaurant_id = c.restaurant_id
      WHERE d.restaurant_id = ${restaurantId}
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error in /api/menu/:restaurantId:', err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Other routes (dishes, orders, ratings, tracking, reports)
// --------------------
app.get('/api/dishes', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM dishes`;
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error in /api/dishes:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dishes', async (req, res) => {
  const { name, price, description, image, restaurant_id } = req.body;
  try {
    await sql.query`
      INSERT INTO dishes (name, price, description, image, restaurant_id)
      VALUES (${name}, ${price}, ${description}, ${image}, ${restaurant_id})
    `;
    res.json({ message: '✅ Dish added successfully' });
  } catch (err) {
    console.error('❌ Error in /api/dishes (POST):', err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Health check
// --------------------
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// --------------------
// Catch-all: serve frontend index.html
// --------------------
app.use((req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
