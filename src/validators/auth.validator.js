const Joi = require('joi');

const getotpSchema = Joi.object({
  phone: Joi.string().min(3).max(50).required().messages({
    'string.min': 'phone cannot be less than 3 characters',
    'string.max': 'phone cannot be more than 50 characters',
    'string.empty': 'phone cannot be empty',
  }),
});

const authSchema = Joi.object({
  phone: Joi.string().min(3).max(50).required().messages({
    'string.min': 'phone cannot be less than 3 characters',
    'string.max': 'phone cannot be more than 50 characters',
    'string.empty': 'phone cannot be empty',
  }),
  code: Joi.number().min(10000).max(99999).required().messages({
    'number.min': 'code cannot be less than 5 characters',
    'number.max': 'code cannot be more than 20 characters',
    'number.empty': 'code cannot be empty',
  }),
});

const profileSchema = Joi.object({
  username: Joi.string().min(3).max(50).allow('').messages({
    'string.min': 'Username cannot be less than 3 characters',
    'string.max': 'Username cannot be more than 50 characters',
  }),
  firstName: Joi.string().max(20).allow('').messages({
    'string.max': 'firstName cannot be more than 20 characters',
  }),
  lastName: Joi.string().max(20).allow('').messages({
    'string.max': 'lastName cannot be more than 20 characters',
  }),
});

module.exports = {
  authSchema ,getotpSchema ,profileSchema
};
