const searchService = require('../services/searchService');

class searchController {
    async getProduct(req,res,next){
        try{
            const data = await searchService.getProductDB(req.query);
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
        }catch(error){
            console.log(error)
            return res.status(500).json({
                statusCode: 500,
                errorMessage: 'error server'
            })
        }
    }
}

module.exports = new searchController();
