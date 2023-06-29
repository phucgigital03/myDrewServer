const mongoose = require('mongoose');

const User = new mongoose.Schema({ 
    firstName: { type: String , required: true, default: ''}, 
    lastName: { type: String , required: true, default: ''}, 
    email: { type: String , required: true},
    password: {type: String},
    roles: {
        user: {
            type: Number,
            default: 2003
        },
        employment: Number,
        addmin: Number,
    },
    refreshToken: { type: String },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders'
    }]
});

const Users = mongoose.model('Users', User);
module.exports = Users
