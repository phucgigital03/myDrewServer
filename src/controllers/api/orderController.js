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
                res.status(400).send(`Webhook Error: ${error.message}`);
                return;
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
                console.log(orderSaved)
            }catch(error){
                console.log(error)
                res.status(500).send(`Server Error: ${error.message}`);
            }   
        }

        // Return a 200 res to acknowledge receipt of the event
        res.status(200).end();
    }
}

module.exports = new OrderController();