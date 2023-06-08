const Users = require('../models/Users')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
dotenv.config()

class registerService {
    // [post] /
    async registerUser(formValidated){
        try{
            const foundUser = await Users.findOne({ email: formValidated.email });
            if(foundUser){
                return {
                    statusCode: 409,
                }
            }
            const passwordHash = await bcrypt.hash(formValidated.password,10);
            formValidated.password = passwordHash;
            const infoUser = new Users(formValidated);
            const result = await infoUser.save();
            return result
        }catch(err){
            console.log(err)
            return null;
        }
    }
}

module.exports = new registerService()
