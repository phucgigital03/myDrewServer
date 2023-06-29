const Users = require('../../models/Users')

class UserService {
    async getUser(type,userId){
        try{
            let order;
            if(type === 'order'){
                order = await Users.find({_id: userId})
                .populate([{ path: 'orders'}])
                .select({
                    email: 1,
                    orders: 1,
                    _id: 0,
                })
            }
            if(!order){
                return {
                    statusCode: 400,
                    errorMessage: 'bad required'
                }
            }
            return {
                statusCode: 200,
                data: order
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
