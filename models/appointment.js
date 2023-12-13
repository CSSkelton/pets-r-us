var mongoose = require('mongoose');

let appointmentSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    service: { type: String, required: true }
})

module.exports = mongoose.model('Appointment', appointmentSchema);