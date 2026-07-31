const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { User, Patient, Polyclinic } = require('../models');

const seedDatabase = async () => {
  try {
    // Check if already seeded
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('Database already seeded.');
      return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Users
    await User.bulkCreate([
      { id: 'a0000000-0000-0000-0000-000000000001', username: 'admin', email: 'admin@clinic.com', password: hashedPassword, name: 'Administrator', role: 'administrator' },
      { id: 'a0000000-0000-0000-0000-000000000002', username: 'dr.sari', email: 'drsari@clinic.com', password: hashedPassword, name: 'Dr. Sari', role: 'dokter' },
      { id: 'a0000000-0000-0000-0000-000000000003', username: 'dr.budi', email: 'drbudi@clinic.com', password: hashedPassword, name: 'Dr. Budi', role: 'dokter' },
      { id: 'a0000000-0000-0000-0000-000000000004', username: 'petugas1', email: 'petugas1@clinic.com', password: hashedPassword, name: 'Ani Petugas', role: 'petugas_pendaftaran' }
    ]);

    // Create Polyclinics
    await Polyclinic.bulkCreate([
      { id: 'b0000000-0000-0000-0000-000000000001', name: 'Umum', description: 'Poli pelayanan umum' },
      { id: 'b0000000-0000-0000-0000-000000000002', name: 'Gigi', description: 'Poli kesehatan gigi dan mulut' },
      { id: 'b0000000-0000-0000-0000-000000000003', name: 'Anak', description: 'Poli kesehatan anak' }
    ]);

    console.log('Database seeded successfully!');
    console.log('Default password for all accounts: password123');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    throw error;
  }
};

module.exports = seedDatabase;

// Run directly
if (require.main === module) {
  (async () => {
    try {
      await sequelize.sync({ force: true });
      await seedDatabase();
      await sequelize.close();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}
