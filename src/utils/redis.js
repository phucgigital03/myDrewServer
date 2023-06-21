const { client,clientSubscribe } = require('../configs/connectRedis')

class FeatureRedis{
    async disConnectRedis(){
        try{
            await client.disconnect();
            return {
                statusCode: 200,
                message: 'disconnect success'
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'disconnect error'
            }
        }
    }
    async setRedis(key,value){
        try{
            const result = await client.set(key,value);
            return {
                statusCode: 200,
                data: result
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async getRedis(key){
        try{
            const result = await client.get(key);
            return {
                statusCode: 200,
                data: result
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async incrBy(key,value){
        try{
            const result = await client.incrBy(key,value);
            return {
                statusCode: 200,
                data: result
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async delRedis(key){
        try{
            const result = await client.del(key);
            return {
                statusCode: 200,
                data: result
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async setNxRedis(key,value){
        try{
            const result = await client.setnx(key,value);
            return {
                statusCode: 200,
                data: result
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async setNxExRedis(key,value,expired){
        try{
            const result = await client.setnx(key,value);
            await client.expire(key,expired)
            return {
                statusCode: 200,
                data: result
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    psubscribeNotifyRedis(){
        clientSubscribe.psubscribe('__keyevent@0__:expired',()=>{
            clientSubscribe.on('pmessage',(pattern,channel,message)=>{
                console.log(message)
            })
        });
    }
}

module.exports = new FeatureRedis();