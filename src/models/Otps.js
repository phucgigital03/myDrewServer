const mongoose = require('mongoose');

const Otp = new mongoose.Schema({ 
    email: { type: String , required: true},
    otp: {type: String, required: true},
    time: {type: Date, default: Date.now, expires: 60}
});

const Otps = mongoose.model('Otps', Otp);
module.exports = Otps
