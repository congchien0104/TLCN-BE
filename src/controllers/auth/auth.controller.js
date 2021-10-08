const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../models");
const config = require("../../config/auth");
const nodemailer = require("../../config/nodemailer");
const { successResponse, errorResponse } = require("../../helpers/index");
//const user = require("../../models/user");

const { User, Role, RefreshToken } = db;

const Op = db.Sequelize.Op;

exports.signup = (req, res) => {
  const token = jwt.sign({ email: req.body.email }, config.secret);

  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    confirmationcode: token,
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({
              message:
                "User was registered successfully! Please check your email",
            });
            //return successResponse(req, res, user);
            nodemailer.sendConfirmationEmail(
              user.username,
              user.email,
              user.confirmationcode
            );
            //res.redirect("/");
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({
            message:
              "User was registered successfully! Please check your email",
          });
          //return successResponse(req, res, user);
          nodemailer.sendConfirmationEmail(
            user.username,
            user.email,
            user.confirmationcode
          );
          //res.redirect("/");
        });
      }
    })
    .catch((err) => {
      //   res.status(500).send({
      //     message: err.message,
      //   });
      return errorResponse(req, res, err.message);
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      if (user.verified != "Pending") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }

      var token = jwt.sign(
        {
          user: {
            userId: user.id,
            email: user.email,
            createdAt: new Date(),
          },
        },
        config.secret,
        {
          expiresIn: config.jwtExpiration, // 24 hours
        }
      );

      let refreshToken = await RefreshToken.createToken(user);

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.verifyUser = async (req, res) => {
  res.send("ok");
  try {
    console.log(req.params.confirmationcode);
    const user = await User.findOne({
      where: { confirmationcode: req.params.confirmationcode },
    });
    if (!user) {
      return res.send("User not found!");
    }
    await User.update(
      {
        verified: "Active",
      },
      { where: { id: user.id } }
    );
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

exports.refreshToken = async (req, res) => {
  //res.send("cong chien");
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });

    console.log(refreshToken);

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

// Test one - one, User - RefreshToken
exports.show = (req, res) => {
  User.findByPk(req.body.id, {
    include: [
      {
        model: RefreshToken,
        as: "refreshtoken",
      },
    ],
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }

      return res.status(200).json(user);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
};

exports.getRefreshToken = (req, res) => {
  RefreshToken.findByPk(req.body.q, {
    include: [
      {
        model: User,
        as: "rftoken",
      },
    ],
  })
    .then((rtoken) => {
      console.log(rtoken);
      return res.send(rtoken);
    })
    .catch((err) => {
      console.log(">> Error while finding rtoken: ", err);
      return res.status(400).json(err);
    });
};

exports.index = (req, res) => {
  User.findAll({
    include: [
      {
        model: RefreshToken,
        as: "refreshtoken",
      },
    ],
  })
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((error) => {
      console.log("ERROR: ", error);
      return res.status(400).json(error);
    });
};
