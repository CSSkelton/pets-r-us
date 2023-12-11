var mongoose = require('mongoose');

let customerSchema = new mongoose.Schema({
    customerId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Customer', customerSchema);