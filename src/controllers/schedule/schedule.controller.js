const db = require("../../models");
const { successResponse, errorResponse } = require("../../helpers/index");
const { Company, Car, Route, Schedule, Seat } = db;

const getAllRoutes = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      include: [
        {
          model: Car,
          as: "schedules",
        },
      ],
    });
    return successResponse(req, res, { schedules });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const getRoute = async (req, res) => {
  try {
    const routeId = req.params.routeId;
    const route = await Route.findOne({
      where: { id: routeId },
      include: [
        {
          model: Schedule,
          as: "lines",
          include: [
            {
              model: Car,
              as: "schedules",
            },
          ],
        },
      ],
    });
    return successResponse(req, res, { route });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports = { getAllRoutes, getRoute };
