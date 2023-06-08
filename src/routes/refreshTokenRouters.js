const express = require('express')
const refreshTokenRouters = express.Router();

const refreshTokenController = require('../controllers/refreshTokenController');

refreshTokenRouters.get('/refreshToken',refreshTokenController.refresh)

module.exports = refreshTokenRouters
