const express = require('express')
const orderHistoryRouters = express.Router();

const orderHistoryController = require('../../controllers/api/orderHistoryController');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const roles = require('../../configs/allowRoles');

orderHistoryRouters.post('/orderHistorys',orderHistoryController.create)

module.exports = orderHistoryRouters
