const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MedicalRecord = sequelize.define('medical_records', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // SOAP: Subjective
  subjective: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // SOAP: Objective
  objectiveBloodPressure: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'objective_blood_pressure'
  },
  objectiveTemperature: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
    field: 'objective_temperature'
  },
  objectiveWeight: {
    type: DataTypes.DECIMAL(5, 1),
    allowNull: true,
    field: 'objective_weight'
  },
  objectiveHeight: {
    type: DataTypes.DECIMAL(5, 1),
    allowNull: true,
    field: 'objective_height'
  },
  // SOAP: Assessment
  assessment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // SOAP: Plan
  plan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = MedicalRecord;
