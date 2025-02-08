const Joi = require("joi");

const validateQuotation = (req, res, next) => {
  const schema = Joi.object({
    legendcode: Joi.string().min(3).max(50).required(),
    buildingcode: Joi.string().min(3).max(50).required(),
    jobdescription: Joi.string().min(3).max(20).required(),
    quotationdate: Joi.string().min(3).max(50).required(),
    amount: Joi.string().min(3).max(50).required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateQuotation;
