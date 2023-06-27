const mongoose = require('mongoose')
const Products = require('../../models/Products')
const Inventories = require('../../models/Inventories')

class ProductService {
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
                },
                {
                    $group: {
                        _id: '$title',
                        data: {'$first': '$$ROOT'}
                    }
                },
                {   
                    $project: {
                        data: 1, 
                        _id: 0
                    }
                }
            ])
            const products = result.map((product) => product.data).filter((product)=> !product.deleted)
            return {
                statusCode: 200,
                lengthItems: products.length,
                products: products,
            }
        }catch(error){
            console.log(error)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async getOneDB(title){
        try{
            
            const results = await Inventories.aggregate([
                {
                    $match: { title: title }
                },
                { 
                    $project: {   
                        _id: 1,
                    } 
                }
            ])
            if(!results.length){
                return {
                    statusCode: 400,
                    errorMessage: 'bad required'
                }
            }
            const ids = results.map(objId => objId._id)
            const products = await Products.aggregate([
                {
                    $match: { idInventory: {$in: ids} }
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
            return {
                statusCode: 200,
                products: products.filter((product)=> !product.deleted)
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

module.exports = new ProductService();
