const { User, userRegisterSchema, userLoginSchema } = require('../Models/userSchema');
require('dotenv').config();
const { Product } = require('../Models/productSchema');
const Order = require('../Models/orderSchema');
const {Appointment} = require('../Models/appointmentSchema')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
let orderDetails = {};

module.exports = {
  register: async (req, res) => {
    const { error, value } = userRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = value;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful! You can now login.',
    });
  },

  login: async (req, res) => {
    const { error, value } = userLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = value;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email not found. Please register.' });
    }

    const passwordMatch = bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect Password. Try again.' });
    }

    const accessToken = jwt.sign({ email }, process.env.USER_ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
    const refreshToken = jwt.sign({ email }, process.env.USER_REFRESH_TOKEN_SECRET, { expiresIn: '3d' });

    res
      .status(200)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        maxAge: 3 * 24 * 60 * 60 * 1000,
      }) 
      .json({
        status: 'success',
        message: 'Successfully Logged In.',
        data: { jwt_token: accessToken, name: user.name, userID: user._id },
      });
  },

  getAllProducts: async (req, res) => {
    const products = await Product.find();
    if (products.length == 0) {
      return res.json({ message: 'Product collection is empty!' });
    }
    res.status(200).json({
      status: 'success',
      message: 'Successfully fetched products detail.',
      data: products,
    });
  },

  getProductById: async (req, res) => {
    const productID = req.params.id;
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({
      status: 'success',
      message: 'Successfully fetched product details.',
      data: product,
    });
  },

  getTopSellingProducts: async (req, res) => {
    const DogFood = await Product.find({ category: 'Dog' }).limit(4);
    const CatFood = await Product.find({ category: 'Cat' }).limit(4);
    res.status(200).json({
      status: 'success',
      message: 'Successfully fetched products.',
      data: [...DogFood, ...CatFood],
    });
  },

  getProductsByCategory: async (req, res) => {
    try {
      const { pettype, categoryname } = req.params;  // Extract pettype and category from URL params
      console.log(`Fetching products for PetType: ${pettype} and Category: ${categoryname}`);
  
      // Fetch products that match the pettype and category
      const products = await Product.find({ petType: pettype, category: categoryname });
      console.log(products)
      // Check if products exist for the given pettype and category
      if (!products.length) {
        return res.status(404).json({
          status: 'fail',
          message: 'No products found for the specified pet type and category.',
        });
      }
  
      // Return the fetched products
      res.status(200).json({
        status: 'success',
        message: 'Successfully fetched products details.',
        data: products,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error while fetching products.',
      });
    }
  },
  

  showCart: async (req, res) => {
    const userID = req.params.id;
    const user = await User.findById(userID).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully fetched cart items.',
      data: user.cart,
    });
  },

  addToCart: async (req, res) => {
    const userID = req.params.id;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { productID } = req.body;
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await User.findByIdAndUpdate(userID, { $addToSet: { cart: { product: productID } } });

    res.status(200).json({
      status: 'success',
      message: 'Product added to cart',
      cart: user.cart,
    });
  },

  updateCartItemQuantity: async (req, res) => {
    const userID = req.params.id;
    const { id, quantityChange } = req.body;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedCart = (user.cart.id(id).quantity += quantityChange);
    if (updatedCart > 0) {
      await user.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Cart item quantity updated',
      data: user.cart,
    });
  },

  removeFromCart: async (req, res) => {
    const userID = req.params.id;
    const productID = req.params.product;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndUpdate(userID, { $pull: { cart: { product: productID } } });
    res.status(200).json({
      status: 'success',
      message: 'Successfully removed from cart',
    });
  },

  showWishlist: async (req, res) => {
    const userID = req.params.id;
    const user = await User.findById(userID).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully fetched wishlist.',
      data: user.wishlist,
    });
  },

  addToWishlist: async (req, res) => {
    const userID = req.params.id;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { productID } = req.body;
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(userID, { $addToSet: { wishlist: productID } }, { new: true });
    res.status(200).json({
      status: 'success',
      message: 'Successfully added to wishlist',
      data: updatedUser.wishlist,
    });
  },

  removeFromWishlist: async (req, res) => {
    const userID = req.params.id;
    const productID = req.params.product;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndUpdate(userID, { $pull: { wishlist: productID } });
    res.status(200).json({
      status: 'success',
      message: 'Successfully removed from wishlist',
    });
  },

  // payment: async (req, res) => {
  //   console.log("hhh", process.env.STRIPE_SECRET_KEY)
  //   const userID = req.params.id;
  //   console.log(userID)
  //   const user = await User.findById(userID).populate('cart.product');
  //   console.log(user)
  //   if (!user) {
  //     return res.status(404).json({ message: 'User not found' });
  //   }
    
  //   if (user.cart.length === 0) {
  //     return res.status(404).json({ message: 'Cart is empty' });
  //   }


  //   const line_items = user.cart.map((item) => {
  //     return {
  //       price_data: {
  //         currency: 'inr',
  //         product_data: {
  //           images: [item.product.image],
  //           name: item.product.title,
  //         },
  //         unit_amount: Math.round(item.product.price * 100),
  //       },
  //       quantity: item.quantity,
  //     };
  //   });

  //   console.log(line_items, "line items")

  //   const session = await stripe.checkout.sessions.create({
  //     line_items,
  //     mode: 'payment',
  //     success_url: 'http://localhost:3000/payment/success',
  //     cancel_url: 'http://localhost:3000/payment/cancel',
  //   });
  //   console.log(session, "session")

  //   orderDetails = {
  //     userID,
  //     user,
  //     newOrder: {
  //       products: user.cart.map((item) => new mongoose.Types.ObjectId(item.product._id)),
  //       order_id: Date.now(),
  //       payment_id: session.id,
  //       total_amount: session.amount_total / 100,
  //     },
  //   };

  //   console.log(orderDetails, "details")

  //   res.status(200).json({
  //     status: 'success',
  //     message: 'Stripe Checkout session created',
  //     sessionId: session.id,
  //     url: session.url,
  //   });
  // },
 
