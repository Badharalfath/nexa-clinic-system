const { User, Polyclinic } = require('../models');
const ApiResponse = require('../utils/apiResponse');

const getDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: 'dokter', isActive: true },
      attributes: ['id', 'name', 'username']
    });
    return ApiResponse.success(res, doctors);
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch doctors');
  }
};

const getPolyclinics = async (req, res) => {
  try {
    const polyclinics = await Polyclinic.findAll();
    return ApiResponse.success(res, polyclinics);
  } catch (error) {
    return ApiResponse.error(res, 'Failed to fetch polyclinics');
  }
};

module.exports = { getDoctors, getPolyclinics };
