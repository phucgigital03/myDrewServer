const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE);
const orderService = require('../../services/api/orderService');

class OrderController {
    async webhookAddOrder(req,res){
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
                const orderSaved = await orderService.createOrderDB(data,customer);
                const cardSaved = await orderService.clearProduct(customer?.metadata?.cartId)
                if(cardSaved.modifiedCount){
                    console.log(orderSaved,cardSaved)
                    // Return a 200 res to acknowledge receipt of the event
                    return res.status(200).end();
                }
                return res.status(400).send(`bad required`);
            }catch(error){
                console.log(error)
                return res.status(500).send(`Server Error: ${error.message}`);
            }   
        }
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
}

module.exports = new OrderController();