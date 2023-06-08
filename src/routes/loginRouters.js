const express = require('express')
const loginRouters = express.Router();

const loginController = require('../controllers/loginController');

loginRouters.get('/login',loginController.login)

module.exports = loginRouters
