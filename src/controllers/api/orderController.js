const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE);
const orderService = require('../../services/api/orderService');

class OrderController {
    async webhookAddOrderStripe(req,res){
        const sig = req.headers['stripe-signature'];
        let endpointSecret;
        // endpointSecret = 'whsec_ccac672d0d7037f9be229f3aee21ce1afc038bb4a59a37a5c304bd5cc8d01121';
        let data;
        let eventType;
        if(endpointSecret){
            let event;
            try {
                event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
                console.log(`webhook verified.`)
            } catch (error) {
                console.log(`webhook error: ${error.message}`)
                return res.status(400).send(`Webhook Error: ${error.message}`);
            }
            data = event.data.object;
            eventType = event.type;
        }else{
            data = req.body.data.object;
            eventType = req.body.type;
        }
        // Handle the event
        if(eventType === 'checkout.session.completed'){
            console.log(eventType)
            try{
                const customer = await stripe.customers.retrieve(
                    data.customer
                );
                const { orderSaved,cardSaved } = await orderService.createOrderDBStripe(data,customer);
                if(cardSaved.modifiedCount){
                    console.log(orderSaved,cardSaved)
                }
            }catch(error){
                console.log(error)
                return res.status(500).send(`Server Error: ${error.message}`).end();
            }   
        }
        // Return a 200 res to acknowledge receipt of the event
        return res.status(200).end();
    }
    async getOrder(req,res){
        const { customerID } = req.params
        if(!customerID){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required: no ID customer'
            })
        }
        const resultApi = await orderService.getOrderDB(customerID);
        if(resultApi.statusCode === 200){
            return res.status(200).json({
               ...resultApi
            })
        }else if(resultApi.statusCode === 500){
            return res.status(500).json({
                ...resultApi
            })
        }
    }
    async addOrderCOD(req,res){
        const { email } = req.body
        if(!email){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required'
            })
        }
        const resultApi = await orderService.createOrderDBCOD(req.body);
        if(resultApi.statusCode === 200){
            return res.status(200).json({
               ...resultApi
            })
        }else if(resultApi.statusCode === 400){
            return res.status(400).json({
                ...resultApi
            })
        }else if(resultApi.statusCode === 500){
            return res.status(500).json({
                ...resultApi
            })
        }
    }
    async addOrderPaypal(req,res){
        const { cartId } = req.body
        if(!cartId){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required'
            })
        }
        const resultApi = await orderService.createOrderPaypal(cartId);
        if(resultApi.statusCode === 200){
            return res.status(200).json({
               ...resultApi
            })
        }else if(resultApi.statusCode === 400){
            return res.status(400).json({
                ...resultApi
            })
        }else if(resultApi.statusCode === 500){
            return res.status(500).json({
                ...resultApi
            })
        }
    }
    async captureOrderPayPal(req,res){
        const { orderId } = req.body
        if(!orderId){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required'
            })
        }
        const resultApi = await orderService.captureOrderPaypal(req.body);
        if(resultApi.statusCode === 200){
            return res.status(200).json({
               ...resultApi
            })
        }else if(resultApi.statusCode === 400){
            return res.status(400).json({
                ...resultApi
            })
        }else if(resultApi.statusCode === 500){
            return res.status(500).json({
                ...resultApi
            })
        }
    }
    async createUrlVnpay(req,res){
        const data = await orderService.createUrlVnPay(req)
        if(data.statusCode === 200){
            return res.status(200).json({
                ...data
            })
        }else if(data.statusCode === 400){
            return res.status(400).json({
                ...data
            }) 
        }else if(data.statusCode === 500){
            return res.status(500).json({
                ...data
            }) 
        }
    }
    captureIPNVnpay(req,res){
        console.log('ipn_url')
        return res.status(200).json({RspCode: '00', Message: 'success'})
    }
    captureReturnVnpay(req,res){
        orderService.captureReturn(req,res);
    }
}

module.exports = new OrderController();