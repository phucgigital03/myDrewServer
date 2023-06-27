const express = require('express')
const orderRouters = express.Router();

const orderController = require('../../controllers/api/orderController');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const roles = require('../../configs/allowRoles');

orderRouters.post('/stripe/orders',express.raw({type: 'application/json'}),orderController.webhookAddOrder)

module.exports = orderRouters