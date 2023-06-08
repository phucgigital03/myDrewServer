const { renderRedis } = require('../config/redis/connectRedis')

const incr = (key)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await renderRedis.incr(key)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const expire = (key,valueTime)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await renderRedis.expire(key,valueTime)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const getTtl = (key)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await renderRedis.ttl(key)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const incrby = (key,numberIncr)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await renderRedis.incrby(key,numberIncr)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const decrby = (key,numberIncr)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await renderRedis.decrby(key,numberIncr)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const set = (key,valueSet)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await renderRedis.set(key,valueSet)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const setnx = (key,valueSet)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await renderRedis.setnx(key,valueSet)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const get = (key)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await renderRedis.get(key)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const dele = (key)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await renderRedis.del(key)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const allKey = ()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await renderRedis.keys('*')
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const exist = (key)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await renderRedis.exists(key)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

module.exports = {
    incr,
    expire,
    getTtl,
    incrby,
    set,
    setnx,
    get,
    dele,
    exist,
    decrby,
    allKey
}