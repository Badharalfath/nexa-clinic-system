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
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Patient.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return ApiResponse.success(res, {
      patients: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
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
    await patient.destroy();
    return ApiResponse.success(res, null, 'Patient deleted successfully');
  } catch (error) {
    console.error('Delete patient error:', error);
    return ApiResponse.error(res, 'Failed to delete patient');
  }
};

module.exports = { getPatients, getPatient, createPatient, updatePatient, deletePatient };
