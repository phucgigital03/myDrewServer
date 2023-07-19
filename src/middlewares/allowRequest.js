const redisFeatures = require('../utils/redis');
const genSign = require('../utils/genSign');
const REQ_IN_ONE_MINUS = 1;
const REQ_TIME = 50; //seconds

const allowRequest = async (req,res,next)=>{
    try{
        const { sign,stime,nonce } = req.query;
        console.log('sign',sign)
        console.log('stime',stime)
        console.log('nonce',nonce)
        // handle check data
        if(!sign || !stime || !nonce){
            return res.status(401).json({
                statusCode: 401,
                errorMessage: 'bad required'
            })
        }
        // handle expire Api
        const timeServer = Date.now();
        const ttlApi = Math.floor((timeServer - stime) / 1000);
        console.log(`ttlApi::${ttlApi}`)
        if(ttlApi > REQ_TIME){
            return res.status(403).json({
                statusCode: 403,
                errorMessage: 'expire required'
            })
        }
        // handle check sign
        const signServer = genSign(req.query);
        console.log(`signClient:::${sign}`,`signServer:::${signServer}`);
        if(sign !== signServer){
            return res.status(401).json({
                statusCode: 401,
                errorMessage: 'bad required: sign invalid'
            })
        }
        // handle check nonce
        const checkNonce = await redisFeatures.setNxRedis(nonce,true);
        console.log('checkNonce',checkNonce)
        if(!checkNonce){
            return res.status(401).json({
                statusCode: 401,
                errorMessage: 'bad required: nonce exists'
            })
        }else{
            await redisFeatures.expireRedis(nonce,60 * 4);
        }
        // handle many request in 1 minus
        const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        // const userIP = '128.0.0.1';
        const numReq = await redisFeatures.incrBy(`${userIP}`,1);
        let ttlNumReq;
        if(numReq === 1){
            await redisFeatures.expireRedis(`${userIP}`,50);
            ttlNumReq = 60;
        }else{
            ttlNumReq = await redisFeatures.ttlRedis(`${userIP}`)
        }
        console.log(`user IP: ${userIP}`);
        console.log(`number request: ${numReq}`)
        console.log(`time allow request again: ${ttlNumReq}`)
        if(numReq > REQ_IN_ONE_MINUS){
            return res.status(403).json({
                statusCode: 403,
                errorMessage: 'no allow request in short time'
            })
        }
        next();
    }catch(error){
        console.log(error)
        return res.status(500).json({
            statusCode: 500,
            errorMessage: 'error server'
        })
    }
}

module.exports = allowRequest