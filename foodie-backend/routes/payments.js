const express = require("express");
const router = express.Router();
const PaymentsController = require("../controller/payments.controller");

router.get("/", PaymentsController.getAll);

module.exports = router;
