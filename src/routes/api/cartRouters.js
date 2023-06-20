const express = require('express')
const cartRouters = express.Router();

const cartController = require('../../controllers/api/cartController');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const roles = require('../../configs/allowRoles');

cartRouters.post('/cart',cartController.create)

module.exports = cartRouters
