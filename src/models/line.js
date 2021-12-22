'use strict';
module.exports = (sequelize, DataTypes) => {
  const Line = sequelize.define('Line', {
    start: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departure_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    arrival_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    innitiated_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    weekdays: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_trip: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    start_route_trip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    des_route_trip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Line.associate = function(models) {
    Line.belongsTo(models.Car, {
      foreignKey: {
        name: 'carId',
        allowNull: false
      },
      as: 'lines'
    });
  };
  return Line;
};