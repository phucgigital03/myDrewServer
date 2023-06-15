const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.resolve(__dirname,'../public/uploads'),
    filename: function(_req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    } 
});

const  checkFileType = (file, cb) => {
    const filetypes = /jpeg|png|jpg/;// Allowed ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());// Check ext
    const mimetype = filetypes.test(file.mimetype);// Check mime
    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb(null, false);
        return cb({
            message: 'Only .jpg,.jpeg,.png format allowed!',
            statusCode: 409,
        });
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fields: 6,
        fieldNameSize: 100, 
        fieldSize: 60000,
        fileSize: 100000,
    },
    fileFilter: function(_req, file, cb){
        checkFileType(file, cb);
    },
})

module.exports = upload
