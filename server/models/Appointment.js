const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String, // Format: "HH:MM"
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, { timestamps: true });

// Create index for faster queries
AppointmentSchema.index({ doctor: 1, appointmentDate: 1 });
AppointmentSchema.index({ patient: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);
