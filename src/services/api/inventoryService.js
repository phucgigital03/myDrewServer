const { unlink } = require('fs/promises')
const path = require('path')
const Inventories = require('../../models/Inventories')
const Products = require('../../models/Products')

class inventoryService {
    async createInventory(files,formInventory){
        try{
            const listImg = files.map((file) => file.filename)
            const { price,size,color,title,description,category,quatity } = formInventory
            const newForm = {
                title,
                description,
                category,
                quatity: Number(quatity),
                price: Number(price),
                color,
                size,
                listImg,
            }
            const inventorySave = new Inventories(newForm)
            await Products.create({titleInventory: inventorySave._title})
            await inventorySave.save();
            return {
                statusCode: 200,
                data: inventorySave
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async getInventory(query){
        try{
            const result = {};
            let { type,limit,page } = query
            limit = parseInt(limit) || 5;
            page = parseInt(page) || 1;
            const startIndex = (page - 1) * limit;
            const endIndex = (page) * limit;
            const inventoryNotDele = await Inventories.find()
            const inventoryDele = await Inventories.findDeleted()
            const allInventory = await Inventories.findWithDeleted()
            const totalPageNotDele = inventoryNotDele.length;
            const totalPageCount = Math.ceil(totalPageNotDele / limit);
            if(type === 'nodelete'){
                result.inventorys = await Inventories.find()
                    .skip(startIndex)
                    .limit(limit)
                    .exec();
            }
            if(startIndex > 0){
                result.previous = {
                    page: page - 1,
                    limit: limit
                }
            }
            if(endIndex < (totalPageNotDele)){
                result.next = {
                    page: page + 1,
                    limit: limit
                }
            }
            return {
                statusCode: 200,
                data: {
                    totalItem: result?.inventorys?.length,
                    lengthInventoryNotDele: inventoryNotDele.length,
                    lengthInventoryDele: inventoryDele.length,
                    lengthAllInventory: allInventory.length,
                    totalPageCount: totalPageCount,
                    ...result,
                }
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async updateInventory(title,files = [],formInventory){
        try{
            const { price,size,color,title,description,category,quatity } = formInventory
            const newForm = {
                title,
                description,
                category,
                quatity: Number(quatity),
                price: Number(price),
                color,
                size,
            }
            // muted let update listImg Db
            if(files.length){
                const listImg = files.map((file) => file.filename)
                newForm.listImg = listImg
            }
            // update and find 
            const inventoryOld = await Inventories.findOneAndUpdate({_title: title},{
                $set: newForm
            })
            const inventoryNew = await Inventories.find({_title: title})
            // check let delete listImg server
            if(files.length){
                const listImgOld = inventoryOld.listImg;
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
                        data: inventoryNew
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
                data: inventoryNew
            }
        }catch(err){
            console.log(err)
            return {
                statusCode: 500,
                errorMessage: 'error server'
            }
        }
    }
    async deleteSortInventory(title){
        try{
            const inventoryeDeleted = await Inventories.delete({title: title}).exec()
            if(inventoryeDeleted.modifiedCount){
                return {
                    statusCode: 200,
                    message: 'delete success'
                }
            }
            return {
                statusCode: 400,
                errorMessage: 'bad required: title invaltitle'
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

module.exports = new inventoryService();
