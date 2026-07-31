const { sequelize } = require('./config/database');
const { connectDB } = require('./config/database');
const seedDatabase = require('./seeders/seed');

const syncDatabase = async (options = {}) => {
  await connectDB();
  await sequelize.sync({ force: options.force || false, alter: options.alter || false });
  console.log('Database synced.');

  if (options.seed) {
    await seedDatabase();
  }
};

module.exports = syncDatabase;

// Run directly: node src/sync.js --force --seed
if (require.main === module) {
  const args = process.argv.slice(2);
  syncDatabase({
    force: args.includes('--force'),
    alter: args.includes('--alter'),
    seed: args.includes('--seed')
  }).then(() => {
    console.log('Done.');
    process.exit(0);
  }).catch(err => {
    console.error('Sync failed:', err);
    process.exit(1);
  });
}
