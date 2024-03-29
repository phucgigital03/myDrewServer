const Joi = require('joi');

class registerVallidation {
    async handleRegisterForm(formUser){
        const schemaUser = Joi.object({
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        })
        const result = await schemaUser.validateAsync(formUser,{ abortEarly: false });
        return result
    }
    async handleVerifyOtpForm(formUser){
        const schemaUser = Joi.object({
            otp: Joi.string()
                .alphanum()
                .required(),
            firstName: Joi.string()
                .alphanum()
                .min(3)
                .max(30)
                .required(),
            lastName: Joi.string()
                .alphanum()
                .min(3)
                .max(30)
                .required(),
            password: Joi.string()
                .required(),
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        })
        const result = await schemaUser.validateAsync(formUser,{ abortEarly: false });
        return result
    }
}

module.exports = new registerVallidation();
