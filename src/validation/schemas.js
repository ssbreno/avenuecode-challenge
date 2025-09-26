const Joi = require('joi');

const personIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

const personCreateSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required()
});

const personListSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).optional(),
  lastName: Joi.string().trim().min(1).max(100).optional()
}).or('firstName', 'lastName');

module.exports = {
  personIdSchema,
  personCreateSchema,
  personListSchema
};
