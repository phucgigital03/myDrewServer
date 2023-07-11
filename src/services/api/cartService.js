const mongoose = require('mongoose')
const Carts = require('../../models/Carts')
const Inventories = require('../../models/Inventories')
const { handleGetProducts } = require('../../utils/getProducts');
const redisFeatures = require('../../utils/redis');

class CartService {
    // at updateMinus
    static async handleCheckCartMinus(cartId,inventoryId){
        const checkCart = await Carts.findOne({
            $and: [{_id: cartId},{status: 'active'},{products: {$elemMatch: {inventoryId: inventoryId,quatity: {$gt: 1 }}}}]
        })
        return checkCart
    }
    // at updatePlus
    static async handleCheckCartPlus(cartId,inventoryId){
        const checkCart = await Carts.findOne({
            $and: [{_id: cartId},{status: 'active'},{products: {$elemMatch: {inventoryId: inventoryId}}}]
        })
        return checkCart
    }
    // at createCartDB
    async setCartRedis(cartId,inventoryId,quatity){
        const result = await redisFeatures.hsetNxRedis(`cartId:${cartId}`,`productId:${inventoryId}`,quatity)
        await redisFeatures.expireRedis(`cartId:${cartId}`,60 * 60);
        console.log('saved cart success', result);
        return result
    }
    // handle plus product in cart at createCartDB, at updatePlus
    async plusProInCartRedis(cartId,inventoryId,quatity){
        const result = await redisFeatures.hIncrByRedis(`cartId:${cartId}`,`productId:${inventoryId}`,quatity)
        console.log('saved cart success', result);
        return result
    }
    // handle minus product in cart at updateMinus
    async minusProInCartRedis(cartId,inventoryId,quatity){
        const result = await redisFeatures.hDecrByRedis(`cartId:${cartId}`,`productId:${inventoryId}`,quatity)
        const qtySellReal = await redisFeatures.decrBy(`qtySellReal:${inventoryId}`,quatity);
        await redisFeatures.delRedis(`qtySell:${inventoryId}`);
        await redisFeatures.setNxRedis(`qtySell:${inventoryId}`,qtySellReal)
        console.log('saved cart success', result);
        console.log('qtySellreal',qtySellReal);
        return result
    }
    // handle dele product in cart at deleProductCartDB
    async deleProInCartRedis(cartId,inventoryId,quatity){
        const result = await redisFeatures.hdelRedis(`cartId:${cartId}`,`productId:${inventoryId}`);
        const qtySellReal = await redisFeatures.decrBy(`qtySellReal:${inventoryId}`,quatity);
        await redisFeatures.delRedis(`qtySell:${inventoryId}`);
        await redisFeatures.setNxRedis(`qtySell:${inventoryId}`,qtySellReal)
        console.log('saved cart success', result);
        console.log('qtySellreal',qtySellReal);
        return result
    }

