


const sql = require('mssql/msnodesqlv8');

exports.getAll = async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM orders`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { userId, dishId, quantity } = req.body;
  try {
    await sql.query`INSERT INTO order_items (OrderId, DishId, Quantity) VALUES (${userId}, ${dishId}, ${quantity})`;
    res.json({ message: '✅ Order created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
