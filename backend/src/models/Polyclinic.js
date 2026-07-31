const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Polyclinic = sequelize.define('polyclinics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Polyclinic;
