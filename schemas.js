const Joi = require('joi');
const { number } = require('joi');




module.exports.cadetregSchema = Joi.object({

    regimentno: Joi.string().required().min(13).max(13).required(),
    id: Joi.number().required(),
    year: Joi.number().required().min(1000).max(9999),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.number().integer().min(1000000000).max(9999999999).required(),

    created: Joi.date().default(Date.now),
    author: Joi.string(),
    Bloodgroup: Joi.string().required(),
    gender: Joi.string().required(),
    fathername: Joi.string().required(),
    mothername: Joi.string().required(),
    DOB: Joi.string().required(),
    caste: Joi.string().required(),
    Address: Joi.string().required(),
    parentmobno: Joi.number().required().min(1000000000).max(9999999999),
    aadharno: Joi.number().required().min(100000000000).max(999999999999)

});

