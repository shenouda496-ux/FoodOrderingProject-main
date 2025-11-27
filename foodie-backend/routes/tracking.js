const express = require("express");
const router = express.Router();
const TrackingController = require("../controller/tracking.controller");

router.get("/", TrackingController.getAll);

module.exports = router;
