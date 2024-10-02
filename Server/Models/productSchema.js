const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema for Products
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  petType: String,
  category: String,
  interval: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly'],
    required: function () {
      return this.category === 'subscriptions'; // Only required for subscriptions
    }
  }
});

// Joi Validation Schema for Product
const productValidationSchema = Joi.object({
  id: Joi.string(),
  title: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().min(1).required(),
  image: Joi.string().required(),
  petType: Joi.string().required(),
  category: Joi.string().min(3).max(20).required(),
  interval: Joi.string()
    .valid('weekly', 'biweekly', 'monthly')
    .when('category', {
      is: 'subscriptions',
      then: Joi.required(),
      otherwise: Joi.forbidden(), // If the category is not 'subscriptions', interval should be omitted
    }),
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product, productValidationSchema };
