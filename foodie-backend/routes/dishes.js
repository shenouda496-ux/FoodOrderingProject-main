const express = require("express");
const router = express.Router();
const DishesController = require("../controller/dishes.controller");

router.get("/", DishesController.getAll);

module.exports = router;
