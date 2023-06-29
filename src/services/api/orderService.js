const Orders = require('../../models/Orders')
const Carts = require('../../models/Carts')
const mongoose = require('mongoose')
const { handleGetProducts } = require('../../utils/getProducts')

const URL_UI = process.env.URL_UI
class OrderService {
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
    async createOrderDBCOD(formData){
        const { userId,cartId } = formData
        const customerId = `cus_${new mongoose.Types.ObjectId().toString()}`
        const priceShip = 35000;
        const shipping = {
            noteaddress: formData.noteaddress,
            province: formData.province,
            district:formData.district, 
            commune:formData.commune,
        }
        try{
            const cartFound = await Carts.findOne({_id: cartId});
            if(cartFound){
                const productArray = cartFound.products;
                const allproduct = await handleGetProducts(cartFound);
                const subtotal = allproduct.reduce((total,product) => {
                    const priceProduct = product.quatity * product.price
                    return total + priceProduct;
                },0)
                const newOrder = new Orders({
                    userId: userId || null,
                    customerId: customerId,
                    shipping: shipping,
                    phoneNumber: formData.phoneNumber,
                    fullName: formData.fullName,
                    email: formData.email,
                    payment: 'cod',
                    paymentIntentId: null,
                    status: "unpaid",
                    subtotal: subtotal || 0,
                    total: subtotal + Number(priceShip),
                    products: productArray,
                })
                const orderSaved = await newOrder.save();
                const cardSaved = await this.clearProduct(cartId)
                if(cardSaved.modifiedCount){
                    return {
                        statusCode: 200,
                        url: `${URL_UI}/payment/success/${orderSaved.customerId}`
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

module.exports = new OrderService();
