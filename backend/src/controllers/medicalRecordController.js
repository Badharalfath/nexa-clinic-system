const { MedicalRecord, MedicalAction, Prescription, Registration, Patient, User, Polyclinic } = require('../models');
const ApiResponse = require('../utils/apiResponse');

const createMedicalRecord = async (req, res) => {
  try {
    const { registrationId, patientId, doctorId, subjective, objectiveBloodPressure,
      objectiveTemperature, objectiveWeight, objectiveHeight, assessment, plan,
      medicalActions, prescriptions } = req.body;

    // Check if record already exists for this registration
    const existing = await MedicalRecord.findOne({ where: { registrationId } });
    if (existing) {
      return ApiResponse.badRequest(res, 'Medical record already exists for this registration');
    }

    const record = await MedicalRecord.create({
      registrationId, patientId, doctorId, subjective,
      objectiveBloodPressure, objectiveTemperature, objectiveWeight, objectiveHeight,
      assessment, plan
    });

    // Create medical actions
    if (medicalActions && medicalActions.length > 0) {
      await MedicalAction.bulkCreate(
        medicalActions.map(a => ({ ...a, medicalRecordId: record.id }))
      );
    }

    // Create prescriptions
    if (prescriptions && prescriptions.length > 0) {
      await Prescription.bulkCreate(
        prescriptions.map(p => ({ ...p, medicalRecordId: record.id }))
      );
    }

    // Update registration and queue status to 'selesai'
    await Registration.update({ status: 'selesai' }, { where: { id: registrationId } });
    const { Queue } = require('../models');
    await Queue.update({ status: 'selesai' }, { where: { registrationId } });

    const result = await MedicalRecord.findByPk(record.id, {
      include: [
        { model: MedicalAction, as: 'medicalActions' },
        { model: Prescription, as: 'prescriptions' },
        { model: Patient, as: 'patient', attributes: ['id', 'medicalRecordNumber', 'name'] },
        { model: User, as: 'doctor', attributes: ['id', 'name'] }
      ]
    });

    return ApiResponse.created(res, result, 'Medical record created successfully');
  } catch (error) {
    console.error('Create medical record error:', error);
    return ApiResponse.error(res, 'Failed to create medical record');
  }
};

const getPatientMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await MedicalRecord.findAll({
      where: { patientId },
      include: [
        { model: MedicalAction, as: 'medicalActions' },
        { model: Prescription, as: 'prescriptions' },
        { model: User, as: 'doctor', attributes: ['id', 'name'] },
        {
          model: Registration, as: 'registration',
          include: [{ model: Polyclinic, as: 'polyclinic', attributes: ['id', 'name'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return ApiResponse.success(res, records);
  } catch (error) {
    console.error('Get medical records error:', error);
    return ApiResponse.error(res, 'Failed to fetch medical records');
  }
};

const getMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id, {
      include: [
        { model: MedicalAction, as: 'medicalActions' },
        { model: Prescription, as: 'prescriptions' },
        { model: Patient, as: 'patient' },
        { model: User, as: 'doctor', attributes: ['id', 'name'] },
        { model: Registration, as: 'registration' }
      ]
    });
    if (!record) return ApiResponse.notFound(res, 'Medical record not found');
    return ApiResponse.success(res, record);
  } catch (error) {
    console.error('Get medical record error:', error);
    return ApiResponse.error(res, 'Failed to fetch medical record');
  }
};

module.exports = { createMedicalRecord, getPatientMedicalRecords, getMedicalRecord };
