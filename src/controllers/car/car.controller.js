const db = require("../../models");
const { successResponse, errorResponse } = require("../../helpers/index");
const { Company, Car, Route, Schedule, Seat } = db;
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
import Sequelize, { Op } from 'sequelize';

const getAllCars = async (req, res) => {
  try {
    console.log(req.query.page);
    const page = req.query.page || 1;
    const limit = 8;
    const cars = await Car.findAndCountAll({
      order: [
        ["createdAt", "DESC"],
        ["name", "ASC"],
      ],
      offset: (page - 1) * limit,
      limit,
    });
    return successResponse(req, res, { cars });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const searchCar = async (req, res) => {
  const {start, destination} = req.query;
  //const destination = req.query.destination;
  console.log(start);
  console.log(destination);
  //return successResponse(req, res, "ok");
  const cars = await Route.findAll({ where: {
      [Op.and]: {
        starting_point: {
          [Op.like]: '%' + start + '%'
        },
        destination: {
          [Op.like]: '%' + destination + '%'
        }
      }}})
  return successResponse(req, res, { cars });
}

const getCar = async (req, res) => {
  try {
    const carId = req.params.carId;
    const car = await Car.findOne({
      where: { id: carId },
      include: [
        {
          model: Seat,
          as: "seats",
        },
      ],
    });
    return successResponse(req, res, { car });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const createCar = async (req, res) => {
  try {
    const companyId = req.params.id;
    console.log(req.body.name);
    const company = await Company.findOne({ where: { id: companyId } });
    if (!company) {
      return res.send({ message: "Company not found!" });
    }
    const car = await Car.create({
      name: req.body.name,
      plate_number: req.body.plate_number,
      capacity: req.body.capacity,
      station: req.body.station,
      price: req.body.price,
      image: req.body.image,
      companyId: companyId,
    });
    return successResponse(req, res, "success");
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// const getCarOfCompany = (req, res) => {
//   const id = req.params.id;
//   Company.findByPk(id, {
//     include: [
//       {
//         model: Car,
//         as: "cars",
//       },
//     ],
//   })
//     .then((company) => {
//       if (!company) {
//         return res.status(404).json({ message: "Company Not Found" });
//       }

//       return res.status(200).json(company);
//     })
//     .catch((error) => {
//       return res.status(400).json(error);
//     });
// };

// const getCar = (req, res) => {
//   //const id = req.params.id;
//   const id = 1;

//   Car.findByPk(id)
//     .then((data) => {
//       if (data) {
//         res.send(data);
//       } else {
//         res.status(404).send({
//           message: `Cannot find Tutorial with id=${id}.`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error retrieving Tutorial with id=" + id,
//       });
//     });
// };

const updateCar = async (req, res) => {
  try {
    const carId = req.params.carId;
    const car = await Car.findOne({
      where: { id: carId },
    });
    await Car.update(
      { ...car, ...req.body },
      { where: { id: carId } }
    );

    return successResponse(req, res, "Car was updated successfully.");
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports = { getAllCars, getCar, createCar, searchCar, updateCar };
