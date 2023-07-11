const Redis = require("ioredis")
const dotenv = require('dotenv')
dotenv.config()

const client = new Redis(process.env.URL_REDIS_ICLOUD)

client.on('connect', function() {
    console.log('Redis is connected!');
});

client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = {
    client: client,
}