// Assuming you're using Express.js
payment: async (req, res) => {
  try {
    console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

    const userID = req.params.id;
    console.log("User ID:", userID);

    const user = await User.findById(userID).populate('cart.product');
    console.log("Retrieved User:", user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const line_items = user.cart.map((item) => {
      if (!item.product || !item.product.price || !item.product.title || !item.product.image) {
        throw new Error(`Invalid product data for item ID: ${item._id}`);
      }

      // Validate and sanitize image URL (Check length and provide fallback if needed)
      const imageUrl = item.product.image.length <= 2048 ? item.product.image : 'https://yourdomain.com/default-product-image.jpg';

      return {
        price_data: {
          currency: 'inr',
          product_data: {
            images: [imageUrl],
            name: item.product.title,
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    console.log("Line Items:", line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/payment/cancel',
    });

    console.log("Stripe Session:", session);

    const orderDetails = {
      userID,
      user: {
        id: user._id,
        email: user.email,
      },
      newOrder: {
        products: user.cart.map((item) => item.product._id),
        order_id: new mongoose.Types.ObjectId(),
        payment_id: session.id,
        total_amount: session.amount_total / 100,
        created_at: new Date(),
      },
    };

    console.log("Order Details:", orderDetails);

    return res.status(200).json({
      status: 'success',
      message: 'Stripe Checkout session created',
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error("Payment Processing Error:", error);

    if (error.type === 'StripeCardError') {
      return res.status(400).json({ message: error.message });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ message: 'Invalid payment parameters.' });
    } else if (error.type === 'StripeAPIError') {
      return res.status(500).json({ message: 'Payment processing failed. Please try again later.' });
    } else if (error.type === 'StripeConnectionError') {
      return res.status(502).json({ message: 'Network error. Please try again.' });
    } else if (error.type === 'StripeAuthenticationError') {
      return res.status(401).json({ message: 'Authentication with payment gateway failed.' });
    } else {
      return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }
},


  success: async (req, res) => {
    const { userID, user, newOrder } = orderDetails;

    if (newOrder) {
      const order = await Order.create({ ...newOrder });
      await User.findByIdAndUpdate(userID, { $push: { orders: order._id } });
      orderDetails.newOrder = null;
    }
    user.cart = [];
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Payment was successful',
    });
  },

  cancel: async (req, res) => {
    res.status(200).json({
      status: 'failure',
      message: 'Payment was cancelled',
    });
  },

  showOrders: async (req, res) => {
    const userID = req.params.id;
    const user = await User.findById(userID).populate('orders');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userOrders = user.orders;
    if (userOrders.length === 0) {
      return res.status(404).json({ message: 'You have no orders' });
    }

    const orderDetails = await Order.find({ _id: { $in: userOrders } }).populate('products');

    res.status(200).json({
      status: 'success',
      message: 'Successfully fetched order details.',
      data: orderDetails,
    });
  },

  addAppointment: async (req, res) => {
    const {appointment} = req.body
    console.log(appointment)
    const savedAppointment = await Appointment.create(appointment)

    res.status(200).json({
      status: 'success',
      message: 'Appointment added successfully',
      data: savedAppointment
    })
  },

  cancelAppointment: async (req, res) => {
      const { appointmentId } = req.params; // Assuming appointmentId is passed as a URL parameter
  
      const appointment = await Appointment.findById(appointmentId);
  
      if (!appointment) {
        return res.status(404).json({
          status: 'fail',
          message: 'Appointment not found',
        });
      }
  
      // Update the status to 'Cancelled'
      appointment.status = 'Cancelled';
      await appointment.save();
  
      res.status(200).json({
        status: 'success',
        message: 'Appointment cancelled successfully',
        data: appointment,
      });

  },


  getAppointments: async (req, res) => {
    const appointments = await Appointment.find();

    res.status(200).json({
      status: 'success',
      message: 'Appointments retrieved successfully',
      data: appointments,
    });

  },

  getAppointmentsByUserId: async (req, res) => {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter

    const appointments = await Appointment.find({ customer: userId });

    if (!appointments.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'No appointments found for this user',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Appointments retrieved successfully',
      data: appointments,
    });
  },


};
