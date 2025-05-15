// backend/models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { 
    type: String, 
    enum: ["pet_match", "appointment_reminder", "system"], 
    required: true 
  },
  relatedPet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" }, // For pet matches
  relatedAppointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }, // For reminders
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);