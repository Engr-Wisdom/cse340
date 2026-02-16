const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const validate = require("../utilities/account-validation")

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement    ))
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))
router.get("/logout", utilities.handleErrors(accountController.logout))

router.post(
    "/login",
    validate.loginRules(),
    validate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount)
)

router.post(
    "/register",
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount),
)

router.post(
    "/update",
    utilities.checkLogin,
    validate.updateRules(),
    validate.checkValidation,
    utilities.handleErrors(accountController.updateAccount)
)

router.post(
    "/change-password",
    utilities.checkLogin,
    validate.passwordRules(),
    validate.checkValidation,
    utilities.handleErrors(accountController.changePassword)
)

module.exports = router