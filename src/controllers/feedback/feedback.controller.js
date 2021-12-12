const db = require("../../models");
const { successResponse, errorResponse } = require("../../helpers/index");
const { User, Car, Feedback } = db;

const getAllFeedbacks = async (req, res) => {
  try {
    console.log(req.query.page);
    const page = req.query.page || 1;
    const limit = 8;
    const feedbacks = await Feedback.findAndCountAll({
      order: [
        ["createdAt", "DESC"],
        ["rating", "ASC"],
      ],
      offset: (page - 1) * limit,
      limit,
    });
    return successResponse(req, res, { feedbacks });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};


const getFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId;
    const feedback = await Feedback.findOne({
      where: { id: feedbackId },
      include: [
        {
          model: Car,
          as: "fbacks",
        },
      ],
    });
    return successResponse(req, res, { feedback });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const getFeedbackOfCar = async (req, res) => {
  try {
    const carId = req.params.carId;
    const feedback = await Car.findOne({
      where: { id: carId },
      include: [
        {
          model: Feedback,
          as: "feedbacks",
          include: [
            {
              model: User,
              as: "feedbacks",
            },
          ],
        },
      ],
    });
    return successResponse(req, res, { feedback });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const createFeedback = async (req, res) => {
  try {
    const { userId } = req.user;
    const carId = req.params.carId;

    const car = await Car.findOne({ where: { id: carId } });
    if (!car) {
      return res.send({ message: "Car not found!" });
    }

    const feedback = await Feedback.create({
      content: req.body.content,
      rating: req.body.rating,
      carId: carId,
      userId: userId,
    });

    return successResponse(req, res, { feedback });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const updateFeedback = async (req, res) => {
  try {
    var { userId } = req.user;
    const feedbackId = req.params.id;
    const fb = await Feedback.findOne({
      where: { id: feedbackId, userId: userId },
    });
    if (!fb) {
      return res.status(400).send({ message: "Feedback not found!" });
    }
    await Feedback.update(
      { ...fb, ...req.body },
      { where: { id: feedbackId } }
    );

    return successResponse(req, res, "Feedback was updated successfully.");
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const deleteFeedback = async (req, res) => {
  try {
    var { userId } = req.user;
    const feedbackId = req.params.id;
    const fb = await Feedback.findOne({
      where: { id: feedbackId, userId: userId },
    });
    if (!fb) {
      return res.status(400).send({ message: "Feedback not found!" });
    }
    await Feedback.destroy({ where: { id: feedbackId } });
    return successResponse(req, res, "Feedback was deleted successfully!");
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports = {
  getAllFeedbacks,
  getFeedback,
  getFeedbackOfCar,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};
