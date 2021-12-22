const express = require("express");
const validate = require("express-validation");
const router = express.Router();

const reservationController = require("../controllers/reservation/reservation.controller");
const paymentController = require("../controllers/payment/payment.controller");
const userMiddleware = require("../../src/middleware/authJwt");


router.get("/", reservationController.getAllReservations);
//router.get("/:reservationId", reservationController.getReservation);
router.get("/:carId", reservationController.getReservation);
router.get("/:userId", reservationController.getReservationOfUser);
//router.post("/:carId", reservationController.createReservation);
//router.get("/paypal", paymentController.doPaymentServicePackage);
//router.post("/createpaypal", paymentController.createPaypal);

module.exports = router;
