"use strict";
module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define(
    "Car",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      plate_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      station: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  Car.associate = function (models) {
    // associations can be defined here
    Car.hasMany(models.Seat, {
      foreignKey: {
        name: "carId",
        allowNull: false,
      },
      as: "seats",
    });

    Car.belongsTo(models.Company, {
      foreignKey: {
        name: "companyId",
        allowNull: false,
      },
      as: "cars",
    });

    Car.belongsToMany(models.Route, {
      through: "CarRoute",
      foreignKey: "carId",
      as: "routes",
    });
  };
  return Car;
};
