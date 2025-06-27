const Joi = require('joi');

const createPostSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).required()
});

const updatePostSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  content: Joi.string().min(10)
}).or('title', 'content');

module.exports = {
  createPostSchema,
  updatePostSchema
};