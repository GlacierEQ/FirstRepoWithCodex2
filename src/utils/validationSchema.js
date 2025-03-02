import Joi from 'joi';

// ✅ Common schema for all users (clients & workers)
const commonSchema = {
  username: Joi.string().min(3).required().messages({
    'string.empty': 'Username is required.',
    'string.min': 'Username must be at least 3 characters long.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 8 characters long.',
  }),
  name: Joi.string().min(2).required().messages({
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 2 characters long.',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
  }),
  phoneNumber: Joi.string()
    .pattern(/^(\+?[0-9\s-]{7,15})$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required.',
      'string.pattern.base': 'Phone number must be a valid format (e.g., +1234567890 or 123-456-7890).',
    }),
};

// ✅ Client Validation Schema (NO PROFILE PICTURE, SIMPLE FORM)
export const clientSchema = Joi.object({
  ...commonSchema,
});

// ✅ Worker Validation Schema (PROFILE PICTURE REQUIRED, EXPERIENCE REQUIRED)
export const workerSchema = Joi.object({
  ...commonSchema,
  profilePicture: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .pattern(/\.(jpg|png)$/i)
    .required()
    .messages({
      'string.empty': 'Profile picture is required for workers.',
      'string.uri': 'Profile picture must be a valid URL.',
      'string.pattern.base': 'Profile picture must be a .jpg or .png file.',
    }),
  skills: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.base': 'Skills must be an array of strings.',
    'array.min': 'At least one skill is required.',
  }),
  experienceYears: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Experience (years) must be a valid number.',
      'number.min': 'Experience (years) cannot be negative.',
    }),
  experienceMonths: Joi.number()
    .integer()
    .min(0)
    .max(11) // ✅ Months should be between 0-11
    .messages({
      'number.base': 'Experience (months) must be a valid number.',
      'number.min': 'Experience (months) cannot be negative.',
      'number.max': 'Experience (months) must be between 0 and 11.',
    }),
}).custom((value, helpers) => {
  // 🔥 Ensure at least one of `experienceYears` or `experienceMonths` is provided
  if ((value.experienceYears === undefined || value.experienceYears === null) &&
      (value.experienceMonths === undefined || value.experienceMonths === null)) {
    return helpers.message('At least one of experienceYears or experienceMonths is required.');
  }
  return value;
});
