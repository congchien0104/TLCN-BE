const express = require("express");
const validate = require("express-validation");
const router = express.Router();

const feedbackController = require("../controllers/feedback/feedback.controller");
const userMiddleware = require("../../src/middleware/authJwt");

router.get("/", feedbackController.getAllFeedbacks);
//router.get("/:feedbackId", feedbackController.getFeedback);
router.get("/:carId", feedbackController.getFeedbackOfCar);
router.post(
  "/:carId",
  userMiddleware.verifyToken,
  feedbackController.createFeedback
);
router.put("/:id", feedbackController.updateFeedback);
router.delete("/:id", feedbackController.deleteFeedback);
// router.post("/:companyId/cars/", carController.createCar);

module.exports = router;
