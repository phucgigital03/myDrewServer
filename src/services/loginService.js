const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
dotenv.config()

const Users = require('../models/Users')
const mongooseToObj = require('../utils/mongooseToObj')

class loginService {
    // [get] /
    async loginUser(formValidated){
        try{
            const foundUser = await Users.findOne({ email: formValidated.email }).exec();
            if(!foundUser){
                return {
                    statusCode: 401
                }
            }
            const checkPwd = await bcrypt.compare(formValidated.password,foundUser.password);
            if(!checkPwd){
                return {
                    statusCode: 409
                }
            }
            const accessToken = jwt.sign(
                {
                    userInfo: {
                        email: foundUser.email,
                        roles: foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN,
                {
                    expiresIn: '60s'
                })
            const refreshToken = jwt.sign(
                {
                    userInfo: {
                        email: foundUser.email,
                        roles: foundUser.roles
                    }
                },
                process.env.REFRESH_TOKEN,
                {
                    expiresIn: '1d'
                })
            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();
            return {
                accessToken,
                ...mongooseToObj.oneObj(result)
            }
        }catch(err){
            console.log(err)
            return null;
        }
    }
}

module.exports = new loginService()
