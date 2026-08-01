const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MedicalAction = sequelize.define('medical_actions', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  medicalRecordId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'medical_record_id',
    references: { model: 'medical_records', key: 'id' }
  },
  actionName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'action_name'
  },
  actionDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'action_description'
  },
  cost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0
  }
});

module.exports = MedicalAction;
