const db = require("../../models");
const randomstring = require("randomstring");
const { successResponse, errorResponse } = require("../../helpers/index");
const { User, Car, Reservation, Schedule, Route } = db;

const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    return successResponse(req, res, { reservations });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const getReservation = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const reservation = await Reservation.findOne({
      where: { id: reservationId },
      include: [
        {
          model: Car,
          as: "cars",
        },
      ],
    });
    return successResponse(req, res, { reservation });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const getReservationOfUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reservation = await Reservation.findOne({
      where: { userId: userId },
      include: [
        {
          model: Car,
          as: "cars",
        },
      ],
    });
    return successResponse(req, res, { reservation });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const createReservation = async (req, res) => {
  try {
    const { userId } = req.user;
    const carId = req.params.carId;

    const car = await Car.findOne({ where: { id: carId } });
    if (!car) {
      return res.send({ message: "Car not found!" });
    }

    const reservation = await Reservation.create({
      receipt_number: randomstring.generate(10),
      amount: req.body.amount,
      paid_amount: req.body.paid_amount,
      paid_date: req.body.paid_date,
      reservation_date: new Date(),
      carId: carId,
      userId: userId,
    });

    return successResponse(req, res, { reservation });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports = {
  getAllReservations,
  getReservation,
  getReservationOfUser,
  createReservation,
};
