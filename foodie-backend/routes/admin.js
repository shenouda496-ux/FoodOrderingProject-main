


const express = require("express");
const router = express.Router();
const AdminController = require("../controller/admin.controller");

router.get("/", AdminController.getAll);

module.exports = router;