    async createCartDB(data){
        let { userId,cartId,inventoryId } = data
        let quatity = 1;
        try{
            const stock = await Inventories.updateOne({
                $and: [{_id: inventoryId},{quatity: {$gt: quatity}}]
            },{
                $inc: {quatity: -quatity},
                $push: {reservations: {inventoryId: inventoryId,quatity: quatity}}
            })
            // check product pass inventory ?
            if(stock.modifiedCount){
                let cartFound,cartNew;
                cartFound = await Carts.findOne({
                    $and: [{_id: cartId},{status: "active"}]
                })
                console.log(`cart found`,cartFound)
                if(cartFound){
                    const checkOldProduct = cartFound.products.find(product => product.inventoryId === inventoryId);
                    // if check have old product then plus quatity, else push element
                    if(checkOldProduct){
                        cartNew = await Carts.findOneAndUpdate({
                            $and: [{_id: cartId},{products: {$elemMatch: {inventoryId: inventoryId }}}]
                        },{
                            $inc: {"products.$.quatity": quatity}
                        },{
                            new: true
                        })
                        const cartIdRedis = cartNew?._id?.toString();
                        await this.plusProInCartRedis(cartIdRedis,inventoryId,quatity);
                    }else{
                        cartNew = await Carts.findOneAndUpdate({
                            _id: cartId
                        },{
                            $push: {products: { inventoryId: inventoryId, quatity: quatity}}
                        },{
                            new: true
                        })
                        const cartIdRedis = cartNew?._id?.toString();
                        await this.setCartRedis(cartIdRedis,inventoryId,quatity);
                    }
                }else{
                    cartNew = await Carts.create({
                        products: [{ inventoryId: inventoryId, quatity: quatity}]
                    })
                    const cartIdRedis = cartNew?._id?.toString();
                    await this.setCartRedis(cartIdRedis,inventoryId,quatity);
                }
                // change quatity in inventory to quatity of customer
                console.log(`cart new`,cartNew)
                const products = await handleGetProducts(cartNew);
                return {
                    statusCode: 200,
                    cart: cartNew,
                    products: products
                }
            }
            return {
                statusCode: 400,
                errorMessage: 'bad required'
            }
        }catch(error){
            console.log(error)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async updatePlus(data){
        let {userId,cartId,inventoryId} = data
        let quatity = 1;
        try{
            const checkCart = await CartService.handleCheckCartPlus(cartId,inventoryId);
            console.log(checkCart)
            if(checkCart){
                const stock = await Inventories.updateOne({
                    $and: [{_id: inventoryId},{quatity: {$gt: quatity}}]
                },{
                    $inc: {quatity: -quatity},
                    $push: { reservations: { inventoryId: inventoryId, quatity: quatity } }
                })
                if(stock.modifiedCount){
                    const cartNew = await Carts.findOneAndUpdate({
                        $and: [{_id: cartId},{status: 'active'},{products: {$elemMatch: {inventoryId: inventoryId}}}]
                    },{
                        $inc: { "products.$.quatity": quatity }
                    },{
                        new: true
                    })
                    const cartIdRedis = cartNew?._id?.toString();
                    this.plusProInCartRedis(cartIdRedis,inventoryId,quatity);
                    // change quatity in inventory to quatity of customer
                    const products = await handleGetProducts(cartNew);
                    return {
                        statusCode: 200,
                        cart: cartNew,
                        products: products
                    }
                }
                return {
                    statusCode: 400,
                    errorMessage: 'bad required: too many product'
                }
            }
            return {
                statusCode: 400,
                errorMessage: 'bad required: cartId,inventoryId are invalid'
            }
        }catch(error){
            console.log(error)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async updateMinus(data){
        let { userId,cartId,inventoryId } = data
        let quatity = 1;
        try{
            const checkCart = await CartService.handleCheckCartMinus(cartId,inventoryId);
            console.log(checkCart)
            if(checkCart){
                const stock = await Inventories.updateOne({
                    _id: inventoryId
                },{
                    $inc: { quatity: quatity },
                    $pop: { reservations: 1 }
                })
                if(stock.modifiedCount){
                    const cartNew = await Carts.findOneAndUpdate({
                        $and: [{_id: cartId},{products: {$elemMatch: {inventoryId: inventoryId}}}]
                    },{
                        $inc: {"products.$.quatity": -quatity}
                    },{
                        new: true
                    })
                    const cartIdRedis = cartNew?._id?.toString();
                    await this.minusProInCartRedis(cartIdRedis,inventoryId,quatity);
                    // change quatity in inventory to quatity of customer
                    const products = await handleGetProducts(cartNew);
                    return {
                        statusCode: 200,
                        cart: cartNew,
                        products: products
                    }
                }
                return {
                    statusCode: 400,
                    errorMessage: 'bad required: inventoryId are invalid'
                }
            }
            return {
                statusCode: 400,
                errorMessage: 'bad required: cartId,inventoryId,quatity are invalid'
            }
        }catch(error){
            console.log(error)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async deleProductCartDB(data){
        let { userId,cartId,inventoryId,quatity } = data
        let quatityNew;
        quatity = Number(quatity);
        try{
            const cartNew = await Carts.findOneAndUpdate({ 
                $and: [{_id: cartId},{status: 'active'},{products: {$elemMatch: {inventoryId: inventoryId}}}]
            },
            { 
                $pull: { products: { inventoryId: inventoryId } } 
            },
            {
                new: true
            });
            const resultSize = await Inventories.aggregate([{
                $match: { _id: new mongoose.Types.ObjectId(inventoryId) }
            },
            {
                $project: {_id: 0, quatitySize: {$size: "$reservations"}}
            }])
            if(cartNew){
                if(resultSize?.[0]?.quatitySize){
                    quatityNew = resultSize?.[0]?.quatitySize - quatity
                    console.log(quatityNew)
                    const stock = await Inventories.updateOne({
                        _id: inventoryId
                    },{
                        $inc: { quatity: quatity },
                        $push: {reservations: { $each: [], $slice: quatityNew}}
                    })
                    // change quatity in inventory to quatity of customer
                    const cartIdRedis = cartNew?._id?.toString();
                    await this.deleProInCartRedis(cartIdRedis,inventoryId,quatity);
                    const products = await handleGetProducts(cartNew);
                    if(stock.modifiedCount){
                        return {
                            statusCode: 200,
                            cart: cartNew,
                            products: products
                        }
                    }
                }
            }
            return {
                statusCode: 400,
                errorMessage: 'bad required'
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

module.exports = new CartService();
