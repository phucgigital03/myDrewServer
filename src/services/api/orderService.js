const mongoose = require('mongoose');
const axios = require('axios');
const { handleGetProducts } = require('../../utils/getProducts')
const Orders = require('../../models/Orders')
const Carts = require('../../models/Carts');
const crypto = require('crypto');
const querystring = require('qs');
const moment = require('moment');
const URL_UI = process.env.URL_UI
const VNP_TMNCODE = process.env.VNP_TMNCODE
const VNP_HASHSECRET = process.env.VNP_HASHSECRET
const VNP_URL = process.env.VNP_URL
const URL = process.env.URL
const { PUBLIC_KEY_PAYPAL, SECRET_KEY_PAYPAL } = process.env;
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};
class OrderService {
    sortObject(obj){
        let sorted = {};
        let str = [];
        let key;
        for (key in obj){
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
    static async generateAccessToken(){
        const { data: { access_token } } = await axios({
          url: `${baseURL.sandbox}/v1/oauth2/token`,
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'en_US',
            'content-type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: PUBLIC_KEY_PAYPAL,
            password: SECRET_KEY_PAYPAL,
          },
          params: {
            grant_type: 'client_credentials',
          },
        });
        console.log(access_token)
        return access_token
    }
    static async sumSubTotalProduct(cartFound){
        const allproduct = await handleGetProducts(cartFound);
        const subtotal = allproduct.reduce((total,product) => {
            const priceProduct = product.quatity * product.price
            return total + priceProduct;
        },0)
        return subtotal
    }
    async createOrderDB(userId,customerId,shipping,formData,payment,status,subtotal,priceShip,products,cartId){
        const newOrder = new Orders({
            userId: userId || null,
            customerId: customerId,
            shipping: shipping,
            phoneNumber: formData.phoneNumber,
            fullName: formData.fullName,
            email: formData.email,
            payment: payment,
            paymentIntentId: null,
            status: status,
            subtotal: subtotal || 0,
            total: subtotal + Number(priceShip),
            products: products,
        })
        const orderSaved = await newOrder.save();
        const cartSaved = await this.clearProduct(cartId)
        return {
            orderSaved,
            cartSaved
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
    async createOrderDBStripe(data,customer){
        const userId = customer?.metadata?.userId || null;
        const customerId = data.customer;
        const formData = {
            phoneNumber: customer?.metadata?.phoneNumber,
            fullName: customer?.metadata?.fullName,
            email: customer?.metadata?.email,
        }
        const payment = 'visa';
        const status = 'paid';
        const subtotal = data.amount_subtotal;
        const priceShip = 35000;
        const cartId = customer?.metadata?.cartId;
        const shipping = JSON.parse(customer?.metadata?.shipping) || {};
        const products = JSON.parse(customer?.metadata?.productIds) || [];
        const { cartSaved,orderSaved } = this.createOrderDB(userId,customerId,shipping,formData,payment,status,subtotal,priceShip,products,cartId)
        return {
            cartSaved,
            orderSaved
        }
    }
    async createOrderDBCOD(formData){
        const { userId,cartId } = formData
        const payment = "cod";
        const status = "unpaid";
        const customerId = `cus_${new mongoose.Types.ObjectId().toString()}`;
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
                const products = cartFound.products;
                if(products?.length){
                    const subtotal = await OrderService.sumSubTotalProduct(cartFound);
                    const { cartSaved,orderSaved } = await this.createOrderDB(userId,customerId,shipping,formData,payment,status,subtotal,priceShip,products,cartId)
                    if(cartSaved.modifiedCount){
                        return {
                            statusCode: 200,
                            url: `${URL_UI}/payment/success/${orderSaved.customerId}`
                        }
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
    async createOrderPaypal(cartId){
        try{
            const cartFound = await Carts.findOne({_id: cartId});
            if(cartFound){
                const products = cartFound.products
                if(products?.length){
                    const subtotal = await OrderService.sumSubTotalProduct(cartFound);
                    const total = subtotal + 35000;
                    const moneyConvert = Math.ceil(total/20000);
                    const accessToken = await OrderService.generateAccessToken();
                    const url = `${baseURL.sandbox}/v2/checkout/orders`; 
                    const requestBody = {
                        intent: 'CAPTURE',
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: 'USD',
                                    value: `${moneyConvert}.00`
                                },
                                custom_id: JSON.stringify({
                                    cartId: cartId,
                                    subtotal: subtotal,
                                    products: products
                                })
                            },
                        ],
                    };
                    const headers = {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${accessToken}` // Replace with your actual access token
                    };
                    const { data } = await axios.post(url, requestBody, { headers });
                    return {
                        statusCode: 200,
                        id: data.id
                    };
                }
            }
            return {
                statusCode: 400,
                errorMessage: 'bad required'
            };
        }catch(error){
            console.log(error)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async captureOrderPaypal(data){
        const { orderId,formData } = data;
        const userId = formData.userId;
        const payment = "paypal";
        const status = "paid";
        const customerId = `cus_${new mongoose.Types.ObjectId().toString()}`
        const priceShip = 35000;
        const shipping = {
            noteaddress: formData.noteaddress,
            province: formData.province,
            district:formData.district, 
            commune:formData.commune,
        }
        console.log(formData)
        try{
            const accessToken = await OrderService.generateAccessToken();
            const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`;
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}` // Replace with your actual access token
            };
            const { data } = await axios.post(url,{},{ headers });
            const { subtotal,products,cartId } = JSON.parse(data.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id) || {};
            const { cartSaved,orderSaved } = await this.createOrderDB(userId,customerId,shipping,formData,payment,status,subtotal,priceShip,products,cartId)
            if(cartSaved.modifiedCount){
                return {
                    statusCode: 200,
                    url: `${URL_UI}/payment/success/${orderSaved.customerId}`
                }
            }
            return {
                statusCode: 400,
                errorMessage: 'bad required'
            };
        }catch(error){
            console.log(error)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async createUrlVnPay(req){
        const {  cartId, userId, email, phoneNumber, fullName, noteaddress, province, district, commune, discount } = req.body;
        try{
            const cartFound = await Carts.findOne({_id: cartId});
            if(cartFound){
                const products = cartFound.products;
                if(products.length){
                    const payment = "vnpay";
                    const status = "unpaid";
                    const customerId = `cus_${new mongoose.Types.ObjectId().toString()}`
                    const priceShip = 35000;
                    const subtotal = await OrderService.sumSubTotalProduct(cartFound);
                    const total = subtotal + 35000;
                    const shipping = { noteaddress,province,district,commune }
                    const formData = { phoneNumber,fullName,email }
                    const { orderSaved,cartSaved } = await this.createOrderDB(userId,customerId,shipping,formData,payment,status,subtotal,priceShip,products,cartId);
                    if(cartSaved.modifiedCount){
                        const date = new Date();
                        const createDate = moment(date).format('YYYYMMDDHHmmss');
                        const ipAddr = req.headers['x-forwarded-for'] ||
                            req.connection.remoteAddress ||
                            req.socket.remoteAddress ||
                            req.connection.socket.remoteAddress;
                        const secretKey = `${VNP_HASHSECRET}`;
                        let vnpUrl = `${VNP_URL}`;
                        let vnp_Params = {};
                        vnp_Params['vnp_Version'] = '2.1.0';
                        vnp_Params['vnp_Command'] = 'pay';
                        vnp_Params['vnp_TmnCode'] = `${VNP_TMNCODE}`;
                        vnp_Params['vnp_Locale'] = 'vn';
                        vnp_Params['vnp_CurrCode'] = 'VND';
                        vnp_Params['vnp_TxnRef'] = orderSaved.customerId;
                        vnp_Params['vnp_OrderInfo'] = cartId;
                        vnp_Params['vnp_OrderType'] = 'other';
                        vnp_Params['vnp_Amount'] = total * 100;
                        vnp_Params['vnp_ReturnUrl'] = `${URL}/v1/api/vnpay/vnpay_return`;
                        vnp_Params['vnp_IpAddr'] = ipAddr;
                        vnp_Params['vnp_CreateDate'] = createDate;
                        vnp_Params = this.sortObject(vnp_Params);
                        let signData = querystring.stringify(vnp_Params, { encode: false });
                        let hmac = crypto.createHmac("sha512", secretKey);
                        let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex"); 
                        vnp_Params['vnp_SecureHash'] = signed;
                        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
                        return {
                            statusCode: 200,
                            url: vnpUrl
                        }
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
    async captureReturn(req,res){
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        vnp_Params = this.sortObject(vnp_Params);
        let secretKey = `${VNP_HASHSECRET}`;
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");     
        if(secureHash === signed){
            const rspCode = vnp_Params['vnp_ResponseCode'];
            const customerId = vnp_Params['vnp_TxnRef'];
            const cartId = vnp_Params['vnp_OrderInfo']
            console.log(`code res`,rspCode)
            console.log(`cartId`, cartId)
            console.log(`customerId`, customerId)
            if(rspCode == '00'){
                const orderFound = await Orders.findOne({customerId: customerId})
                if(orderFound){
                    const orderUpdated = await Orders.updateOne({customerId: customerId},{$set: { status: 'paid' }});
                    if(orderUpdated.modifiedCount){
                        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
                        return res.status(200).redirect(`http://localhost:3000/payment/success/${customerId}`)
                    }
                }
            }
        }
        else {
            return res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
        }
    }  
}

module.exports = new OrderService();
