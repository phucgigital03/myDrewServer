const express = require('express')
const searchRouters = express.Router();

const searchController = require('../controllers/searchController');

searchRouters.get('/getProduct',searchController.getProduct)

module.exports = searchRouters
