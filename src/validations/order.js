const Joi = require("joi");

const orderValidation = (data) => {
  const schema = Joi.object({
    customerName: Joi.string(),
    totalAmount: Joi.number().required(),
    totalPayment: Joi.number().required(),
  }).unknown();
  return schema.validate(data);
};

module.exports.orderValidation = orderValidation;
