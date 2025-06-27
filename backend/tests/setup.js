const { sequelize } = require('../models');

beforeAll(async () => {
  // Sync database
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close connection
  await sequelize.close();
});