const { Patient, Registration, Queue, MedicalRecord } = require('../models');
const { Op } = require('sequelize');
const ApiResponse = require('../utils/apiResponse');

const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalPatients,
      todayPatients,
      todayQueues,
      waitingPatients,
      completedPatients
    ] = await Promise.all([
      Patient.count(),
      Registration.count({ where: { registrationDate: { [Op.gte]: today } } }),
      Queue.count({
        where: { status: { [Op.notIn]: ['selesai', 'lewat'] } },
        include: [{
          model: Registration, as: 'registration',
          where: { registrationDate: { [Op.gte]: today } }
        }]
      }),
      Queue.count({ where: { status: 'menunggu' } }),
      Queue.count({ where: { status: 'selesai' } })
    ]);

    return ApiResponse.success(res, {
      totalPatients,
      todayPatients,
      todayQueues,
      waitingPatients,
      completedPatients
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return ApiResponse.error(res, 'Failed to fetch dashboard data');
  }
};

module.exports = { getDashboard };
