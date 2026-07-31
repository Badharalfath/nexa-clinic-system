const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(d => ({ field: d.path.join('.'), message: d.message }));
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  next();
};

module.exports = { loginSchema, validate };
