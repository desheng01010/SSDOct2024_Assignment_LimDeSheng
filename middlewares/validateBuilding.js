const Joi = require("joi");

const validateBuilding = (req, res, next) => {
  const schema = Joi.object({
    buildingname: Joi.string().min(3).max(50).required(),
    address: Joi.string().min(3).max(100).required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateBuilding;
