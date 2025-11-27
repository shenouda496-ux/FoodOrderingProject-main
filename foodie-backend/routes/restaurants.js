const express = require("express");
const router = express.Router();
const RestaurantsController = require("../controller/restaurants.controller");

router.get("/", RestaurantsController.getAll);

module.exports = router;
