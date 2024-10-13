import Joi from "joi";


export const registerValidattion = Joi.object().keys({
    name: Joi.string().min(4).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
})

export const loginValidation = Joi.object().keys({
    password: Joi.string().min(8).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
})