const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const DoctorAvailability = require('../models/DoctorAvailability');
const mongoose = require('mongoose');

// Helper function to check if the user is a doctor
const checkDoctor = async (userId) => {
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    throw new Error('Doctor profile not found');
  }
  return doctor;
};

/**
 * Get doctor profile
 * @route GET /api/doctor/profile
 * @access Private (Doctor only)
 */
exports.getDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get doctor profile
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    // Get user information
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Combine doctor and user information
    const profile = {
      ...doctor.toObject(),
      name: user.name,
      email: user.email,
      phone: user.phone
    };
    
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error getting doctor profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update doctor profile
 * @route PUT /api/doctor/profile
 * @access Private (Doctor only)
 */
exports.updateDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name, email, phone, // User fields
      specialization, experience, bio, education, certifications, consultationFee, availability
    } = req.body;
    
    // Update user information
    if (name || email || phone) {
      const updateFields = {};
      if (name) updateFields.name = name;
      if (email) updateFields.email = email;
      if (phone) updateFields.phone = phone;
      
      await User.findByIdAndUpdate(userId, updateFields);
    }
    
    // Update doctor information
    const doctorUpdateFields = {};
    if (specialization) doctorUpdateFields.specialization = specialization;
    if (experience) doctorUpdateFields.experience = experience;
    if (bio !== undefined) doctorUpdateFields.bio = bio;
    if (education) doctorUpdateFields.education = education;
    if (certifications) doctorUpdateFields.certifications = certifications;
    if (consultationFee) doctorUpdateFields.consultationFee = consultationFee;
    if (availability) doctorUpdateFields.availability = availability;
    
    const doctor = await Doctor.findOneAndUpdate(
      { user: userId },
      doctorUpdateFields,
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    // Get updated user information
    const user = await User.findById(userId).select('-password');
    
    // Combine doctor and user information
    const profile = {
      ...doctor.toObject(),
      name: user.name,
      email: user.email,
      phone: user.phone
    };
    
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get doctor appointments
 * @route GET /api/doctor/appointments
 * @access Private (Doctor only)
 */
exports.getDoctorAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user is a doctor
    await checkDoctor(userId);
    
    // Get all appointments for the doctor
    const appointments = await Appointment.find({ doctor: userId })
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1, appointmentTime: -1 });
    
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error getting doctor appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get specific appointment by ID
 * @route GET /api/doctor/appointments/:id
 * @access Private (Doctor only)
 */
exports.getAppointmentById = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointmentId = req.params.id;
    
    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }
    
    // Check if user is a doctor
    await checkDoctor(userId);
    
    // Get the appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: userId
    }).populate('patient', 'name email phone');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error getting appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update appointment status
 * @route PUT /api/doctor/appointments/:id/status
 * @access Private (Doctor only)
 */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointmentId = req.params.id;
    const { status, notes } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }
    
    // Check if user is a doctor
    await checkDoctor(userId);
    
    // Update the appointment
    const updateFields = { status };
    if (notes) updateFields.notes = notes;
    
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, doctor: userId },
      updateFields,
      { new: true }
    ).populate('patient', 'name email phone');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get doctor's unavailable dates
 * @route GET /api/doctor/availability
 * @access Private (Doctor only)
 */
exports.getUnavailableDates = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user is a doctor
    await checkDoctor(userId);
    
    // Get all unavailable dates for the doctor
    const unavailableDates = await DoctorAvailability.find({ doctor: userId })
      .sort({ date: 1 });
    
    res.status(200).json(unavailableDates);
  } catch (error) {
    console.error('Error getting unavailable dates:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Add an unavailable date
 * @route POST /api/doctor/availability
 * @access Private (Doctor only)
 */
exports.addUnavailableDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, reason } = req.body;
    
    // Validate inputs
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    
    if (!reason) {
      return res.status(400).json({ message: 'Reason is required' });
    }
    
    // Check if user is a doctor
    await checkDoctor(userId);
    
    // Check if date is in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({ message: 'Cannot mark past dates as unavailable' });
    }
    
    // Check if date already exists
    const existingDate = await DoctorAvailability.findOne({
      doctor: userId,
      date: selectedDate
    });
    
    if (existingDate) {
      return res.status(400).json({ message: 'This date is already marked as unavailable' });
    }
    
    // Create new unavailable date
    const unavailableDate = new DoctorAvailability({
      doctor: userId,
      date: selectedDate,
      reason
    });
    
    await unavailableDate.save();
    
    res.status(201).json(unavailableDate);
  } catch (error) {
    console.error('Error adding unavailable date:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Remove an unavailable date
 * @route DELETE /api/doctor/availability/:id
 * @access Private (Doctor only)
 */
exports.removeUnavailableDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const dateId = req.params.id;
    
    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(dateId)) {
      return res.status(400).json({ message: 'Invalid date ID' });
    }
    
    // Check if user is a doctor
    await checkDoctor(userId);
    
    // Find and delete the unavailable date
    const unavailableDate = await DoctorAvailability.findOneAndDelete({
      _id: dateId,
      doctor: userId
    });
    
    if (!unavailableDate) {
      return res.status(404).json({ message: 'Unavailable date not found' });
    }
    
    res.status(200).json({ message: 'Unavailable date removed successfully' });
  } catch (error) {
    console.error('Error removing unavailable date:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
