const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const connectMongoDb = async ()=>{
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME,
    }
    try{
        await mongoose.connect(process.env.DB_HOSTNAME,options);
        console.log('connect successful mongoDB')
        return 1;
    }catch(err){
        console.log(err)
        return null;
    }
}

module.exports = connectMongoDb