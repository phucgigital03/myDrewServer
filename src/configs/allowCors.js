const whitelist = [
  'http://localhost:3000', 
  'https://paymentstripeandpaypal.onrender.com',
]

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
    } else {
        callback(new Error('Not allowed by CORS'))
    }
  }
}

module.exports = corsOptions
  