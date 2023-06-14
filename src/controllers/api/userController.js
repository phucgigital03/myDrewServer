const userService = require("../../services/api/userService");

class UserController {
    // [get] /users
    async home(req,res,next){
        const {type , idUser} = req.query
        if(!type || !idUser){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad request'
            })
        }
        const result = await userService.getUser(type,idUser);
        if(result.statusCode === 500){
            return res.status(500).json({
                ...result
            })
        }
        if(result.statusCode === 200){
            return res.status(200).json({
                ...result
            })
        }
        return res.status(500).json({
            statusCode: 500,
            errorMessage: 'error server'
        })
    }  
}

module.exports = new UserController();