"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
      },
      fullname: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.INTEGER,
      },
      address: {
        type: DataTypes.STRING,
      },
      verified: {
        type: DataTypes.ENUM("Pending", "Active"),
        defaultValue: "Pending",
      },
      confirmationcode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {}
  );
  User.associate = function (models) {
    // associations can be defined here
    User.belongsToMany(models.Role, {
      through: "Roleuser",
      foreignKey: "userId",
      as: "roles",
    });

    User.hasOne(models.RefreshToken, {
      foreignKey: "userId",
      as: "refreshtoken",
    });
    User.hasMany(models.Feedback, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      as: "feedbacks",
    });
  };
  return User;
};
