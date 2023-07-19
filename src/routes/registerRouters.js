const express = require('express')
const registerRouters = express.Router();

const registerController = require('../controllers/registerController');
const allowRequest = require('../middlewares/allowRequest');

registerRouters.post('/register',allowRequest,registerController.register)
registerRouters.post('/register/verifyOtp',registerController.verifyOtp)

module.exports = registerRouters
