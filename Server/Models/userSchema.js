const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, default: null },
  email: String,
  password: String,
  messageList: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      text: String,
      position: String,
      isRead: Boolean,
      date: mongoose.Schema.Types.Date
    }
  ],
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
});

const User = mongoose.model('User', userSchema);

const userRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

module.exports = { User, userRegisterSchema, userLoginSchema };

