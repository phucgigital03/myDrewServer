const express = require('express')
const orderRouters = express.Router();

const orderController = require('../../controllers/api/orderController');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const roles = require('../../configs/allowRoles');

// cod
orderRouters.post('/cod/orders',orderController.addOrderCOD)
// paypal
orderRouters.post('/paypal/orders',orderController.addOrderPaypal)
orderRouters.post('/paypal/capture/orders',orderController.captureOrderPayPal)
// vnpay
orderRouters.post('/vnpay/create_payment_url',orderController.createUrlVnpay)
orderRouters.get('/vnpay/vnpay_ipn',orderController.captureIPNVnpay)
orderRouters.get('/vnpay/vnpay_return',orderController.captureReturnVnpay)
// another route
orderRouters.get('/orders/:customerID',orderController.getOrder)

module.exports = orderRouters
