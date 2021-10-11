const express = require("express");
const validate = require("express-validation");
const router = express.Router();

const carController = require("../controllers/car/car.controller");
//const userValidate = require("../controllers/user/user.validate");

router.get("/", carController.getAllCars);
router.get("/:carId", carController.getCar);

module.exports = router;
