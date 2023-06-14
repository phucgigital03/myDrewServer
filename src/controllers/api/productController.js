
class ProductController {
    create(req,res,next){
        console.log(req.files)
        return res.status(200).json({
            statusCode: 200,
            message: 'success req'
        })
    }
    getList(req,res,next){
        return res.status(200).json({
            statusCode: 200,
            message: 'success req'
        })
    }
    update(req,res,next){
        return res.status(200).json({
            statusCode: 200,
            message: 'success req'
        })
    }
    deleteSort(req,res,next){
        return res.status(200).json({
            statusCode: 200,
            message: 'success req'
        })
    }
}

module.exports = new ProductController();