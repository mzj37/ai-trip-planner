const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'trip_id'
  },
  dayNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'day_number'
  },
  timeSlot: {
    type: DataTypes.STRING(20),
    field: 'time_slot'
  },
  activityName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'activity_name'
  },
  description: {
    type: DataTypes.TEXT
  },
  estimatedCost: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'estimated_cost'
  },
  location: {
    type: DataTypes.STRING(255)
  },
  category: {
    type: DataTypes.STRING(50)
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    field: 'order_index'
  }
}, {
  tableName: 'activities',
  underscored: true,
  timestamps: true
});

module.exports = Activity;