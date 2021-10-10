const db = require("../../models");
const { successResponse, errorResponse } = require("../../helpers/index");
const { Company, Car, Route, Schedule } = db;

const allCars = (req, res) => {
  Car.findAll({
    include: [
      {
        model: Route,
        as: "routes",
      },
    ],
  })
    .then((car) => {
      return res.status(200).json(car);
    })
    .catch((error) => {
      //console.log("ERROR: ", error);
      return res.status(400).json(error);
    });
};

const getCarOfCompany = (req, res) => {
  const id = req.params.id;
  Company.findByPk(id, {
    include: [
      {
        model: Car,
        as: "cars",
      },
    ],
  })
    .then((company) => {
      if (!company) {
        return res.status(404).json({ message: "Company Not Found" });
      }

      return res.status(200).json(company);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
};

const getCar = (req, res) => {
  //const id = req.params.id;
  const id = 1;

  Car.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tutorial with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};

module.exports = { allCars, getCar, getCarOfCompany };
