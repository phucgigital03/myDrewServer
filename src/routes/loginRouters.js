const express = require('express')
const loginRouters = express.Router();

const loginController = require('../controllers/loginController');

loginRouters.post('/login',loginController.login)

module.exports = loginRouters
