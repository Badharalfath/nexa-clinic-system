const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Auto-generate queue number: <polyclinic initial><3-digit seq> (e.g. U001, G001, A001)
async function generateQueueNumber(queue) {
  if (queue.queueNumber) return;
  try {
    const Registration = sequelize.models.registrations;
    const Polyclinic = sequelize.models.polyclinics;
    let prefix = 'U';
    if (queue.registrationId && Registration) {
      const reg = await Registration.findByPk(queue.registrationId, {
        include: [{ model: Polyclinic, as: 'polyclinic', attributes: ['name'] }]
      });
      const polyName = reg?.polyclinic?.name;
      if (polyName) prefix = polyName.charAt(0).toUpperCase();
    }

    const last = await Queue.findOne({
      where: { queueNumber: { [Op.like]: `${prefix}%` } },
      order: [['queueNumber', 'DESC']],
      attributes: ['queueNumber'],
      paranoid: false,
    });
    let seq = 1;
    if (last && /^\D+\d+$/.test(last.queueNumber)) {
      const numPart = last.queueNumber.match(/\d+$/)[0];
      seq = parseInt(numPart, 10) + 1;
    }
    queue.queueNumber = `${prefix}${String(seq).padStart(3, '0')}`;
  } catch (err) {
    queue.queueNumber = `U${String(Math.floor(Math.random() * 900) + 100)}`;
  }
}

const Queue = sequelize.define('queues', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  registrationId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'registration_id',
    references: { model: 'registrations', key: 'id' }
  },
  queueNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'queue_number'
  },
  status: {
    type: DataTypes.ENUM('menunggu', 'dipanggil', 'pemeriksaan', 'selesai', 'lewat'),
    allowNull: false,
    defaultValue: 'menunggu'
  },
  calledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'called_at'
  }
}, {
  hooks: {
    // Must run before validate (Sequelize validates before beforeCreate)
    beforeValidate: generateQueueNumber
  }
});

module.exports = Queue;
