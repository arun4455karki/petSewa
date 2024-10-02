const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Assuming you have a Product model
    required: true
  },
  interval: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  nextOrderDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active'
  }
});
const Subscription = mongoose.model('Subscription', subscriptionSchema)

module.exports = {Subscription}