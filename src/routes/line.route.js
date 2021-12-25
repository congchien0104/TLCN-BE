const express = require("express");
const validate = require("express-validation");
const router = express.Router();

const lineController = require("../controllers/line/line.controller");



router.post("/:id", lineController.createLine);

module.exports = router;