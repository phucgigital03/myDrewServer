const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE);
const stripeService = require('../services/stripeService');

const URL = process.env.URL
const URL_UI = process.env.URL_UI
class stripeController {
    async getUrl(req,res){
        const { 
            cartId,
            userId,
            email,
            phoneNumber,
            fullName,
            noteaddress,
            province,
            district,
            commune,
            discount
        } = req.body;
        console.log(req.body)
        if(!cartId){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad request'
            })
        }
        try{
            const data = await stripeService.getProductsInCart(cartId);
            if(data.statusCode === 200){
                const products = data.products;
                const imagesURL = [];
                const line_items = products.map((product)=>{
                    imagesURL.push(`${URL}/${product.listImg[0]}`)
                    return (
                        {
                            price_data: {
                              currency: "vnd",
                              product_data: {
                                name: product.title,
                                description: product.description,
                                images: imagesURL,
                                metadata: {
                                  id: product._id,
                                },
                              },
                              unit_amount: product.price,
                            },
                            quantity: product.quatity,
                        }
                    )
                })
                const productIds = products.map((product)=>{
                    return {
                        inventoryId: product.inventoryId,
                        quatity: product.quatity
                    }
                })
                const customer = await stripe.customers.create({
                    metadata: {
                        userId: userId,
                        cartId: cartId,
                        productIds: JSON.stringify(productIds),
                        shipping: JSON.stringify({
                            province: province,
                            district: district,
                            commune: commune,
                            noteaddress: noteaddress,
                        }),
                        priceShip: "35000",
                        phoneNumber: phoneNumber,
                        fullName: fullName,
                        email: email,
                    },
                });
                const session = await stripe.checkout.sessions.create({
                    mode: 'payment',
                    payment_method_types: ["card"],
                    line_items: line_items,
                    customer: customer.id,
                    success_url: `${URL_UI}/payment/success/${customer.id}`,
                    cancel_url: `${URL_UI}/payment/cancel`,
                });
                return res.status(200).json({
                    statusCode: 200,
                    url: session.url
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
        }catch(error){
            console.log(error)
            return res.status(500).json({
                statusCode: 500
            })
        }
    }
}

module.exports = new stripeController();
