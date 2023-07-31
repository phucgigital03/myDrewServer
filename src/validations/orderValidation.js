const Joi = require('joi');

class orderVallidation {
    async formPaypal(formData){
        const schemaUser = Joi.object({
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required(),
            userId: Joi.string(),
            cartId: Joi.string()
                .required(),
            phoneNumber: Joi.string()
                .required(),
            fullName: Joi.string()
                .required(),
            noteaddress: Joi.string()
                .required(),
            province: Joi.string()
                .required(),
            district: Joi.string()
                .required(),
            commune: Joi.string()
                .required(),
            methodPayment: Joi.string(),
            discount: Joi.string()
                .allow(null,''),
        })
        const result = await schemaUser.validateAsync(formData,{ abortEarly: false });
        return result;
    }
}

module.exports = new orderVallidation();
