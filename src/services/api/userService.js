const Users = require('../../models/Users')

class UserService {
    async getUser(type,idUser){
        try{
            let orderHistory;
            if(type === 'orderHistory'){
                orderHistory = await Users.find({_id: idUser})
                .populate([{ path: 'orderHistorys'}])
                .select({
                    email: 1,
                    orderHistorys: 1,
                    _id: 0,
                })
            }
            return {
                statusCode: 200,
                data: orderHistory
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
