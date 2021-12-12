const express = require("express");
const validate = require("express-validation");
const router = express.Router();

const carController = require("../controllers/car/car.controller");
//const userValidate = require("../controllers/user/user.validate");

router.get("/", carController.getAllCars);
router.get("/:carId", carController.getCar);
router.get("/chien/search", carController.searchCar);
router.put("/:carId", carController.updateCar);

module.exports = router;
