

class UserController {
    // [get] /users
    home(req,res,next){
        return res.status(200).json({
            statusCode: 200,
            message: 'hello phuc nguyen'
        })
    }
    
    
    
}

module.exports = new UserController();