const jwt = require('jsonwebtoken');
const User = require('../models/Users')

class refreshTokenController {
    async refresh(req,res,next){
        const cookies = req.cookies;
        console.log(cookies?.jwt)
        if(!cookies?.jwt){
            res.clearCookie('jwt',{ httpOnly: true , secure: true , sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
            return res.status(401).json({
                statusCode: 401,
                errorMessage: 'unauthorization'
            })
        }
        const foundUser = await User.findOne({refreshToken: cookies?.jwt});
        if(!foundUser){
            res.clearCookie('jwt',{ httpOnly: true , secure: true , sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
            return res.status(409).json({
                statusCode: 409,
                errorMessage: 'conflict'
            })
        }
        jwt.verify(cookies?.jwt,process.env.REFRESH_TOKEN,async (err,decode)=>{
            if(err || decode.userInfo.email !== foundUser.email){
                foundUser.refreshToken = ''
                await foundUser.save()
                res.clearCookie('jwt',{ httpOnly: true , secure: true , sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
                return res.status(403).json({
                    statusCode: 403,
                    errorMessage: 'forbiden'
                })
            }
            const accessToken = jwt.sign({
                userInfo: {
                    id: foundUser._id,
                    email: foundUser.email,
                    roles: foundUser.roles
                }
            },
                process.env.ACCESS_TOKEN,
            {
                expiresIn: '20s'
            })
            return res.status(200).json({
                statusCode: 200,
                accessToken: accessToken
            })
        })
    }
}

module.exports = new refreshTokenController()
