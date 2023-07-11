const express = require('express')
const productRouters = express.Router();

const productController = require('../../controllers/api/productController');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const roles = require('../../configs/allowRoles');
const { uploadArrayFile } = require('../../middlewares/uploadFile')

productRouters.get('/product',productController.getList)
productRouters.get('/product/:title',productController.getOne)

module.exports = productRouters
