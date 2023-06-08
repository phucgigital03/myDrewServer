const User = require('../models/Users')

class logoutController {
    // [get] /
    async logout(req,res,next){
        try{
            const cookies = req.cookies
            console.log(cookies?.jwt)
            if(!cookies?.jwt){
                return res.status(204).json({
                    statusCode: 204,
                    message: 'no content'
                })
            }
            const foundUser = await User.findOne({refreshToken: cookies?.jwt});
            if(!foundUser){
                res.clearCookie('jwt',{ httpOnly: true , secure: true , sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
                return res.status(200).json({
                    statusCode: 200,
                    message: 'logout success'
                })
            }
            foundUser.refreshToken = '';
            await foundUser.save();
            res.clearCookie('jwt',{ httpOnly: true , secure: true , sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
            return res.status(200).json({
                statusCode: 200,
                message: 'logout success'
            })
        }catch(error){
            console.log(error)
            return res.status(500).json({
                statusCode: 500,
                errorMessage: 'server error'
            })
        }
    }
}

module.exports = new logoutController();
