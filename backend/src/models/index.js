const User = require('./User');
const Patient = require('./Patient');
const Polyclinic = require('./Polyclinic');
const Registration = require('./Registration');
const Queue = require('./Queue');
const MedicalRecord = require('./MedicalRecord');
const MedicalAction = require('./MedicalAction');
const Prescription = require('./Prescription');

// User -> Registrations (as doctor)
User.hasMany(Registration, { foreignKey: 'doctor_id', as: 'registrations' });
Registration.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctor' });

// User -> MedicalRecords (as doctor)
User.hasMany(MedicalRecord, { foreignKey: 'doctor_id', as: 'medicalRecords' });
MedicalRecord.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctor' });

// Patient -> Registrations
Patient.hasMany(Registration, { foreignKey: 'patient_id', as: 'registrations' });
Registration.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });

// Patient -> MedicalRecords
Patient.hasMany(MedicalRecord, { foreignKey: 'patient_id', as: 'medicalRecords' });
MedicalRecord.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });

// Polyclinic -> Registrations
Polyclinic.hasMany(Registration, { foreignKey: 'polyclinic_id', as: 'registrations' });
Registration.belongsTo(Polyclinic, { foreignKey: 'polyclinic_id', as: 'polyclinic' });

// Registration -> Queue (one-to-one)
Registration.hasOne(Queue, { foreignKey: 'registration_id', as: 'queue' });
Queue.belongsTo(Registration, { foreignKey: 'registration_id', as: 'registration' });

// Registration -> MedicalRecord (one-to-one)
Registration.hasOne(MedicalRecord, { foreignKey: 'registration_id', as: 'medicalRecord' });
MedicalRecord.belongsTo(Registration, { foreignKey: 'registration_id', as: 'registration' });

// MedicalRecord -> MedicalActions
MedicalRecord.hasMany(MedicalAction, { foreignKey: 'medical_record_id', as: 'medicalActions' });
MedicalAction.belongsTo(MedicalRecord, { foreignKey: 'medical_record_id', as: 'medicalRecord' });

// MedicalRecord -> Prescriptions
MedicalRecord.hasMany(Prescription, { foreignKey: 'medical_record_id', as: 'prescriptions' });
Prescription.belongsTo(MedicalRecord, { foreignKey: 'medical_record_id', as: 'medicalRecord' });

module.exports = {
  User,
  Patient,
  Polyclinic,
  Registration,
  Queue,
  MedicalRecord,
  MedicalAction,
  Prescription
};
