const cartService = require("../../services/api/cartService");

class CartController {
    async getCart(req,res,next){
        const { cartId } = req.params
        if(!cartId){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required'
            })
        }
        const result = await cartService.getCartDB(cartId);
        if(result.statusCode === 200){
            return res.status(200).json({
                ...result
            })
        }else if(result.statusCode === 400){
            return res.status(400).json({
                ...result
            })
        }else if(result.statusCode === 204){
            return res.status(204).json({
                ...result
            })
        }else if(result.statusCode === 500){
            return res.status(500).json({
                ...result
            })
        }
    }
    async create(req,res,next){
        const {userId,cartId,inventoryId} = req.body
        if(!inventoryId){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required'
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
    async updateProductPlus(req,res,next){
        const {userId,cartId,inventoryId} = req.body
        if(!inventoryId){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required'
            })
        }
        const result = await cartService.updatePlus(req.body);
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
    async updateProductMinus(req,res,next){
        const {userId,cartId,inventoryId} = req.body
        if(!inventoryId){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required'
            })
        }
        const result = await cartService.updateMinus(req.body);
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
    async deleProductCart(req,res,next){
        const { userId,cartId,inventoryId } = req.body
        if(!inventoryId || !cartId){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required'
            })
        }
        const result = await cartService.deleProductCartDB(req.body);
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