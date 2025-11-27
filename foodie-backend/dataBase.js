// db.js
const sql = require("mssql");

const config = {
    user: "",           // عادة sa
    password: "",       
    server: "./SQLEXPRESS",             // أو اسم السيرفر
    database: "Food_Ordering_Website",
    options: {
        encrypt: false,             // لو على Local SQL Server ممكن false
        trustServerCertificate: true
    }
};


const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Connected to SQL Server");
        return pool;
    })
    .catch(err => console.log("DB Connection Failed:", err));

module.exports = { sql, poolPromise };
