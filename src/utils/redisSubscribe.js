const { clientSub } = require('../configs/connectRedis');
const featureRabbitMQ = require('./rabbitMQ');

const psubscribeNotifyRedis = ()=>{
    clientSub.psubscribe('__keyevent@0__:expired',()=>{
        clientSub.on('pmessage',async (pattern,channel,message)=>{
            try{
                console.log(message)
                const checkId = message.split(':')[1];
                const title = message.split(':')[0];
                console.log(title)
                if(title === 'cartId'){
                    if(checkId){
                        console.log('cartId',checkId)
                        await featureRabbitMQ.pubTopicMessage({
                            key: 'reset.cart.inventory',
                            msg: checkId
                        })
                    }
                }else if(title === 'orderId'){
                    if(checkId){
                        console.log('orderId', checkId)
                        await featureRabbitMQ.pubTopicMessage({
                            key: 'reset.order.inventory',
                            msg: checkId
                        })
                    }
                }
            }catch(error){
                console.log(error)
            }
        })
    });
}

module.exports = psubscribeNotifyRedis