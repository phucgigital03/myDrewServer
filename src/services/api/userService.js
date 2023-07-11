const Users = require('../../models/Users')
const Orders = require('../../models/Orders')

class UserService {
    async getUser(type,userId){
        try{
            let orders,user;
            if(type === 'order'){
                user = await Users.findOne({_id: userId})
                orders = await Orders.find({userId: userId})
            }
            return {
                statusCode: 200,
                orders: orders,
                email: user?.email
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
}

module.exports = new UserService();
