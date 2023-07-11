const express = require('express')
const cartRouters = express.Router();

const cartController = require('../../controllers/api/cartController');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const roles = require('../../configs/allowRoles');
const { multipleBuyIncr } = require('../../middlewares/multipleBuy');

// cartRouters.post('/cart',multipleBuyIncr)
cartRouters.get('/cart/:cartId',cartController.getCart)
cartRouters.post('/cart',multipleBuyIncr,cartController.create)
cartRouters.put('/cart/plus',multipleBuyIncr,cartController.updateProductPlus)
cartRouters.put('/cart/minus',cartController.updateProductMinus)
cartRouters.delete('/cart',cartController.deleProductCart)

module.exports = cartRouters
