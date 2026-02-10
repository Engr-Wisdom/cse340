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

        body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Image is required"),

        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Thumbnail is required"),

        body("inv_price")
        .trim()
        .notEmpty()
        .withMessage("Price is require"),

        body("inv_year")
        .trim()
        .notEmpty()
        .withMessage("Year is required"),

        body("inv_miles")
        .trim()
        .notEmpty()
        .withMessage("Miles is required"),

        body("inv_color")
        .trim()
        .notEmpty()
        .withMessage()
    ]
}

validate.checkInventoryData = async () => {
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

        next()
    }
}

module.exports = validate
