const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 255 },
  isGold: { type: Boolean, default: false },
  phone: { type: String, required: true, minlength: 3, maxlength: 255 },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255),
    phone: Joi.string().min(3).max(255),
    isGold: Joi.boolean(),
  });

  const result = schema.validate(customer);
  return result;
}

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validateCustomer = validateCustomer;
