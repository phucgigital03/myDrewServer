const mongoose = require('mongoose')
const Carts = require('../../models/Carts')
const Inventories = require('../../models/Inventories')
const Products = require('../../models/Products')

class CartService {
    // at createCartDB
    static async handleGetProducts(cartNew){
        const idInventorys = cartNew.products.map(product =>{
            return new mongoose.Types.ObjectId(product.inventoryId)
        })
        const products = await Products.aggregate([
            {
                $match: {idInventory:  { $in : idInventorys }}
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
    // at createCartDB
    static handleMapQuatity(cartNew,products){
        const mapQuatity = new Map();
        cartNew?.products?.forEach((product) => {
            mapQuatity.set(product.inventoryId,product.quatity)
        })
        products.forEach((product)=>{
            product.quatity = mapQuatity.get(product.idInventory.toString())
        })
    }
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

    async createCartDB(data){
        let {userId,cartId,inventoryId} = data
        let quatity = 1;
        try{
            const stock = await Inventories.updateOne({
                $and: [{_id: inventoryId},{quatity: {$gt: quatity}}]
            },{
                $inc: {quatity: -quatity},
                $push: {
                    reservations: {
                        inventoryId: inventoryId,
                        quatity: quatity
                    }
                }
            })
            // check product pass inventory ?
            if(stock.modifiedCount){
                let cartFound,cartNew;
                cartFound = await Carts.findOne({
                    _id: cartId
                })
                console.log(cartFound)
                if(cartFound){
                    const checkOldProduct = cartFound.products.find(product => product.inventoryId === inventoryId);
                    // if check have old product then plus quatity, else push element
                    if(checkOldProduct){
                        cartNew = await Carts.findOneAndUpdate({
                            $and: [{_id: cartId},{products: {$elemMatch: {inventoryId: inventoryId }}}]
                        },{
                            $inc: {
                                "products.$.quatity": quatity
                            }
                        },{
                            upsert: true,
                            new: true
                        })
                    }else{
                        cartNew = await Carts.findOneAndUpdate({
                            _id: cartId
                        },{
                            $push: {
                                products: {
                                    inventoryId: inventoryId,
                                    quatity: quatity
                                }
                            }
                        },{
                            upsert: true,
                            new: true
                        })
                    }
                }else{
                    cartNew = await Carts.create({
                        products: [
                            {
                                inventoryId: inventoryId,
                                quatity: quatity
                            }
                        ]
                    })
                }
                // aggregate product added Cart
                console.log(cartNew)
                const products = await CartService.handleGetProducts(cartNew);
                // change quatity in inventory to quatity of customer
                CartService.handleMapQuatity(cartNew,products);
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
                    $push: {
                        reservations: {
                            inventoryId: inventoryId,
                            quatity: quatity
                        }
                    }
                })
                if(stock.modifiedCount){
                    const cartNew = await Carts.findOneAndUpdate({
                        $and: [{_id: cartId},{status: 'active'},{products: {$elemMatch: {inventoryId: inventoryId}}}]
                    },{
                        $inc: {
                            "products.$.quatity": quatity
                        }
                    },{
                        new: true
                    })
                    const products = await CartService.handleGetProducts(cartNew);
                    // change quatity in inventory to quatity of customer
                    CartService.handleMapQuatity(cartNew,products);
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
        let {userId,cartId,inventoryId} = data
        let quatity = 1;
        try{
            const checkCart = await CartService.handleCheckCartMinus(cartId,inventoryId);
            console.log(checkCart)
            if(checkCart){
                const stock = await Inventories.updateOne({
                    _id: inventoryId
                },{
                    $inc: { quatity: quatity },
                    $pop: {
                        reservations: 1
                    }
                })
                if(stock.modifiedCount){
                    const cartNew = await Carts.findOneAndUpdate({
                        $and: [{_id: cartId},{products: {$elemMatch: {inventoryId: inventoryId}}}]
                    },{
                        $inc: {
                            "products.$.quatity": -quatity
                        }
                    },{
                        new: true
                    })
                    const products = await CartService.handleGetProducts(cartNew);
                    // change quatity in inventory to quatity of customer
                    CartService.handleMapQuatity(cartNew,products);
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
                $project: {
                    _id: 0,
                    quatitySize: {
                        $size: "$reservations"
                    }
                }
            }])
            if(cartNew){
                if(resultSize?.[0]?.quatitySize){
                    quatityNew = resultSize?.[0]?.quatitySize - quatity
                    console.log(quatityNew)
                    const stock = await Inventories.updateOne({
                        _id: inventoryId
                    },{
                        $inc: { quatity: quatity },
                        $push: {
                            reservations: {
                               $each: [],
                               $slice: quatityNew
                            }
                        }
                    })
                    const products = await CartService.handleGetProducts(cartNew);
                    // change quatity in inventory to quatity of customer
                    CartService.handleMapQuatity(cartNew,products);
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
