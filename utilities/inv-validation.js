const { body, validationResult } = require("express-validator")
const utilities = require("./index")
const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("No spaces or special characters allowed"),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
    })
  }
  next()
}

validate.inventoryRules = () => {
    return [
        body("classification_id")
        .notEmpty()
        .withMessage("Please select a classification."),

        body("inv_make")
        .trim()
        .notEmpty()
        .withMessage("Make is required."),

        body("inv_model")
        .trim()
        .notEmpty()
        .withMessage("Model is required"),

        body("inv_description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

        body("inv_price")
        .isFloat({ min: 1 })
        .withMessage("Price is require"),

        body("inv_year")
        .trim()
        .notEmpty()
        .withMessage("Year is required"),

        body("inv_miles")
        .trim()
        .isInt({ min: 1 })
        .withMessage("Mileage must be 0 or greater"),

        body("inv_color")
        .trim()
        .notEmpty()
        .withMessage("Color is required")
    ]
}

validate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(req.body.classification_id)
        return res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            errors,
            ...req.body
        })
    }
    next()
}

validate.newInventoryRules = () => {
  return [
    body("classification_id")
    .notEmpty()
    .withMessage("Please select a classification."),

    body("inv_make")
    .trim()
    .notEmpty()
    .withMessage("Make is required."),

    body("inv_model")
    .trim()
    .notEmpty()
    .withMessage("Model is required"),

    body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

    body("inv_price")
    .isFloat({ min: 1 })
    .withMessage("Price is require"),

    body("inv_year")
    .trim()
    .notEmpty()
    .withMessage("Year is required"),

    body("inv_miles")
    .trim()
    .isInt({ min: 1 })
    .withMessage("Mileage must be 0 or greater."),

    body("inv_color")
    .trim()
    .notEmpty()
    .withMessage("Color is required")
  ]
}

validate.checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req)
    const { inv_id } = req.body;
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(req.body.classification_id)
        return res.render("inventory/update-inventory", {
            title: "Update Inventory",
            nav,
            classificationList,
            inv_id,
            errors,
            ...req.body
        })
    }
    next()
}

module.exports = validate
