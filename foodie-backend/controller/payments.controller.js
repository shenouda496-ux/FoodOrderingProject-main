const sql = require('mssql/msnodesqlv8');

exports.getAll = async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM payments`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
