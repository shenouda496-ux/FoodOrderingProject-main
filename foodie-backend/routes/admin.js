const express = require('express');
const router = express.Router();

// مؤقتًا عشان السيرفر يشتغل
router.get('/', (req, res) => {
    res.send('Admin route works!');
});

module.exports = router;
