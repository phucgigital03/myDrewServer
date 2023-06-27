const Orders = require('../../models/Orders')
const Carts = require('../../models/Carts')

class OrderService {
    async createOrderDB(data,customer){
        const userId = customer?.metadata?.userId || null;
        const shipping = JSON.parse(customer?.metadata?.shipping) || {};
        const productIds = JSON.parse(customer?.metadata?.productIds) || [];
        const newOrder = new Orders({
            userId: userId,
            customerId: data.customer,
            shipping: shipping,
            phoneNumber: customer?.metadata?.phoneNumber,
            fullName: customer?.metadata?.fullName,
            email: customer?.metadata?.email,
            payment: 'visa',
            paymentIntentId: data.payment_intent,
            status: data.payment_status,
            subtotal: data.amount_subtotal,
            total: data.amount_subtotal + Number(customer?.metadata?.priceShip),
            products: productIds,
        })
        const orderSaved = await newOrder.save();
        return orderSaved
    }
    async getOrderDB(customerID){
        try{
            const orderFound = await Orders.findOne({customerId: customerID})
            return {
                statusCode: 200,
                orderFound: orderFound
            }
        }catch(error){
            console.log(error)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async clearProduct(cartId){
        const cartUpdated = await Carts.updateOne({
            _id: cartId
        },{
            $set: {
                products: []
            }
        })
        return cartUpdated
    }
}

module.exports = new OrderService();
