const productService = require("../../services/api/productService")

class ProductController {
    async create(req,res,next){
        if(!req.files){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required: no content'
            })
        }
        const result = await productService.createProduct(req.files,req.body);
        if(result.statusCode === 200){
            return res.status(200).json({
                ...result
            })
        }else if(result.statusCode === 500){
            return res.status(500).json({
                ...result
            })
        }
    }
    async getList(req,res,next){
        const result = await productService.getProduct(req.query);
        if(result.statusCode === 200){
            return res.status(200).json({
                ...result
            })
        }else if(result.statusCode === 500){
            return res.status(500).json({
                ...result
            })
        }
    }
    async update(req,res,next){
        if(!req.params.id || !req.body.title){
            return res.status(400).json({
                statusCode: 400,
                message: 'bad required: no content'
            })
        }
        const result = await productService.updateProduct(req.params.id,req.files,req.body)
        if(result.statusCode === 200){
            return res.status(200).json({
                ...result
            })
        }else if(result.statusCode === 500){
            return res.status(500).json({
                ...result
            })
        }
    }
    async deleteSort(req,res,next){
        if(!req.query.idProduct){
            return res.status(400).json({
                statusCode: 400,
                message: 'bad required: no content'
            })
        }
        const result = await productService.deleteSortProduct(req.query.idProduct);
        if(result.statusCode === 200){
            return res.status(200).json({
                ...result
            })
        }else if(result.statusCode === 500){
            return res.status(500).json({
                ...result
            })
        }
    }
}

module.exports = new ProductController();