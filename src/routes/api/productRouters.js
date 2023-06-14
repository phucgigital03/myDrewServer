const express = require('express')
const productRouters = express.Router();

const productController = require('../../controllers/api/productController');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const roles = require('../../configs/allowRoles');
const { uploadArrayFile } = require('../../middlewares/uploadFile')

productRouters.post('/products',uploadArrayFile,productController.create)
productRouters.get('/products',productController.getList)
productRouters.patch('/products',productController.update)
productRouters.delete('/products',productController.deleteSort)

module.exports = productRouters
