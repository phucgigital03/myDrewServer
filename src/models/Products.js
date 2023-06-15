const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Product = new mongoose.Schema({ 
    title: {type: String, required: true},
    description: {type: String, required: true},
    listImg: [{type: String,required: true}],
    price: {type: Number,required: true},
    discount: {type: Number,required: true, default: 0},
    size: [{type: String,required: true,}],
    color: [{type: String,required: true,}],
    productRef: [{type: mongoose.Schema.Types.ObjectId,ref: 'Products'}]
},{
    timestamps: true,
});
Product.plugin(mongoose_delete,{ overrideMethods: 'all' })

const Products = mongoose.model('Products', Product);
module.exports = Products
