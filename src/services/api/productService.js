const { unlink } = require('fs/promises')
const path = require('path')
const Products = require('../../models/Products')
console.log()

class productService {
    async createProduct(files,formProduct){
        try{
            const listImg = files.map((file) => file.filename)
            const { price,size,color,title,description } = formProduct
            const newForm = {
                title,
                description,
                price: Number(price),
                color: color.split(','),
                size: size.split(','),
                listImg,
            }
            const productSave = new Products(newForm)
            await productSave.save();
            return {
                statusCode: 200,
                data: productSave
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async getProduct(query){
        try{
            const result = {};
            let { type,limit,page } = query
            limit = parseInt(limit) || 5;
            page = parseInt(page) || 1;
            const startIndex = (page - 1) * limit;
            const endIndex = (page) * limit;
            if(type === 'nodelete'){
                result.products = await Products.find()
                    .skip(startIndex)
                    .limit(endIndex)
                    .exec();
            }
            if(startIndex > 0){
                result.previous = {
                    page: page - 1,
                    limit: limit
                }
            }
            if(endIndex < (result.products?.length)){
                result.next = {
                    page: page + 1,
                    limit: limit
                }
            }
            return {
                statusCode: 200,
                data: result
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async updateProduct(id,files = [],formProduct){
        try{
            const { price,size,color,title,description } = formProduct
            const newForm = {
                title,
                description,
                price: Number(price),
                color: color ? color.split(',') : [],
                size: size ? size.split(',') : [],
            }
            // muted let update listImg Db
            if(files.length){
                const listImg = files.map((file) => file.filename)
                newForm.listImg = listImg
            }
            // update and find 
            const productOld = await Products.findOneAndUpdate({_id: id},{
                $set: newForm
            })
            const productNew = await Products.find({_id: id})
            // check let delete listImg server
            if(files.length){
                const listImgOld = productOld.listImg;
                console.log(listImgOld)
                try{
                    const promises = listImgOld.map((imgString)=>{
                        const linkImg = path.resolve(__dirname,'../../public/uploads/',imgString)
                        return unlink(linkImg)
                    })
                    await Promise.all(promises);
                    // update have imgs success
                    return {
                        statusCode: 200,
                        data: productNew
                    }
                }catch(err){
                    console.log(err)
                    return {
                        statusCode: 500,
                        errorMessage: 'error server'
                    }
                }
            }
            // update no img success
            return {
                statusCode: 200,
                data: productNew
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async deleteSortProduct(id){
        try{
            const producteDeleted = await Products.delete({_id: id}).exec()
            return {
                statusCode: 200,
                message: 'delete success'
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

module.exports = new productService();
