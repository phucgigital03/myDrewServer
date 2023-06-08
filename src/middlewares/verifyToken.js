const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(409).json({
            statusCode: 409,
            errorMessage: 'unauthorization',
        })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN,(error,decode)=>{
        if(error){
            return res.status(401).json({
                statusCode: 401,
                errorMessage: 'unauthorization',
                _retry: true,
            })
        }
        const roles = Object.values(decode.userInfo.roles)
        req.email = decode.userInfo.email;
        req.roles = roles;
        next()
    })
}

module.exports = verifyToken
