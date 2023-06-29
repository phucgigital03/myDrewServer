const Carts = require('../models/Carts');
const { handleGetProducts } = require('../utils/getProducts')
class StripeService {
    async getProductsInCart(cartId){
        try{
            const cartFound = await Carts.findOne({
                _id: cartId
            });
            if(!cartFound){
                return {
                    statusCode: 400,
                    message: 'bad required: no products'
                }
            }
            const products = await handleGetProducts(cartFound);
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
