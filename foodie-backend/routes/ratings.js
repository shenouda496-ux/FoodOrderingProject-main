const express = require("express");
const router = express.Router();
const RatingsController = require("../controller/ratings.controller");

// عرض كل التقييمات
router.get("/", RatingsController.getAll);

// إضافة تقييم جديد
router.post("/", RatingsController.create);

module.exports = router;
