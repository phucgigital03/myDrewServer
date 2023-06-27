const mongoose = require('mongoose');
const Carts = require('../models/Carts');
const Products = require('../models/Products');

class StripeService {
    // at getProductsInCart
    static async handleGetProducts(cartNew){
        const idInventorys = cartNew.products.map(product =>{
            return new mongoose.Types.ObjectId(product.inventoryId)
        })
        const products = await Products.aggregate([
            {
                $match: { idInventory: { $in : idInventorys } }
            },
            {
               $lookup: {
                  from: "inventories",
                  localField: "idInventory",    
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
        return products
    }
    // at getProductsInCart
    static handleMapQuatity(cartNew,products){
        const mapQuatity = new Map();
        cartNew?.products?.forEach((product) => {
            mapQuatity.set(product.inventoryId,product.quatity)
        })
        products.forEach((product)=>{
            product.quatity = mapQuatity.get(product.idInventory.toString())
        })
    }

    async getProductsInCart(cartId){
        try{
            const cartFound = await Carts.findOne({
                _id: cartId
            });
            const products = await StripeService.handleGetProducts(cartFound);
            StripeService.handleMapQuatity(cartFound,products);
            return {
                statusCode: 200,
                products: products
            }
        }catch(error){
            console.log(error)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
}

module.exports = new StripeService();
