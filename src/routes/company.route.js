const express = require("express");
const validate = require("express-validation");
const router = express.Router();

const companyController = require("../controllers/company/company.controller");
const carController = require("../controllers/car/car.controller");
//const userValidate = require("../controllers/user/user.validate");

router.get("/", companyController.getAllCompanies);
router.get("/:companyId", companyController.getCompany);
router.post("/", companyController.createCompany);
router.post("/cars/:id", carController.createCar);

module.exports = router;
