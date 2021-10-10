"use strict";
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  Company.associate = function (models) {
    // associations can be defined here
    Company.hasMany(models.Car, {
      foreignKey: {
        name: "companyId",
        allowNull: false,
      },
      as: "cars",
    });
  };
  return Company;
};
