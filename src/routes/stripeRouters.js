const express = require('express')
const stripeRouters = express.Router();

const stripeController = require('../controllers/stripeController');

stripeRouters.post('/stripe/create-checkout-session',stripeController.getUrl)

module.exports = stripeRouters
