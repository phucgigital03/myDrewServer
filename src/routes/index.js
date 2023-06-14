const userRouters = require('./api/userRouters');
const orderHistoryRouters = require('./api/orderHistoryRouters');
const productRouters = require('./api/productRouters');
const refreshTokenRouters = require('./refreshTokenRouters');
const loginRouters = require('./loginRouters');
const logoutRouters = require('./logoutRouters');
const registerRouters = require('./registerRouters');

const routes = (app)=>{
    // v1/api/
    app.use('/v1/api/',userRouters)
    app.use('/v1/api/',orderHistoryRouters)
    app.use('/v1/api/',productRouters)

    // v1/ (authentication,authorization)
    app.use('/v1/',refreshTokenRouters)
    app.use('/v1/',loginRouters)
    app.use('/v1/',logoutRouters)
    app.use('/v1/',registerRouters)
}

module.exports = routes