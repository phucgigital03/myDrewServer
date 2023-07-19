const { clientSub } = require('../configs/connectRedis');
const featureRabbitMQ = require('./rabbitMQ');

const psubscribeNotifyRedis = ()=>{
    clientSub.psubscribe('__keyevent@0__:expired',()=>{
        clientSub.on('pmessage',async (pattern,channel,message)=>{
            try{
                const cartId = message.split(':')[1];
                if(cartId){
                    console.log('cartId',cartId)
                    await featureRabbitMQ.pubTopicMessage({
                        key: 'reset.cart.inventory',
                        msg: cartId
                    })
                }
            }catch(error){
                console.log(error)
            }
        })
    });
}

module.exports = psubscribeNotifyRedis