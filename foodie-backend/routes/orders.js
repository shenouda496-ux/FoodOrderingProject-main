

const express = require("express");
const router = express.Router();
const OrdersController = require("../controller/orders.controller");

router.get("/", OrdersController.getAll);
router.post("/", OrdersController.create);

module.exports = router;
