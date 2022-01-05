const Joi = require("joi");

const orderValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string(),
    totalPayment: Joi.number().required(),
    quantity: Joi.number().required(),
  }).unknown();
  return schema.validate(data);
};

module.exports.orderValidation = orderValidation;
