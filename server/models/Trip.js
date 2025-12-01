const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  destination: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATEONLY,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATEONLY,
    field: 'end_date'
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2)
  },
  styles: {
    type: DataTypes.STRING(255)
  },
  aiResponse: {
    type: DataTypes.TEXT,
    field: 'ai_response'
  },
  shareId: {
    type: DataTypes.STRING(50),
    unique: true,
    field: 'share_id'
  }
}, {
  tableName: 'trips',
  underscored: true,
  timestamps: true
});

// Generate share ID before creating
Trip.beforeCreate((trip) => {
  trip.shareId = uuidv4().slice(0, 8);
});

module.exports = Trip;