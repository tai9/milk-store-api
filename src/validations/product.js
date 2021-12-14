const Joi = require("joi");

const productValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
  }).unknown();
  return schema.validate(data);
};

module.exports.productValidation = productValidation;
