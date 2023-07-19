const Redis = require("ioredis")
const dotenv = require('dotenv')
dotenv.config()

const client = new Redis(process.env.URL_REDIS_ICLOUD)
const clientSub = new Redis(process.env.URL_REDIS_ICLOUD)

client.on('connect', function() {
    console.log('Redis is connected!');
});
clientSub.on('connect',function(){
    console.log('Redis Subscribe is connected!');
})

client.on('error', (err) => {
    console.error('Redis connection error:', err);
});
clientSub.on('error', (err) => {
    console.error('Redis Subscribe connection error:', err);
});

module.exports = {
    client: client,
    clientSub: clientSub
}