const express = require("express");
const validate = require("express-validation");
const router = express.Router();

const carController = require("../controllers/car/car.controller");
//const userValidate = require("../controllers/user/user.validate");

router.get("/allcars", carController.allCars);
//router.get("/", carController.getCar);
router.get("/company/:id", carController.getCarOfCompany);

module.exports = router;
