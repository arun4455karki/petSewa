const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a customer schema
    required: true,
  },
  petName: {
    type: String
  },
  petType: {
    type: String
  },
  serviceType: {
    type: String,
    enum: ['Grooming', 'Bathing', 'Nail Trimming'], // Add more services as needed
    required: true,
  }, 
  appointmentDateAndTime: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema)
module.exports= {Appointment}
