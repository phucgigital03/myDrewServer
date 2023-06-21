const amqplib = require('amqplib');
const dotenv = require('dotenv')
dotenv.config()

class FeatureRabbitMQ {
    // send
    async sendMessage({ msg }){
        // 1.connect
        const conn = await amqplib.connect(process.env.URL_RABBITMQ_ICLOUD);
        // 2.create channel
        const channel = await conn.createChannel();
        // 3.create nameQueue
        const nameQueue = 'test1'
        // 4.create queue
        await channel.assertQueue(nameQueue,{
            durable: true,
        })
        // 5.send to queue
        await channel.sendToQueue(nameQueue,Buffer.from(msg),{
            expiration: '60000',
            persistent: true
        })
    
        // 6. close conn and channel
        setTimeout(function() {
            conn.close();
            // process.exit(0)
        }, 15000);
    }

    // receive
    async receiveMessage(){
        // 1.connect
        const conn = await amqplib.connect(process.env.URL_RABBITMQ_ICLOUD);
        // 2.create channel
        const channel = await conn.createChannel();
        // 3.create nameQueue
        const nameQueue = 'test1'
        // 4.create queue
        await channel.assertQueue(nameQueue,{
            durable: true,
        })
        // many message 
        channel.prefetch(1);
        // 5.receive message to queue
        await channel.consume(nameQueue,(message)=>{
            console.log(`message:::${message.content.toString()}`)
            setTimeout(function() {
                console.log("[x]Done");
                channel.ack(message);
            },2000);
        },{
            noAck: false,
        })
    }

    //send Topic
    async pubTopicMessage({ key,msg }){
        // 1.connect
        const conn = await amqplib.connect(process.env.URL_RABBITMQ_ICLOUD);
        // 2.create channel
        const channel = await conn.createChannel();
        // 3.create Exchange
        const exchange = 'topic_inventory';
        channel.assertExchange(exchange, 'topic', {
            durable: true,
        });
        channel.publish(exchange, key, Buffer.from(msg));
        console.log(" [x] Sent %s:'%s'", key, msg);
        setTimeout(()=>{
            conn.close();
        },15000)
    }   

    // recevie Topic
    async subTopicMessage({listKey}){
        // 1.connect
        const conn = await amqplib.connect(process.env.URL_RABBITMQ_ICLOUD);
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
    
        await channel.consume(queue,(message)=>{
            console.log(" [x] %s:'%s'", message.fields.routingKey, message.content.toString());
            setTimeout(function() {
                console.log("[x]Done");
                channel.ack(message);
            },8000);
        },{
            noAck: false,
        })
    }

    // send fanout
    async pubFanoutMessage({ msg }){
        // 1.connect
        const conn = await amqplib.connect(process.env.URL_RABBITMQ_ICLOUD);
        // 2.create channel
        const channel = await conn.createChannel();
        // 3.create nameQueue
        const nameExchange = 'video'
        // 4.create exchange
        await channel.assertExchange(nameExchange, 'fanout', {
            durable: true
        });
        await channel.publish(nameExchange,'', Buffer.from(msg));
        
        setTimeout(function() {
            conn.close();
        }, 2000);
    }

    // recevie fanout
    async subFanoutMessage(){
        // 1.connect
        const conn = await amqplib.connect(process.env.URL_RABBITMQ_ICLOUD);
        // 2.create channel
        const channel = await conn.createChannel();
        // 3.create nameQueue
        const nameExchange = 'video'
        // 4.create exchange
        channel.assertExchange(nameExchange, 'fanout', {
            durable: true
        });
        // 5.connect queue
        const { queue } = await channel.assertQueue('',{
            exclusive: true
        })
        console.log(queue)
        await channel.bindQueue(queue,nameExchange,'');
        await channel.consume(queue, function(message) {
            console.log(message.content.toString());
        },{
            noAck: true
        });
    }
}

module.exports = new FeatureRabbitMQ()