const express = require('express');
const router = express.Router();
const { getUserBookings } = require('../controllers/bookingController');

router.get('/:id/bookings', getUserBookings);

module.exports = router;
