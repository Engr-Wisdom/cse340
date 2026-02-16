const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/* *********************
* Login Data Validation Rules
********************* */

validate.loginRules = () => {
    return [
        body("account_email")
        .trim()
        .notEmpty()
        .escape()
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid email address"),


        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Invalid password")
    ]
}

/* ************************
* Check data and return errors or continue to registration
************************ */

validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            title: "Login",
            nav,
            errors,
            account_email,
        })
        return
    } 
    next()
}

/* *********************
* Registration Data Validation Rules
********************* */

validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."),

        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name"),

        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required"),

        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements.")
    ]
}

/* ************************
* Check data and return errors or continue to registration
************************ */

validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            title: "Register",
            nav,
            errors,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    } 
    next()
}

validate.updateRules = () => {
    return [
        body('account_firstname')
        .trim()
        .escape()
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 1 })
        .withMessage("First name must be atlest 1 character"),

        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Last Name is required")
        .isLength({ min: 1 })
        .withMessage("Last Name must be atleast 1 character"),

        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Email is required")
        .normalizeEmail()
        .custom(async (email, { req }) => {
            const accountId = req.body.account_id
            const account = await accountModel.getAccountById(accountId)

            if (email === account.account_email) {
                return true
            }

            const emailExist = await accountModel.checkExistingEmail(email)
            if (emailExist) {
                throw new Error("Email already exists. Please use a different email.")
            }
        })
    ]
}

validate.passwordRules = () => {
    return [
        body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password required")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        .withMessage(
            "Password must be atleast 8 characters and contain at least 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character"
        )
    ]
}

validate.checkValidation = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            title: "Update Account",
            nav,
            errors: errors,
            ...req.body
        })
        return
    }
    next()
}

module.exports = validate