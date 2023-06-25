const productService = require("../../services/api/productService")

class ProductController {
    async getList(req,res,next){
        const result = await productService.getDB();
        if(result.statusCode === 200){
            return  res.status(200).json({
                ...result
            })
        }else if(result.statusCode === 500){
            return  res.status(500).json({
                ...result
            })
        }
    }
    async getOne(req,res,next){
        const { title } = req.params;
        if(!title){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required'
            })
        }
        const result = await productService.getOneDB(title);
        if(result.statusCode === 200){
            return  res.status(200).json({
                ...result
            })
        }else if(result.statusCode === 400){
            return  res.status(400).json({
                ...result
            })
        }else if(result.statusCode === 500){
            return  res.status(500).json({
                ...result
            })
        }
    }
    update(req,res,next){

    }
    deleteSort(req,res,next){

    }
}

module.exports = new ProductController();