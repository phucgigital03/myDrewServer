const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Order = new mongoose.Schema({ 
    userId: {type: String},
    customerId: {type: String},
    shipping: {type: Object, required: true},
    phoneNumber: {type: String,required: true},
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    payment: {type: String, required: true},
    paymentIntentId: {type: String},
    status: {type: String, required: true},
    subtotal: {type: Number,required: true, default: 0},
    total: {type: Number,required: true, default: 0},
    products: [{type: Object, required: true}],
},{
    timestamps: true,
});
Order.plugin(mongoose_delete,{ overrideMethods: 'all' })

const Orders = mongoose.model('Orders', Order);
module.exports = Orders
