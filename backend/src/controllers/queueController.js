const { Queue, Registration, Patient, User, Polyclinic } = require('../models');
const ApiResponse = require('../utils/apiResponse');

const getQueues = async (req, res) => {
  try {
    const { status, date } = req.query;
    const where = {};
    if (status) where.status = status;

    const regWhere = {};
    if (date) regWhere.registrationDate = date;

    const queues = await Queue.findAll({
      where,
      include: [{
        model: Registration,
        as: 'registration',
        where: regWhere,
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'medicalRecordNumber', 'name'] },
          { model: User, as: 'doctor', attributes: ['id', 'name'] },
          { model: Polyclinic, as: 'polyclinic', attributes: ['id', 'name'] }
        ]
      }],
      order: [['createdAt', 'ASC']]
    });

    return ApiResponse.success(res, queues);
  } catch (error) {
    console.error('Get queues error:', error);
    return ApiResponse.error(res, 'Failed to fetch queues');
  }
};

const callQueue = async (req, res) => {
  try {
    const queue = await Queue.findByPk(req.params.id);
    if (!queue) return ApiResponse.notFound(res, 'Queue not found');

    await queue.update({ status: 'dipanggil', calledAt: new Date() });
    return ApiResponse.success(res, queue, 'Queue called successfully');
  } catch (error) {
    console.error('Call queue error:', error);
    return ApiResponse.error(res, 'Failed to call queue');
  }
};

const updateQueueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['menunggu', 'dipanggil', 'pemeriksaan', 'selesai', 'lewat'];
    if (!validStatuses.includes(status)) {
      return ApiResponse.badRequest(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const queue = await Queue.findByPk(req.params.id);
    if (!queue) return ApiResponse.notFound(res, 'Queue not found');

    await queue.update({ status, calledAt: status === 'dipanggil' ? new Date() : queue.calledAt });

    // Also sync registration status
    const statusMap = { dipanggil: 'check_up', pemeriksaan: 'pemeriksaan', selesai: 'selesai', lewat: 'selesai' };
    if (statusMap[status]) {
      await Registration.update({ status: statusMap[status] }, { where: { id: queue.registrationId } });
    }

    return ApiResponse.success(res, queue, 'Queue status updated successfully');
  } catch (error) {
    console.error('Update queue status error:', error);
    return ApiResponse.error(res, 'Failed to update queue status');
  }
};

module.exports = { getQueues, callQueue, updateQueueStatus };
