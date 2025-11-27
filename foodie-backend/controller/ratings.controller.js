const sql = require('mssql/msnodesqlv8');

// GET: عرض كل التقييمات
exports.getAll = async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM ratings`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST: إضافة تقييم جديد
exports.create = async (req, res) => {
  const { userId, dishId, rating, comment } = req.body;
  try {
    await sql.query`
      INSERT INTO ratings (UserId, DishId, Rating, Comment) 
      VALUES (${userId}, ${dishId}, ${rating}, ${comment})
    `;
    res.json({ message: '✅ Rating added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
