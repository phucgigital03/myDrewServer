const registerService = require('../services/registerService');
const registerValidation = require('../validations/registerValidation')

class registerController {
    // [post] /
    async register(req,res,next){
        try{
            const formUser = req.body;
            const formValidated = await registerValidation.handleRegisterForm(formUser);
            const infoUser = await registerService.registerUser(formValidated);
            if(infoUser.errorCode === 409){
                return res.status(409).json({
                    statusCode: 409,
                    errorMessage: 'conflict'
                })
            }else if(infoUser){
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

module.exports = new registerController();
