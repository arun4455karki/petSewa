const express = require('express');
const router = express.Router();
const controller = require('../Controllers/userController');
const tryCatch = require('../Middleware/tryCatch');
const checkAuth = require('../Middleware/checkAuth');

router
  .post('/register', tryCatch(controller.register))
  .post('/login', tryCatch(controller.login))

  .post('/:id/payment', tryCatch(controller.payment))
  .get('/payment/success', tryCatch(controller.success))
  .post('/payment/cancel', tryCatch(controller.cancel))

  .get('/products', tryCatch(controller.getAllProducts))
  .get('/products/top-selling', tryCatch(controller.getTopSellingProducts))
  .get('/products/:id', tryCatch(controller.getProductById))
  .get('/products/category/:pettype/:categoryname', tryCatch(controller.getProductsByCategory))

  // .use(checkAuth(process.env.USER_ACCESS_TOKEN_SECRET))

  .get('/:id/cart', tryCatch(controller.showCart))
  .post('/:id/cart', tryCatch(controller.addToCart))
  .put('/:id/cart', tryCatch(controller.updateCartItemQuantity))
  .delete('/:id/cart/:product', tryCatch(controller.removeFromCart))

  .get('/:id/wishlist', tryCatch(controller.showWishlist))
  .post('/:id/wishlist', tryCatch(controller.addToWishlist))
  .delete('/:id/wishlist/:product', tryCatch(controller.removeFromWishlist))

  .get('/:id/orders', tryCatch(controller.showOrders))

  // add appointments 
  .post('/addAppointment', tryCatch(controller.addAppointment))
  .get('/getAppointments', tryCatch(controller.getAppointments))
  .get('/getAppointmentsByUserId/:userId', tryCatch(controller.getAppointmentsByUserId))

  // subscription routes
  .post('/addSubscription', tryCatch(controller.addSubscription))
  .get('/getSubscriptionsByUserId/:userId', tryCatch(controller.getSubscriptionByUserId))
  // messages routes
  .get('/:id/messageList', tryCatch(controller.getMessageList)) 
module.exports = router;
