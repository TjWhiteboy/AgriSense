const Joi = require('joi');

const chatSchema = Joi.object({
    message: Joi.string().required().messages({
        'string.base': `message should be a type of text`,
        'string.empty': `message cannot be an empty field`,
        'any.required': `message is a required field`,
    }),
});

const validateChatRequest = (req, res, next) => {
    const { error } = chatSchema.validate(req.body);

    if (error) {
        // Pass validation error to the global error handler
        const err = new Error(error.details[0].message);
        err.name = 'ValidationError';
        return next(err);
    }

    next();
};

module.exports = validateChatRequest;
