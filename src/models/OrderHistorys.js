const mongoose = require('mongoose');

const OrderHistory = new mongoose.Schema({ 
    totalPrice: {type: Number, required: true },
    status: {type: String, required: true, default: ''},
    address: {
        province: { type: String, required: true},
        district: { type: String, required: true},
        commune: { type: String, required: true},
        details: { type: String, required: true},
    }
},
{ timestamps: true }
);

const OrderHistorys = mongoose.model('OrderHistorys', OrderHistory);
module.exports = OrderHistorys
