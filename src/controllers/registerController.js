const registerService = require('../services/registerService');
const registerValidation = require('../validations/registerValidation')

class registerController {
    async register(req,res,next){
        try{
            const formUser = req.body;
            const formValidated = await registerValidation.handleRegisterForm(formUser);
            const result = await registerService.registerUser(formValidated);
            if(result.statusCode === 409){
                return res.status(409).json({
                    ...result
                })
            }else if(result.statusCode === 200){
                return res.status(200).json({
                    ...result
                })
            }else if(result.statusCode === 500){
                return res.status(500).json({
                    ...result
                })
            }
        }catch(error){
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                errorMessage: 'error server'
            })
        }
    }
    async verifyOtp(req,res,next){
        try{
            const formUser = req.body;
            const formValidated = await registerValidation.handleVerifyOtpForm(formUser);
            const result = await registerService.verifyOtpAddUser(formValidated);
            if(result.statusCode === 200){
                return res.status(200).json({
                    ...result
                })
            }else if(result.statusCode === 401){
                return res.status(401).json({
                    ...result
                })
            }else if(result.statusCode === 409){
                return res.status(409).json({
                    ...result
                })
            }else if(result.statusCode === 500){
                return res.status(500).json({
                    ...result
                })
            }
        }catch(error){
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                errorMessage: 'error server'
            })
        }
    }
}

module.exports = new registerController();
