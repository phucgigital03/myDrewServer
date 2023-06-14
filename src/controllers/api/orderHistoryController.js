const orderHistoryService = require("../../services/api/orderHistoryService");

class OrderHistoryController {
    // [post] /
    async create(req,res,next){
        const {dataOrder,idUser} = req.body
        if(!dataOrder || !idUser){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad request'
            })
        }
        const result = await orderHistoryService.create(dataOrder,idUser)
        if(result.statusCode === 500){
            return res.status(200).json({
                ...result
            })
        }
        if(result.statusCode === 200){
            return res.status(200).json({
                ...result
            })
        }
        return res.status(200).json({
            statusCode: 200,
            message: 'hello phuc nguyen'
        })
    }
}

module.exports = new OrderHistoryController();