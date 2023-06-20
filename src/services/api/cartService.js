const mongoose = require('mongoose')
const Carts = require('../../models/Carts')
const Inventories = require('../../models/Inventories')

class CartService {
    async createCartDB(data){
        let {userId,cartId,inventoryId,quatity} = data
        try{
            const stock = await Inventories.updateOne({
                $and: [
                    {
                        _id: inventoryId
                    },
                    {
                        quatity: {$gt: quatity}
                    }
                ]
            },{
                $inc: {quatity: -quatity},
                $push: {
                    reservations: {
                        inventoryId: inventoryId,
                        quatity: Number(quatity)
                    }
                }
            })
            // check product have pass inventory ?
            if(stock.modifiedCount){
                if(!cartId){
                    cartId = new mongoose.Types.ObjectId();
                }
                const result = await Carts.findOneAndUpdate({
                    _id: cartId
                },{
                    $push: {
                        products: {
                            inventoryId: inventoryId,
                            quatity: Number(quatity)
                        }
                    } 
                },{
                    upsert: true,
                    new: true
                })
                return {
                    statusCode: 200,
                    cart: result
                }
            }

            return {
                statusCode: 400,
                errorMessage: 'bad required'
            }
        }catch(error){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
}

module.exports = new CartService();
