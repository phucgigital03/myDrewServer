const express = require('express')
const userRouters = express.Router();

const userController = require('../../controllers/userController');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const roles = require('../../configs/allowRoles');

userRouters.get('/users',verifyToken,verifyRoles(roles.addmin),userController.home)

module.exports = userRouters
