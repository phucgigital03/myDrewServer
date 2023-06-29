const mongoose = require('mongoose');
const Products = require('../models/Products');

const handleMapQuatity = (cartNew,products)=>{
    const mapQuatity = new Map();
    cartNew?.products?.forEach((product) => {
        mapQuatity.set(product.inventoryId,product.quatity)
    })
    products.forEach((product)=>{
        product.quatity = mapQuatity.get(product.inventoryId.toString())
    })
}

const handleGetProducts = async (cartNew)=>{
    const inventoryIds = cartNew.products.map(product =>{
        return new mongoose.Types.ObjectId(product.inventoryId)
    })
    const products = await Products.aggregate([
        {
            $match: { inventoryId: { $in : inventoryIds } }
        },
        {
           $lookup: {
              from: "inventories",
              localField: "inventoryId",    
              foreignField: "_id",
              as: "inventory"
           }
        },
        {
           $replaceRoot: { newRoot: { $mergeObjects: [ "$$ROOT",{ $arrayElemAt: [ "$inventory", 0 ] } ] } }
        },
        { 
            $project: {   
                inventory: 0,
                reservations: 0
            } 
        }
    ])
    handleMapQuatity(cartNew,products);
    return products;
}

module.exports = {
    handleGetProducts
}
