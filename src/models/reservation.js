"use strict";
const randomstring = require("randomstring");
module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    "Reservation",
    {
      receipt_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paid_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paid_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reservation_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  Reservation.associate = function (models) {
    // associations can be defined here
    Reservation.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      as: "users",
    });
    Reservation.belongsTo(models.Car, {
      foreignKey: {
        name: "carId",
        allowNull: false,
      },
      as: "cars",
    });
  };
  Reservation.createReservation = async function (data) {
    let reservation = await this.create({
      receipt_number: randomstring.generate(10),
      amount: data.amount,
      paid_amount: data.paid_amount || 0,
      paid_date: new Date(),
      reservation_date: new Date(),
      carId: carId,
      userId: userId,
      quantity: data.quantity,
      fullname: data.fullname,
      phone: data.phone,
      email: data.email,
    });

    return reservation;
  };
  return Reservation;
};
