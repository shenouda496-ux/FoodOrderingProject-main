const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sql = require("mssql/msnodesqlv8");
const dbConfig = require("../dataBase"); // تأكد من مسار ملف config

module.exports = {

  register: async ({ username, email, password }) => {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    if (result.recordset.length) throw new Error("Email already used");

    const hash = await bcrypt.hash(password, 10);

    await pool.request()
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hash)
      .query('INSERT INTO users (username, email, password) VALUES (@username, @email, @password)');

    return { message: "User registered successfully" };
  },

  login: async ({ email, password }) => {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    if (!result.recordset.length) throw new Error("User not found");

    const valid = await bcrypt.compare(password, result.recordset[0].password);
    if (!valid) throw new Error("Wrong password");

    const token = jwt.sign(
      { id: result.recordset[0].id, email: result.recordset[0].email },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    return { message: "Login successful", token };
  }

};
