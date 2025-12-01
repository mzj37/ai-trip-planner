const sequelize = require('../config/database');
const User = require('./User');
const Trip = require('./Trip');
const Activity = require('./Activity');

// Define relationships
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Trip.hasMany(Activity, { foreignKey: 'tripId', as: 'activities' });
Activity.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

module.exports = {
  sequelize,
  User,
  Trip,
  Activity
};