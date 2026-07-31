const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Queue = sequelize.define('queues', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
});

module.exports = Queue;
