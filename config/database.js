// config/database.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({ 
  dialect: 'sqlite',
  storage: 'path/to/database.sqlite', // Adjust the path as needed
  logging: console.log
});

module.exports = sequelize;
