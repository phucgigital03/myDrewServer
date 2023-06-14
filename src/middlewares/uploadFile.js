const multer = require('multer')
const upload = require('../configs/multerFile')
const uploadFn = upload.array('listImg',1)

const uploadArrayFile = (req,res,next)=>{
    uploadFn(req,res,function(error){
        if (error instanceof multer.MulterError) {
            console.log('have define',error)
            if(error.code === 'LIMIT_FIELD_COUNT'){
                return res.status(400).json({
                    statusCode: 400,
                    errorMessage: 'Too many fields'
                })
            }else if(error.code === 'LIMIT_FILE_SIZE'){
                return res.status(400).json({
                    statusCode: 400,
                    errorMessage: 'Too many file size'
                })
            }else if(error.code === 'LIMIT_FIELD_KEY'){
                return res.status(400).json({
                    statusCode: 400,
                    errorMessage: 'Field name too long'
                })
            }else if(error.code === 'LIMIT_UNEXPECTED_FILE'){
                return res.status(400).json({
                    statusCode: 400,
                    errorMessage: 'Unexpected field'
                })
            }
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required'
            })
        } else if (error) {
            console.log('no define',error)
            if(error.statusCode === 409){
                return res.status(409).json({
                    statusCode: 409,
                    errorMessage: 'Only .jpg,.jpeg,.png format allowed!'
                })
            }
            return res.status(400).json({
                statusCode: 400,
                errorMessage: 'bad required'
            })
        }
        next()
    })
}

module.exports = {
    uploadArrayFile
}