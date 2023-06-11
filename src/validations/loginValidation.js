const Joi = require('joi');

class loginVallidation {
    async handleLoginForm(formUser){
        const schemaUser = Joi.object({
            password: Joi.string()
                .required(),
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required()
        })
        const result = await schemaUser.validateAsync(formUser,{ abortEarly: false });
        return result
    }
}

module.exports = new loginVallidation();
