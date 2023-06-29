const express = require('express')
const app = express()
const server = require('http').createServer(app);
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const path = require('path');

const corsOptions = require('./configs/corsOption');
const routes = require('./routes/index.js');
const connectMongoDb = require('./configs/connectMongoDB');
const credentials = require('./middlewares/credentials');

// static file
app.use(express.static(path.join('./src','public')));
app.use(express.static(path.join('./src','public','uploads')));
// cors
app.use(credentials)
app.use(cors(corsOptions));

// config parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// confif cookie-parse
app.use(cookieParser())

// config routes
routes(app);

const port = process.env.PORT
const hostName = process.env.HOST_NAME;

(async ()=>{
    try{
        const result = await connectMongoDb()
        if(result){
            server.listen(port, hostName, () => {
                console.log(`backend app listening on port ${port}`)
            })
        }
    }catch(error){
        console.log(error)
    }
})()