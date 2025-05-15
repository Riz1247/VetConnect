const Appointment = require('../models/Appointment');
const { AppError } = require('../utils/errorHandler');

class AppointmentService {
    async createAppointment(appointmentData) {
        try {
            const appointment = new Appointment(appointmentData);
            await appointment.save();
            return appointment;
        } catch (error) {
            throw new AppError(error.message, 400);
        }
    }

    async getAppointmentById(id) {
        try {
            const appointment = await Appointment.findById(id);
            if (!appointment) {
                throw new AppError('Appointment not found', 404);
            }
            return appointment;
        } catch (error) {
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async getAllAppointments() {
        try {
            const appointments = await Appointment.find().sort({ appointmentDate: 1 });
            return appointments;
        } catch (error) {
            throw new AppError(error.message, 500);
        }
    }

    async updateAppointment(id, updateData) {
        try {
            const appointment = await Appointment.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            if (!appointment) {
                throw new AppError('Appointment not found', 404);
            }
            return appointment;
        } catch (error) {
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async deleteAppointment(id) {
        try {
            const appointment = await Appointment.findByIdAndDelete(id);
            if (!appointment) {
                throw new AppError('Appointment not found', 404);
            }
            return appointment;
        } catch (error) {
            throw new AppError(error.message, error.statusCode || 500);
        }
    }
}

module.exports = new AppointmentService(); 