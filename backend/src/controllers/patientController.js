const { Op } = require('sequelize');
const { Patient } = require('../models');
const ApiResponse = require('../utils/apiResponse');

const getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { nik: { [Op.iLike]: `%${search}%` } },
        { medicalRecordNumber: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Patient.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return ApiResponse.success(res, {
      patients: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Get patients error:', error);
    return ApiResponse.error(res, 'Failed to fetch patients');
  }
};

const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return ApiResponse.notFound(res, 'Patient not found');
    }
    return ApiResponse.success(res, patient);
  } catch (error) {
    console.error('Get patient error:', error);
    return ApiResponse.error(res, 'Failed to fetch patient');
  }
};

const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    return ApiResponse.created(res, patient, 'Patient created successfully');
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors?.[0]?.path;
      const message = field === 'nik' ? 'NIK already exists' : `${field} already exists`;
      return ApiResponse.badRequest(res, message, error.errors);
    }
    console.error('Create patient error:', error);
    return ApiResponse.error(res, 'Failed to create patient');
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return ApiResponse.notFound(res, 'Patient not found');
    }
    await patient.update(req.body);
    return ApiResponse.success(res, patient, 'Patient updated successfully');
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return ApiResponse.badRequest(res, 'NIK already exists', error.errors);
    }
    console.error('Update patient error:', error);
    return ApiResponse.error(res, 'Failed to update patient');
  }
};

const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return ApiResponse.notFound(res, 'Patient not found');
    }
    // Soft delete (paranoid): patient diarsipkan, semua data terkait tetap tersimpan
    await patient.destroy();
    return ApiResponse.success(res, null, 'Patient archived successfully');
  } catch (error) {
    console.error('Delete patient error:', error);
    return ApiResponse.error(res, 'Failed to delete patient');
  }
};

// Hitung data terkait pasien (untuk dialog konfirmasi)
const getPatientRelatedCounts = async (req, res) => {
  try {
    const { Registration, MedicalRecord, Prescription, MedicalAction, Queue } = require('../models');
    const patient = await Patient.findByPk(req.params.id, { paranoid: false });
    if (!patient) {
      return ApiResponse.notFound(res, 'Patient not found');
    }
    const patientId = patient.id;

    const [registrations, medicalRecords] = await Promise.all([
      Registration.count({ where: { patient_id: patientId } }),
      MedicalRecord.count({ where: { patient_id: patientId } }),
    ]);

    const recordIds = (
      await MedicalRecord.findAll({
        where: { patient_id: patientId },
        attributes: ['id'],
        paranoid: false,
        raw: true,
      })
    ).map((r) => r.id);

    const [prescriptions, medicalActions, queues] = await Promise.all([
      recordIds.length ? Prescription.count({ where: { medical_record_id: recordIds } }) : 0,
      recordIds.length ? MedicalAction.count({ where: { medical_record_id: recordIds } }) : 0,
      Registration.count({
        where: { patient_id: patientId },
        include: [{ model: Queue, as: 'queue', required: true, paranoid: false }],
      }),
    ]);

    return ApiResponse.success(res, {
      registrations,
      medicalRecords,
      prescriptions,
      medicalActions,
      queues,
    });
  } catch (error) {
    console.error('Get patient related counts error:', error);
    return ApiResponse.error(res, 'Failed to fetch patient related counts');
  }
};

// Hapus permanen: cascade semua data terkait (khusus admin, konfirmasi ketik di frontend)
const permanentDeletePatient = async (req, res) => {
  const { sequelize } = require('../config/database');
  const { Registration, MedicalRecord, Prescription, MedicalAction, Queue } = require('../models');
  const transaction = await sequelize.transaction();
  try {
    const patient = await Patient.findByPk(req.params.id, { paranoid: false, transaction });
    if (!patient) {
      await transaction.rollback();
      return ApiResponse.notFound(res, 'Patient not found');
    }
    const patientId = patient.id;

    const registrations = await Registration.findAll({
      where: { patient_id: patientId },
      paranoid: false,
      transaction,
      raw: true,
    });
    const registrationIds = registrations.map((r) => r.id);
    const medicalRecords = await MedicalRecord.findAll({
      where: { patient_id: patientId },
      paranoid: false,
      transaction,
      raw: true,
    });
    const recordIds = medicalRecords.map((r) => r.id);

    if (recordIds.length) {
      await Prescription.destroy({ where: { medical_record_id: recordIds }, force: true, transaction });
      await MedicalAction.destroy({ where: { medical_record_id: recordIds }, force: true, transaction });
      await MedicalRecord.destroy({ where: { id: recordIds }, force: true, transaction });
    }
    if (registrationIds.length) {
      await Queue.destroy({ where: { registration_id: registrationIds }, force: true, transaction });
      await Registration.destroy({ where: { id: registrationIds }, force: true, transaction });
    }

    await patient.destroy({ force: true, transaction });
    await transaction.commit();
    return ApiResponse.success(res, null, 'Patient permanently deleted');
  } catch (error) {
    await transaction.rollback();
    console.error('Permanent delete patient error:', error);
    return ApiResponse.error(res, 'Failed to permanently delete patient');
  }
};

module.exports = {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientRelatedCounts,
  permanentDeletePatient,
};
