const express = require('express')
const inventoryRouters = express.Router();

const inventoryController = require('../../controllers/api/inventoryController');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const roles = require('../../configs/allowRoles');
const { uploadArrayFile } = require('../../middlewares/uploadFile')

inventoryRouters.post('/inventory',uploadArrayFile,inventoryController.create)
inventoryRouters.get('/inventory',inventoryController.getList)
inventoryRouters.patch('/inventory/:id',uploadArrayFile,inventoryController.update)
inventoryRouters.delete('/inventory',inventoryController.deleteSort)

module.exports = inventoryRouters
