const userService = require("../../services/api/userService");

class UserController {
    // [get] /users
    async home(req,res,next){
        const {type , userId} = req.query
        if(!type || !userId){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad request'
            })
        }
        const result = await userService.getUser(type,userId);
        if(result.statusCode === 500){
            return res.status(500).json({
                ...result
            })
        }else if(result.statusCode === 200){
            return res.status(200).json({
                ...result
            })
        }else if(result.statusCode === 400){
            return res.status(400).json({
                ...result
            })
        }
        return res.status(500).json({
            statusCode: 500,
            errorMessage: 'error server'
        })
    }  
    testUsers(req,res){
        console.log('test user apache',req.body)
        return res.status(200).json({
            statusCode: 200,
            message: 'success'
        })
    }
}

module.exports = new UserController();