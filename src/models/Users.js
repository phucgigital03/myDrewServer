const mongoose = require('mongoose');

const User = new mongoose.Schema({ 
    firstName: {type: String , required: true, default: ''}, 
    lastName: {type: String , required: true, default: ''}, 
    email: {type: String , required: true},
    password: {type: String, required: true},
    roles: {
        user: {
            type: Number,
            default: 2003
        },
        employment: Number,
        addmin: Number,
    },
    refreshToken: { type: String },
});

const Users = mongoose.model('Users', User);
module.exports = Users
