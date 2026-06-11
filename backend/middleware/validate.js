const AppError = require('../utils/AppError');

const validate = (rules) => (req, res, next) => {
  const errors = [];

  rules.forEach((rule) => {
    const value = req.body[rule.field];
    const label = rule.label || rule.field;

    if (rule.required && (value === undefined || value === null || String(value).trim() === '')) {
      errors.push(`${label} is required`);
      return;
    }

    if (value === undefined || value === null || value === '') return;

    if (rule.min && String(value).trim().length < rule.min) {
      errors.push(`${label} must be at least ${rule.min} characters`);
    }

    if (rule.max && String(value).trim().length > rule.max) {
      errors.push(`${label} cannot exceed ${rule.max} characters`);
    }

    if (rule.email && !/^\S+@\S+\.\S+$/.test(String(value))) {
      errors.push(`${label} must be a valid email address`);
    }

    if (rule.enum && !rule.enum.includes(value)) {
      errors.push(`${label} must be one of: ${rule.enum.join(', ')}`);
    }

    if (rule.matchesField && value !== req.body[rule.matchesField]) {
      errors.push(`${label} must match ${rule.matchesLabel || rule.matchesField}`);
    }
  });

  if (errors.length) {
    throw new AppError(errors.join(', '), 400);
  }

  next();
};

module.exports = validate;
