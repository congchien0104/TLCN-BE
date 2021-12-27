const express = require("express");
const validate = require("express-validation");
const router = express.Router();

const reservationController = require("../controllers/reservation/reservation.controller");
const paymentController = require("../controllers/payment/payment.controller");
const userMiddleware = require("../../src/middleware/authJwt");


router.get("/", reservationController.getAllReservations);
router.get("/user/:reservationId", reservationController.getReservationOfUser);
router.get("/test/:carId", reservationController.getReservation);
router.get("/:carId", reservationController.getReservationOfCar);
//router.post("/:carId", reservationController.createReservation);
//router.get("/paypal", paymentController.doPaymentServicePackage);
//router.post("/createpaypal", paymentController.createPaypal);

module.exports = router;
