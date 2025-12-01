const express = require('express');
const router = express.Router();
const { getTrips, getTripById, getTripByShareId, createTrip, updateTrip, deleteTrip } = require('../controllers/tripController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route - get shared trip
router.get('/share/:shareId', getTripByShareId);

// Protected routes - require login
router.get('/', authMiddleware, getTrips);
router.get('/:id', authMiddleware, getTripById);
router.post('/', authMiddleware, createTrip);
router.put('/:id', authMiddleware, updateTrip);
router.delete('/:id', authMiddleware, deleteTrip);

module.exports = router;