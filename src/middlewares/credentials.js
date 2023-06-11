const allowCors = require('../configs/allowCors')

const credentials = (req,res,next)=>{
    const origin = req.headers.origin
    if(allowCors.includes(origin)){
        res.header('Access-Control-Allow-Credentials',true)
    }
    next();
}

module.exports = credentials
