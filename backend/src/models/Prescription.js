const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Prescription = sequelize.define('prescriptions', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  drugName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'drug_name'
  },
  dosage: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Prescription;
