
class timeServerController {
    getTime(req,res,next){
        try{
            return res.status(200).json({
                statusCode: 200,
                time: Date.now()
            })
        }catch(error){
            return res.status(500).json({
                statusCode: 500,
                errorMessage: 'error server'
            })
        }
    }
}

module.exports = new timeServerController();
