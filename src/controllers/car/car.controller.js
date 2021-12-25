const db = require("../../models");
const { successResponse, errorResponse } = require("../../helpers/index");
const { Company, Car, Route, Schedule, Seat, CarSeat, Line } = db;
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
      include: [
        {
          model: Line,
          as: "lines",
        },
      ],
      offset: (page - 1) * limit,
      limit,
    });
    return successResponse(req, res, { cars });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// const searchCar = async (req, res) => {
//   const {start, destination} = req.query;
//   //const destination = req.query.destination;
//   console.log(start);
//   console.log(destination);
//   //return successResponse(req, res, "ok");
//   const cars = await Route.findAll({ where: {
//       [Op.and]: {
//         starting_point: {
//           [Op.like]: '%' + start + '%'
//         },
//         destination: {
//           [Op.like]: '%' + destination + '%'
//         }
//       }}})
//   return successResponse(req, res, { cars });
// }
const searchCar = async (req, res) => {
  const {start, destination} = req.query;
  //const destination = req.query.destination;
  console.log(start);
  console.log(destination);
  //return successResponse(req, res, "ok");
  const cars = await Line.findAll({ 
    include: [
      {
        model: Car,
        as: "lines",
        //attributes:['name', 'station']
      },
    ],
    where: {
      [Op.or]: {
        start: {
          [Op.like]: '%' + start + '%'
        },
        destination: {
          [Op.like]: '%' + destination + '%'
        }
    }
  }})
  return successResponse(req, res, { cars });
}

const getCasesByFilteredRecord = async (req, res) => {
  try {
      const isAsc = "DESC";
      var where = [];
      var price = 2000000;
      // iterate over the params
      for (let q in req.query) {
          var obj = {};
          obj[q] = { [Op.eq]: req.query[q] };
          console.log(obj);
          // if q is discoveryMethod then the obj is { discoveryMethod: { [Op.eq]: req.query.discoveryMethod } }
          where.push(obj);
      }
      const cars = await Line.findAll({
          //attributes: { exclude: ['id', 'countryId', 'caseFullname', 'casePhone', 'createdAt', 'caseCommunityName', 'deletedAt'] },
          include: [
            {
              model: Car,
              as: "lines",
              where: { 
                price: {
                  [Op.lte]: price
                }
              },
              order: [['price', 'DESC']]
              //attributes:['name', 'station']
            },
          ],
          where: {
              [Op.or]: where // assign the "where" array here
          },
          limit: 10
      });
      if (cars.length === 0) {
          return res.json({
              message: 'There are no case records for this query. Please unselect some items.'
          })
      };
      // res.status(200);
      // res.json({
      //     message: 'Case query records retrieved.',
      //     data: filteredResult
      // });
      return successResponse(req, res, { cars });
  } catch (err) {
      console.log(err);
      res.status(500)
          .json({
              message: "There is an error retrieving case query records!",
              err
          });
  };
};

const tempTest = async (req, res) => {
  try {
      // var where = [];
      // // iterate over the params
      // for (let q in req.query) {
      //     var obj = {};
      //     obj[q] = { [Op.eq]: req.query[q] };
      //     console.log(obj);
      //     // if q is discoveryMethod then the obj is { discoveryMethod: { [Op.eq]: req.query.discoveryMethod } }
      //     where.push(obj);
      // }
      let start = req.query.start;
      let destination = req.query.destination;
      let price = req.query.price;
      //let delivery = req.query.delivery
      let options = { where: {} };
      if (start)
          options.where.start = start
      if (price)
          options.where.price = {$between: [0, price]}
      if (destination)
          options.where.destination = destination
      const cars = await Line.findAll({
          //attributes: { exclude: ['id', 'countryId', 'caseFullname', 'casePhone', 'createdAt', 'caseCommunityName', 'deletedAt'] },
          include: [
            {
              model: Car,
              as: "lines",
              //attributes:['name', 'station']
            },
          ],
          where: {
              [Op.or]: where // assign the "where" array here
          },
          order: [
              ['createdAt', 'DESC']
          ],
          limit: 10
      });
      if (cars.length === 0) {
          return res.json({
              message: 'There are no case records for this query. Please unselect some items.'
          })
      };
      // res.status(200);
      // res.json({
      //     message: 'Case query records retrieved.',
      //     data: filteredResult
      // });
      return successResponse(req, res, { cars });
  } catch (err) {
      console.log(err);
      res.status(500)
          .json({
              message: "There is an error retrieving case query records!",
              err
          });
  };
};
const getCar = async (req, res) => {
  try {
    const carId = req.params.carId;
    const car = await Car.findOne({
      where: { id: carId },
      include: [
        {
          model: CarSeat,
          as: "carseats",
        },
      ],
      // include: [
      //   {
      //     model: Line,
      //     as: "lines",
      //   },
      // ],
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
      station_to: req.body.station_to,
      price: req.body.price,
      image: req.body.image,
      status_trip: false,
      companyId: companyId,
    });
    let carseat = await CarSeat.createCarSeat(car);
    
    return successResponse(req, res, carseat);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const getCarOfCompany = async (req, res) => {
  try {
    const id = req.params.companyId;
    const cars = await Company.findAll({
      where: { id: id },
      include: [
        {
          model: Car,
          as: "cars",
        },
      ],
    });
    return successResponse(req, res, { cars });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

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

module.exports = { getAllCars, getCar, createCar, searchCar, updateCar, getCarOfCompany, getCasesByFilteredRecord };
