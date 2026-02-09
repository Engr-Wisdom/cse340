const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
    return body(classification_name)
        .trim()
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage("Classification name cannot contain space or special character")
        .notEmpty()
        .withMessage("Provide a classification name")
}

validate.checkClassificationData = async (req, res, next) => {
    const errors = validationResult()
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        res.render("/inv/add-classification", {
            title: "Add Classification",
            nav,
            classification_name: req.body.classification_name
        })
    }

    next()
}