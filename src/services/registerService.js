const Users = require('../models/Users')
const Otps = require('../models/Otps')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator');
const transporter = require('../configs/nodeemailer')

class registerService {
    async registerUser(formValidated){
        const { email } = formValidated
        try{
            const otp = otpGenerator.generate(6,{ 
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false, 
                specialChars: false 
            });
            const salt = await bcrypt.genSalt(10);
            const hashOtp = await bcrypt.hash(otp,salt);
            const otpDoc = new Otps({
                email: email,
                otp: hashOtp,
            })
            const otpSaved = await otpDoc.save();
            if(otpSaved){
                // handle send otp email
                const mailOptions = {
                    from: process.env.ADDRESS_EMAIL, // Sender's email address
                    to: email, // Recipient's email address
                    subject: 'verify otp', // Email subject
                    text: `let register user, your code: ${otp}`, // Plain text body
                };
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent successfully. Message ID:', info.messageId)
                return {
                    statusCode: 200,
                    message: `success get otp at email let verify`
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
    async verifyOtpAddUser(formValidated){
        try{
            const { email,password,otp } = formValidated;
            const otpFound = await Otps.find({email: email})
            // check otp exists
            if(otpFound.length <= 0){
                return {
                    statusCode: 401,
                    errorMessage: 'otp is expired'
                }
            }
            // check email
            const otpLast = otpFound[otpFound.length - 1];
            if(!otpLast.email === email){
                return {
                    statusCode: 409,
                    errorMessage: 'email is invalid'
                }
            }
            // check otp
            const checkOtp = await bcrypt.compare(otp,otpLast.otp);
            if(!checkOtp){
                return {
                    statusCode: 409,
                    errorMessage: 'otp is invalid'
                }
            }
            // check user exists
            const userFound = await Users.findOne({ email: email });
            if(userFound){
                return {
                    statusCode: 409,
                    errorMessage: 'user ton tai'
                }
            }
            // handle save user
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password,salt);
            formValidated.password = passwordHash;
            const infoUser = new Users(formValidated);
            const result = await infoUser.save();
            const otpDele = await Otps.deleteMany({email: email});
            if(!otpDele.deletedCount || !result){
                return {
                    statusCode: 409,
                    errorMessage: 'data conflict'
                }
            }
            const userInfo = result.toObject()
            delete userInfo.password
            return {
                statusCode: 200,
                data: userInfo
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

module.exports = new registerService()
