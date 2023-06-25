const inventoryService = require("../../services/api/inventoryService")

class InventoryController {
    async create(req,res,next){
        if(!req.files){
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required: no content'
            })
        }
        const result = await inventoryService.createInventory(req.files,req.body);
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
        const result = await inventoryService.getInventory(req.query);
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
        const result = await inventoryService.updateInventory(req.params.id,req.files,req.body)
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
        if(!req.query.title){
            return res.status(400).json({
                statusCode: 400,
                message: 'bad required: no content'
            })
        }
        const result = await inventoryService.deleteSortInventory(req.query.title);
        if(result.statusCode === 200){
            return res.status(200).json({
                ...result
            })
        }else if(result.statusCode === 400){
            return res.status(400).json({
                ...result
            })
        }else if(result.statusCode === 500){
            return res.status(500).json({
                ...result
            })
        }
    }
}

module.exports = new InventoryController();