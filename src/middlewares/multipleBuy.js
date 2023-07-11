const redisFeatures = require('../utils/redis');
const Carts = require('../models/Carts');

const multipleBuyIncr = async (req,res,next)=>{
    const { inventoryId,cartId } = req.body;
    const pathNames = req.path.split('/').filter(item => item === 'plus');
    const pathPlus = pathNames[0];
    // handle check cart
    if(pathPlus){
        const cartFound = await Carts.findOne({$and: [{_id: cartId},{status: 'active'}]})
        if(!cartFound){
            console.log('no have cart')
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required: no cart'
            })
        }
    }
    if(!inventoryId){
        console.log('no have inventoryId')
        return res.status(400).json({
            statusCode: 400,
            errorMessage: 'bad required: no have inventoryId'
        })
    }
    try{
        // handle check inventory
        let qtyInventory = await redisFeatures.getRedis(`inventory:${inventoryId}`);
        if(!qtyInventory){
            console.log('inventoryId is invalid')
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required: inventoryId is invalid'
            })
        }
        // handle redis
        qtyInventory = qtyInventory - 1;
        const checkQtySell = await redisFeatures.existsRedis(`qtySell:${inventoryId}`);
        console.log(qtyInventory,checkQtySell)
        if(!checkQtySell){
            if(pathPlus){
                console.log('inventoryId is invalid')
                return res.status(400).json({
                    statusCode: 400,
                    errorMessage: 'bad required: inventoryId is invalid, qtySell not exist'
                })
            }
            await redisFeatures.setNxRedis(`qtySell:${inventoryId}`,0);
        }
        let qtySell = await redisFeatures.getRedis(`qtySell:${inventoryId}`);
        console.log(`truoc khi order so luong ban ra la: ${qtySell}`)
        qtySell = await redisFeatures.incrBy(`qtySell:${inventoryId}`,1);
        if(qtySell > qtyInventory){
            console.log('sold out')
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required: sold out'
            })
        }
        if(qtySell > qtyInventory){
            await redisFeatures.setNxRedis('banquaroi',qtySell - qtyInventory);
        }
        await redisFeatures.setRedis(`qtySellReal:${inventoryId}`,qtySell);
        console.log(`sau khi order so luong ban ra la: ${qtySell}`)
        next();
    }catch(error){
        console.log(error)
        return res.status(500).json({
            statusCode: 500,
            errorMessage: 'error server'
        })
    }
}

module.exports = {
    multipleBuyIncr,
}