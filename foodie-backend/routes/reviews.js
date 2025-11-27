const express = require("express");
const router = express.Router();
const ReviewsController = require("../controller/reviews.controller");

router.get("/", ReviewsController.getAll);

module.exports = router;
