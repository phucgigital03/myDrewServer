const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Inventory = new mongoose.Schema({ 
    title: {type: String, required: true},
    description: {type: String, required: true},
    quatity: {type: Number,required: true,default: 1},
    price: {type: Number,required: true},
    discount: {type: Number,required: true, default: 0},
    size: [{type: String,required: true}],
    color: [{type: String,required: true}],
    category: {type: String,required: true},
    listImg: [{type: String,required: true}],
    reservations: [{type: Object}],
    create_at: {type: Date, default: Date.now}
},{
    timestamps: true,
});
Inventory.plugin(mongoose_delete,{ overrideMethods: 'all' })

const Inventories = mongoose.model('Inventories', Inventory);
module.exports = Inventories
