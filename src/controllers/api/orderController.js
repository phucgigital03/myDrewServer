const orderService = require('../../services/api/orderService');
const orderValidation = require('../../validations/orderValidation');

class OrderController {
    // get order
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
    // cod
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
    // paypal
    async addOrderPaypal(req,res){
        try{
            const { cartId } = req.body
            console.log('cartId at orderController:',cartId);
            if(!cartId){
                return res.status(400).json({
                    statusCode: 400,
                    errorMessage: 'bad required'
                })
            }
            const checkOrder = await orderValidation.formPaypal(req.body);
            if(checkOrder){
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
            return res.status(409).json({
                statusCode: 409,
                errorMessage: 'bad required: conflict'
            })
        }catch(error){
            console.log(error)
            return res.status(500).json({
                statusCode: 500,
                errorMessage: 'error server'
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
    // vnpay
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