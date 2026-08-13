import { validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render("...", {
            errors: errors.array(),
            formData: req.body
        });
    }

    next();
};