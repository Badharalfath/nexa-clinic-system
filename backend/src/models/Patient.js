const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Auto-generate medical record number: RM-YYYYMM-XXXX (mirror of SQL trigger)
async function generateMedicalRecordNumber(patient) {
  if (patient.medicalRecordNumber) return;
  const prefix = `RM-${new Date().toISOString().slice(0, 7).replace('-', '')}`;
  const last = await Patient.findOne({
    where: { medicalRecordNumber: { [sequelize.Sequelize.Op.like]: `${prefix}-%` } },
    order: [['medicalRecordNumber', 'DESC']],
    attributes: ['medicalRecordNumber'],
    paranoid: false,
  });
  let seq = 1;
  if (last) {
    const parts = last.medicalRecordNumber.split('-');
    seq = parseInt(parts[parts.length - 1], 10) + 1;
  }
  patient.medicalRecordNumber = `${prefix}-${String(seq).padStart(4, '0')}`;
}

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
}, {
  paranoid: true,
  hooks: {
    //Must run beforevalidate (Sequelize validates before beforeCreate)
    beforeValidate: generateMedicalRecordNumber
  }
});

module.exports = Patient;
