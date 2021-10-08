const express = require("express");
const validate = require("express-validation");
const router = express.Router();

const userController = require("../controllers/user/user.controller");
const userValidate = require("../controllers/user/user.validate");

router.get("/allUsers", userController.allUsers);
router.get("/me", userController.profile);
router.post("/update", userController.update);
router.post(
  "/changePassword",
  validate(userValidate.changePassword),
  userController.changePassword
);

module.exports = router;
