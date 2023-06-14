const express = require('express')
const userRouters = express.Router();

const userController = require('../../controllers/api/userController');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRoles = require('../../middlewares/verifyRoles');
const roles = require('../../configs/allowRoles');

userRouters.get('/users',verifyToken,verifyRoles(roles.addmin,roles.employment,roles.user),userController.home)

module.exports = userRouters
