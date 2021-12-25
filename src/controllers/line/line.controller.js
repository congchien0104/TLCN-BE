const db = require("../../models");
const { successResponse, errorResponse } = require("../../helpers/index");
const { Company, Car, Line } = db;


const createLine = async (req, res) => {
  try {
    const carId = req.params.id;
    console.log(carId);
    const car = await Car.findOne({ where: { id: carId } });
    if (!car) {
      return res.send({ message: "Car not found!" });
    }
    const temp = req.body.weekdays;
    const line = await Line.create({
      carId: carId,
      start: req.body.start,
      destination: req.body.destination,
      departure_time: req.body.departure_time,
      arrival_time: req.body.arrival_time,
      innitiated_date: req.body.innitiated_date,
      weekdays: temp.join(","),
      status_trip: false,
      start_route_trip: req.body.start_route_trip,
      des_route_trip: req.body.des_route_trip,
    });
    return successResponse(req, res, { line });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports = {
    createLine
};
