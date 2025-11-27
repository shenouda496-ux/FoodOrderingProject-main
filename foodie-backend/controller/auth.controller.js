

const sql = require('mssql/msnodesqlv8');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    await sql.query`INSERT INTO users (Username, Password) VALUES (${username}, ${password})`;
    res.json({ message: '✅ User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await sql.query`SELECT * FROM users WHERE Username=${username} AND Password=${password}`;
    if (result.recordset.length > 0) {
      res.json({ message: '✅ Login successful' });
    } else {
      res.status(401).json({ message: '❌ Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
