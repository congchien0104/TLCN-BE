const bcrypt = require("bcryptjs");
const db = require("../../models");
const { successResponse, errorResponse } = require("../../helpers/index");
const { User } = db;

const allUsers = async (req, res) => {
  try {
    const page = req.params.page || 1;
    const limit = 2;
    const users = await User.findAndCountAll({
      order: [
        ["createdAt", "DESC"],
        ["username", "ASC"],
      ],
      offset: (page - 1) * limit,
      limit,
    });
    return successResponse(req, res, { users });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const profile = async (req, res) => {
  try {
    const { userId } = req.user;
    //console.log(req.user);
    const user = await User.findOne({ where: { id: userId } });
    return successResponse(req, res, { user });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const update = (req, res) => {
  const { userId } = req.user;

  User.update(req.body, {
    where: { id: userId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with userId=${userId}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with userId=" + userId,
      });
    });
  // try {
  //   const { userId } = req.user;
  //   console.log(userId);
  //   const user = await User.findOne({ where: { id: userId } });
  //   if (!user) {
  //     return res.send("User not found!");
  //   }
  //   await User.update(
  //     {
  //       firstname: req.body.firstname,
  //       fullname: req.body.fullname,
  //       phone: req.body.phone,
  //       address: req.body.address,
  //     },
  //     { where: { id: userId } }
  //   );
  //   return successResponse(req, res, {});
  // } catch (error) {
  //   return errorResponse(req, res, error.message);
  // }
};

const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log(userId);
    const user = await User.findOne({
      where: { id: userId },
    });

    const passwordIsValid = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Old password is incorrect",
      });
    }
    console.log(passwordIsValid);

    const newPass = bcrypt.hashSync(req.body.newPassword, 8);

    await User.update({ password: newPass }, { where: { id: userId } });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports = { allUsers, profile, update, changePassword };
