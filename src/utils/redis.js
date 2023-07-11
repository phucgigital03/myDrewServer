const { client } = require('../configs/connectRedis')

class FeatureRedis{
    async quitRedis(){
        await client.quit();
        console.log('Redis connection closed');
        return {
            statusCode: 200,
            message: 'disconnect success'
        }
    }
    async existsRedis(key){
        const result = await client.exists(key)
        return result
    }
    async expireRedis(key,time){
        const result = await client.expire(key,time)
        return result
    }
    async setRedis(key,value){
        const result = await client.set(key,value);
        return result
    }
    async getRedis(key){
        const result = await client.get(key);
        return result
    }
    async incrBy(key,value){
        const result = await client.incrby(key,value);
        return result
    }
    async decrBy(key,value){
        const result = await client.decrby(key,value);
        return result
    }
    async delRedis(key){
        const result = await client.del(key);
        return result
    }
    async setNxRedis(key,value){
        const result = await client.setnx(key,value);
        return result
    }
    async hsetNxRedis(key,field,value){
        const result = await client.hsetnx(key,field,value);
        return result
    }
    async hIncrByRedis(key,field,value){
        const result = await client.hincrby(key,field,value);
        return result
    }
    async hDecrByRedis(key,field,value){
        value = -Number(value)
        const result = await client.hincrby(key,field,value);
        return result
    }
    async hdelRedis(key,field){
        const result = await client.hdel(key,field);
        return result
    }
    async hgetRedis(key,field){
        const result = await client.hget(key,field);
        return result
    }
    async hgetallRedis(key){
        const result = await client.hgetall(key);
        return result
    }
    psubscribeNotifyRedis(){
        client.psubscribe('__keyevent@0__:expired',()=>{
            client.on('pmessage',(pattern,channel,message)=>{
                console.log(message)
            })
        });
    }
}

module.exports = new FeatureRedis();