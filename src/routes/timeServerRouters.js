const express = require('express')
const timeServerRouters = express.Router();

const timeServerController = require('../controllers/timeServerController');

timeServerRouters.get('/getTime',timeServerController.getTime)

module.exports = timeServerRouters
