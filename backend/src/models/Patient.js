const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Patient = sequelize.define('patients', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  medicalRecordNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    field: 'medical_record_number'
  },
  nik: {
    type: DataTypes.STRING(16),
    allowNull: false,
    unique: true,
    validate: { len: [16, 16] }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('L', 'P'),
    allowNull: false
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'birth_date'
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Patient;
