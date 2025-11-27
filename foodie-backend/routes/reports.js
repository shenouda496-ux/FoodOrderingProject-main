const express = require("express");
const router = express.Router();
const ReportController = require("../controller/report.controller");

router.get("/", ReportController.getAll);

module.exports = router;
