const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Product = new mongoose.Schema({ 
    idInventory: {type: mongoose.Schema.Types.ObjectId, required: true},
    spec: [{type: Object}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comments'}],
    productRef: [{type: mongoose.Schema.Types.ObjectId,ref: 'Products'}],
},{
    timestamps: true,
});
Product.plugin(mongoose_delete,{ overrideMethods: 'all' })

const Products = mongoose.model('Products', Product);
module.exports = Products
