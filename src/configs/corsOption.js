const allowCors = require("./allowCors")

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowCors.indexOf(origin) !== -1) {
        callback(null, true)
    } else {
        callback(new Error('Not allowed by CORS'))
    }
  }
}

module.exports = corsOptions
  