const cartService = require("../../services/api/cartService");

class CartController {
    async create(req,res,next){
        const {userId,cartId,inventoryId,quatity} = req.body
        if(!inventoryId || !quatity){
            return res.status(400).json({
                statusCode: 400,
                message: 'bad required'
            })
        }
        const result = await cartService.createCartDB(req.body);
        if(result.statusCode === 200){
            return res.status(200).json({
                ...result
            })
        }else if(result.statusCode === 400){
            return res.status(400).json({
                ...result
            })
        }else if(result.statusCode === 500){
            return res.status(500).json({
                ...result
            })
        }
    } 
}

module.exports = new CartController();