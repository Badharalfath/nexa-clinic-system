const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Registration = sequelize.define('registrations', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  registrationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'registration_date'
  },
  paymentType: {
    type: DataTypes.ENUM('umum', 'bpjs', 'asuransi'),
    allowNull: false,
    field: 'payment_type'
  },
  complaint: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('menunggu', 'check_in', 'pemeriksaan', 'selesai'),
    allowNull: false,
    defaultValue: 'menunggu'
  }
});

module.exports = Registration;
