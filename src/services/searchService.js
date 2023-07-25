const aqp = require('api-query-params');
const Inventories = require('../models/Inventories');
const mongooseToObj = require('../utils/mongooseToObj');

class searchService {
    async getProductDB(query){
        try{
            let { filter,limit } = aqp(query);
            const { q } = filter;
            if(!q){
                return {
                    statusCode: 400,
                    errorMessage: 'bad required: no query,no limit'
                }
            }
            if(!limit){
                limit = 100;
            }
            // get Inventory DB 
            const inventoriesFound = await Inventories.find({
                $or: [
                    {title: {$regex: q, $options: 'i' }},
                    {description: {$regex: q, $options: 'i' }}
                ]
            })
            .limit(limit)

            // handle dele quatity,reservations
            const products = mongooseToObj.mutipleObj(inventoriesFound).map(inventory => {
                const { quatity,reservations,...newProduct } = inventory
                return newProduct
            })
            return {
                statusCode: 200,
                itemLength: products.length,
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
}

module.exports = new searchService()
