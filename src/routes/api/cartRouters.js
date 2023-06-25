const express = require('express')
const cartRouters = express.Router();

const cartController = require('../../controllers/api/cartController');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const roles = require('../../configs/allowRoles');

cartRouters.post('/cart',cartController.create)
cartRouters.patch('/cart/plus',cartController.updateProductPlus)
cartRouters.patch('/cart/minus',cartController.updateProductMinus)
cartRouters.delete('/cart',cartController.deleProductCart)

module.exports = cartRouters
