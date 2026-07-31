const { Registration, Patient, User, Polyclinic, Queue } = require('../models');
const ApiResponse = require('../utils/apiResponse');

const getRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (date) where.registrationDate = date;

    const { count, rows } = await Registration.findAndCountAll({
      where,
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'medicalRecordNumber', 'name', 'nik', 'gender'] },
        { model: User, as: 'doctor', attributes: ['id', 'name'] },
        { model: Polyclinic, as: 'polyclinic', attributes: ['id', 'name'] },
        { model: Queue, as: 'queue', attributes: ['id', 'queueNumber', 'status'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return ApiResponse.success(res, {
      registrations: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / limit) }
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    return ApiResponse.error(res, 'Failed to fetch registrations');
  }
};

const createRegistration = async (req, res) => {
  try {
    const { patientId, doctorId, polyclinicId, paymentType, complaint, registrationDate } = req.body;

    const registration = await Registration.create({
      patientId, doctorId, polyclinicId, paymentType, complaint,
      registrationDate: registrationDate || new Date(),
      status: 'menunggu'
    });

    // Auto-create queue entry
    await Queue.create({ registrationId: registration.id });

    const result = await Registration.findByPk(registration.id, {
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'medicalRecordNumber', 'name'] },
        { model: User, as: 'doctor', attributes: ['id', 'name'] },
        { model: Polyclinic, as: 'polyclinic', attributes: ['id', 'name'] },
        { model: Queue, as: 'queue' }
      ]
    });

    return ApiResponse.created(res, result, 'Registration created successfully');
  } catch (error) {
    console.error('Create registration error:', error);
    return ApiResponse.error(res, 'Failed to create registration');
  }
};

const updateRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);
    if (!registration) {
      return ApiResponse.notFound(res, 'Registration not found');
    }
    await registration.update(req.body);
    return ApiResponse.success(res, registration, 'Registration updated successfully');
  } catch (error) {
    console.error('Update registration error:', error);
    return ApiResponse.error(res, 'Failed to update registration');
  }
};

module.exports = { getRegistrations, createRegistration, updateRegistration };
