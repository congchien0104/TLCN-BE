"use strict";
module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define(
    "Schedule",
    {
      carId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      routeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  Schedule.associate = function (models) {
    // associations can be defined here
  };
  return Schedule;
};
