const express = require('express')
const registerRouters = express.Router();

const registerController = require('../controllers/registerController');

registerRouters.post('/register',registerController.register)

module.exports = registerRouters
