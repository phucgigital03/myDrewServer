const OrderHistorys = require('../../models/OrderHistorys')
const Users = require('../../models/Users')

class OrderHistoryService {
    async create(dataOrder,idUser){
        try{
            const dataOrderSave = new OrderHistorys(dataOrder)
            const resultOrder = await dataOrderSave.save();
            await Users.updateOne({_id: idUser},{
                $push: {
                    orderHistorys: resultOrder._id
                }
            })
            return {
                statusCode: 200,
                data: resultOrder
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

module.exports = new OrderHistoryService();
