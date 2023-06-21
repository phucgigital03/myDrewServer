const Redis = require("ioredis")
const dotenv = require('dotenv')
dotenv.config()

const client = new Redis(process.env.URL_REDIS_ICLOUD)
const clientSubscribe = new Redis(process.env.URL_REDIS_ICLOUD);

client.on('connect', function() {
    console.log('Redis is connected!');
    clientSubscribe.on('connect',function(){
        console.log('Redis subscribe is connected!')
    })
});

module.exports = {
    client: client,
    clientSubscribe: clientSubscribe
}