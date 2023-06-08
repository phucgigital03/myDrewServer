const express = require('express')
const logoutRouters = express.Router();

const logoutController = require('../controllers/logoutController');

logoutRouters.get('/logout',logoutController.logout)

module.exports = logoutRouters
