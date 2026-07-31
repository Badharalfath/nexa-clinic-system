const { Prescription } = require('../models');
const ApiResponse = require('../utils/apiResponse');

const createPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create(req.body);
    return ApiResponse.created(res, prescription, 'Prescription created successfully');
  } catch (error) {
    console.error('Create prescription error:', error);
    return ApiResponse.error(res, 'Failed to create prescription');
  }
};

const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByPk(req.params.id);
    if (!prescription) return ApiResponse.notFound(res, 'Prescription not found');
    return ApiResponse.success(res, prescription);
  } catch (error) {
    console.error('Get prescription error:', error);
    return ApiResponse.error(res, 'Failed to fetch prescription');
  }
};

module.exports = { createPrescription, getPrescription };
