const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number, // years of experience
    required: true
  },
  bio: {
    type: String
  },
  education: [
    {
      degree: String,
      institution: String,
      year: Number
    }
  ],
  certifications: [
    {
      name: String,
      issuedBy: String,
      year: Number
    }
  ],
  status: {
    type: String,
    enum: ['approved', 'not-approved', 'declined'],
    default: 'not-approved'
  },
  consultationFee: {
    type: Number
  },
  availability: {
    workDays: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    workHours: {
      start: String, // Format: "HH:MM"
      end: String    // Format: "HH:MM"
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
