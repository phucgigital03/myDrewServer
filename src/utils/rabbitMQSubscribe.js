const amqplib = require('amqplib');
const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose')
const Carts = require('../models/Carts')
const Inventories = require('../models/Inventories')
const redisFeatures = require('../utils/redis')

// recevie Topic
const subTopicMessageRabbit = async({listKey})=>{
    // 1.connect
    const conn = await amqplib.connect(process.env.URL_RABBITMQ_ICLOUD,{heartbeat: 60});
    // 2.create channel
    const channel = await conn.createChannel();
    // 3.create Exchange
    const exchange = 'topic_inventory';
    channel.assertExchange(exchange, 'topic', {
        durable: true,
    });
    // 4.bind Queue
    const { queue } = await channel.assertQueue('',{
        exclusive: true,
    })
    listKey.forEach(async (key)=> {
        await channel.bindQueue(queue,exchange,key);
    })
    // 5. many message
    await channel.prefetch(1);

    await channel.consume(queue, async (message)=>{
        const filed = message.fields.routingKey;
        const cartId =  message.content.toString()
        console.log("[x] Recevie %s:'%s'", filed, cartId);
        const cartOld = await Carts.findOneAndUpdate({
            $and: [{_id: cartId},{status: 'active'}]
        },{
            $set: { products: [] }
        })
        const inventoryArr = cartOld.products;
        let quatityNew;
        for(const inventory of inventoryArr){
            const resultSize = await Inventories.aggregate([{
                $match: { _id: new mongoose.Types.ObjectId(inventory.inventoryId) }
            },
            {
                $project: {_id: 0, quatitySize: {$size: "$reservations"}}
            }])
            if(resultSize?.[0]?.quatitySize){
                quatityNew = resultSize?.[0]?.quatitySize - inventory.quatity;
                console.log('quatity reservations:',quatityNew)
                await Inventories.updateOne({
                    _id: inventory.inventoryId
                },{
                    $inc: { quatity: inventory.quatity },
                    $push: {reservations: { $each: [], $slice: quatityNew}}
                })
            }
        }
        console.log('updated inventories:',inventoryArr);
        for(const item of inventoryArr){
            const qtySellReal = await redisFeatures.decrBy(`qtySellReal:${item.inventoryId}`,item.quatity);
            await redisFeatures.delRedis(`qtySell:${item.inventoryId}`);
            await redisFeatures.setNxRedis(`qtySell:${item.inventoryId}`,qtySellReal)
        }
        console.log('updated qtyRealSell,qtySell in Redis')
        console.log("[x]Done");
        channel.ack(message);
    },{
        noAck: false,
    })
}

module.exports = subTopicMessageRabbit