const mongoose = require('mongoose')
const Products = require('../../models/Products')

class productService {
    async getDB(){
        try{
            const result = await Products.aggregate([
                {
                   $lookup: {
                      from: "inventories",
                      localField: "idInventory",    
                      foreignField: "_id",
                      as: "fromInventories"
                   }
                },
                {
                   $replaceRoot: { 
                    newRoot: { 
                        $mergeObjects: [ "$$ROOT", { $arrayElemAt: [ "$fromInventories", 0 ] }]
                }}},
                {  
                    $project: {
                        fromInventories: 0,
                        reservations: 0
                    } 
                }
            ])
            return {
                statusCode: 200,
                products: result.filter((product)=> !product.deleted)
            }
        }catch(error){
            console.log(error)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async getOneDB(id){
        try{
            const result = await Products.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(id) }
                },
                {
                   $lookup: {
                      from: "inventories",
                      localField: "idInventory",    
                      foreignField: "_id",
                      as: "inventories"
                   }
                },
                {
                   $replaceRoot: { newRoot: { $mergeObjects: [ "$$ROOT",{ $arrayElemAt: [ "$inventories", 0 ] } ] } }
                },
                { 
                    $project: {   
                        inventories: 0,
                        reservations: 0
                    } 
                }
            ])
            return {
                statusCode: 200,
                product: result.filter((product)=> !product.deleted)
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

module.exports = new productService();
