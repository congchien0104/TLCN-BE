const express = require("express");
const validate = require("express-validation");
const router = express.Router();

const reservationController = require("../controllers/reservation/reservation.controller");

router.get("/", reservationController.getAllReservations);
//router.get("/:reservationId", reservationController.getReservation);
router.get("/:userId", reservationController.getReservationOfUser);
router.post("/:carId", reservationController.createReservation);

module.exports = router;
