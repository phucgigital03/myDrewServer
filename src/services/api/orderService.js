const Orders = require('../../models/Orders')

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
}

module.exports = new OrderService();
