const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

validate.reviewRules = () => {
    return [
        body("review_text")
        .trim()
        .escape()
        .notEmpty().withMessage("Review text is required.")
        .isLength({ min: 10 }).withMessage("Review must be atleast 10 character long"),

        body("review_rating")
        .isInt({ min: 1, max: 5 }).withMessage("Rating ust be between 1 and 5")
    ]
}

validate.checkReviewData = async (req, res, next) => {
    const { review_text, review_rating, inv_id } = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        res.render("review/add-review", {
            title: "Add Review",
            nav,
            errors,
            review_text,
            review_rating,
            inv_id
        })
        return
    }
    next()
}

module.exports = validate