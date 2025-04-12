const mongoose = require('mongoose');

const DoctorAvailabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create a compound index to ensure doctor can't mark the same date twice
DoctorAvailabilitySchema.index({ doctor: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DoctorAvailability', DoctorAvailabilitySchema);
