const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Cart = new mongoose.Schema({ 
    userId: {type: mongoose.Schema.Types.ObjectId},
    modifiedOn: {type: Date, default: Date.now},
    status: {type: String, default: 'active'},
    products: [{type: Object}],
},{
    timestamps: true,
});
Cart.plugin(mongoose_delete,{ overrideMethods: 'all' })

const Carts = mongoose.model('Carts', Cart);
module.exports = Carts
