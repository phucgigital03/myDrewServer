const loginService = require('../services/loginService');
const loginValidation = require('../validations/loginValidation')

class loginController {
    // [get] /
    async login(req,res,next){
        try{
            const formValidated = await loginValidation.handleLoginForm(req.body);
            const infoUser = await loginService.loginUser(formValidated)
            if(infoUser.errorCode === 401){
                return res.status(401).json({
                    statusCode: 401,
                    errorMessage: 'unauthorization'
                })
            }else if(infoUser.errorCode === 409){
                return res.status(409).json({
                    statusCode: 409,
                    errorMessage: 'conflict'
                })
            }else if(infoUser){
                res.cookie('jwt',infoUser.refreshToken,{ /*httpOnly: true , secure: true , sameSite: 'None',*/ maxAge: 24 * 60 * 60 * 1000})
                delete infoUser.refreshToken
                return res.status(200).json({
                    statusCode: 200,
                    data: infoUser
                })
            }
            return res.status(500).json({
                statusCode: 500,
                errorMessage: 'error server'
            })
        }catch(error){
            if(error.details){
                return res.status(400).json({
                    statusCode: 400,
                    errorMessage: error.details
                })
            }
            return res.status(500).json({
                statusCode: 500,
                errorMessage: 'error server'
            })
        }
    }
}

module.exports = new loginController();
