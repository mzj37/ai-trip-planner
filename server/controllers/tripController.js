const { Trip, Activity } = require('../models');

// Get all trips for logged-in user
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { userId: req.user.id },
      include: [{ model: Activity, as: 'activities' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single trip by ID
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Activity, as: 'activities', order: [['dayNumber', 'ASC'], ['orderIndex', 'ASC']] }]
    });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    res.json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get trip by share ID (public - no auth needed)
const getTripByShareId = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { shareId: req.params.shareId },
      include: [{ model: Activity, as: 'activities' }]
    });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    res.json(trip);
  } catch (error) {
    console.error('Get shared trip error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new trip
const createTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, styles, aiResponse, activities } = req.body;
    
    const trip = await Trip.create({
      userId: req.user.id,
      destination,
      startDate,
      endDate,
      budget,
      styles,
      aiResponse
    });
    
    if (activities && activities.length > 0) {
      const activitiesWithTripId = activities.map((activity, index) => ({
        ...activity,
        tripId: trip.id,
        orderIndex: index
      }));
      await Activity.bulkCreate(activitiesWithTripId);
    }
    
    const tripWithActivities = await Trip.findByPk(trip.id, {
      include: [{ model: Activity, as: 'activities' }]
    });
    
    res.status(201).json(tripWithActivities);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update trip
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    const { destination, startDate, endDate, budget, styles, aiResponse } = req.body;
    
    await trip.update({
      destination: destination || trip.destination,
      startDate: startDate || trip.startDate,
      endDate: endDate || trip.endDate,
      budget: budget || trip.budget,
      styles: styles || trip.styles,
      aiResponse: aiResponse || trip.aiResponse
    });
    
    res.json(trip);
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete trip
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    await Activity.destroy({ where: { tripId: trip.id } });
    await trip.destroy();
    
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTrips, getTripById, getTripByShareId, createTrip, updateTrip, deleteTrip };