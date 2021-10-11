const db = require("../../models");
const { successResponse, errorResponse } = require("../../helpers/index");
const { Company, Car, Route, Schedule } = db;

// Get all Company

const getAllCompanies = async (req, res) => {
  try {
    // const page = req.params.page || 1;
    // const limit = 2;
    // const companies = await Company.findAndCountAll({
    //   order: [
    //     ["createdAt", "DESC"],
    //     ["name", "ASC"],
    //   ],
    //   offset: (page - 1) * limit,
    //   limit,
    // });
    const companies = await Company.findAll();
    return successResponse(req, res, { companies });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const getCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    console.log(companyId);
    const company = await Company.findOne({
      where: { id: companyId },
      include: [
        {
          model: Car,
          as: "cars",
        },
      ],
    });
    return successResponse(req, res, { company });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const createCompany = async (req, res) => {
  try {
    const company = await Company.create({
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
    });
    return successResponse(req, res, { company });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports = { getAllCompanies, getCompany, createCompany };
