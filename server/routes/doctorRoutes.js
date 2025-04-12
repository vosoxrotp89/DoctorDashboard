const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('doctor'));

// Doctor profile routes
router.get('/profile', doctorController.getDoctorProfile);
router.put('/profile', doctorController.updateDoctorProfile);

// Doctor appointments routes
router.get('/appointments', doctorController.getDoctorAppointments);
router.get('/appointments/:id', doctorController.getAppointmentById);
router.put('/appointments/:id/status', doctorController.updateAppointmentStatus);

// Doctor availability routes
router.get('/availability', doctorController.getUnavailableDates);
router.post('/availability', doctorController.addUnavailableDate);
router.delete('/availability/:id', doctorController.removeUnavailableDate);

module.exports = router;
