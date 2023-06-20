const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Order = new mongoose.Schema({ 
    userId: {type: mongoose.Schema.Types.ObjectId,required: true},
    cartId: {type: mongoose.Schema.Types.ObjectId,required: true},
    shipping: {type: Object},
    payment: {type: String},
    status: {type: String},
    totalPrice: {type: Number,required: true, default: 0},
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Products'}],
},{
    timestamps: true,
});
Order.plugin(mongoose_delete,{ overrideMethods: 'all' })

const Orders = mongoose.model('Orders', Order);
module.exports = Orders
