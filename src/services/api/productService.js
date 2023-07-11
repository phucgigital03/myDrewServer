const mongoose = require('mongoose')
const Products = require('../../models/Products')
const Inventories = require('../../models/Inventories')
const aqp = require('api-query-params');

class ProductService {
    async getDB(query){
        let sortData = {
            title: 1,
        };
        const { filter,sort } = aqp(query);
        const { price,category } = filter
        if(category === 'newArrivals'){
            delete filter.category;
        }
        if(price){
            const priceResult = price.split('-');
            const startNum = Number(priceResult[0]);
            const endNum = Number(priceResult[1]);
            filter.price = {
                $gte : startNum, 
                $lte : endNum 
            }
        }
        if(sort){
            sortData = {
                ...sort,
                ...sortData
            }
        }
        console.log(filter,sortData)
        try{
            const inventoryFound = await Inventories.aggregate([
                {$match: filter},
                {$project: {_id: 1}}
            ])
            const inventoryIds = inventoryFound.map(itemId => itemId._id)
            const result = await Products.aggregate([
                {$match: {inventoryId: {$in: inventoryIds}}},
                {$lookup: { from: "inventories",localField: "inventoryId",foreignField: "_id",as: "fromInventories" }},
                {$replaceRoot: { newRoot: {$mergeObjects: [ "$$ROOT", { $arrayElemAt: [ "$fromInventories", 0 ] }]} }},
                {$project: { fromInventories: 0,reservations: 0 }},
                {$sort: sortData},
                 // if merge title like same, get data of title first, else get data of that title
                {$group: {_id: '$title',data: {'$first': '$$ROOT'} }},
                {$project: {data: 1,_id: 0}},
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
                {$match:{ title: title }},
                {$project: {_id: 1}}
            ])
            if(!results.length){
                return {
                    statusCode: 400,
                    errorMessage: `bad required: not have ${title}`
                }
            }
            const ids = results.map(objId => objId._id)
            const products = await Products.aggregate([
                {$match: { inventoryId: {$in: ids} }},
                {$lookup: { from: "inventories", localField: "inventoryId", foreignField: "_id", as: "inventory"}},
                {$replaceRoot: { newRoot: { $mergeObjects: [ "$$ROOT",{ $arrayElemAt: [ "$inventory", 0 ] } ] } }},
                {$project: {inventory: 0,reservations: 0}}
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
