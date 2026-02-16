const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

async function buildLogin(req, res, next) {
    const nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login", 
        nav,
    })
}

async function buildRegister(req, res, next) {
    const nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register", 
        nav, 
        errors: null 
    })
}

async function registerAccount(req, res, next) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password} = req.body

    const reqResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )

    if (reqResult) {
        req.flash("notice", `Congratulations, you\'re registered ${account_firstname}. Please log in.`)

        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed")
        res.status(501).render("account/register", {
            title: "Register",
            nav,
        })
    }
}

async function loginAccount(req, res, next) {
    const nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
        req.flash("notice", `Please check your credentials and try again.`)
        res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email })
        return
    }

    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 }) // 1 hour

            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }

            return res.redirect("/account/")

        } else {
            req.flash("notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", { title: "Login", nav, errors: null, account_email })
        }
    } catch(error) {
        console.error(error)
        throw new Error("Access Forbidden")
    }
}


async function buildManagement(req, res, next) {
    const nav = await utilities.getNav()
    const accountData = res.locals.accountData

    res.render("account/management", {
        title: "Account Management",
        nav,
        accountData,
        errors: null,
    })
}

async function buildUpdateAccount(req, res, next) {
    try {
        const account_id = parseInt(req.params.account_id)

        if (account_id !== res.locals.accountData.account_id) {
            req.flash("notice", "You can only update your own account")
            return res.redirect("/account/")
        }

        const accountData = await accountModel.getAccountById(account_id)
        const nav = await utilities.getNav()

        res.render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            account_id: accountData.account_id,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email            
        })

    } catch(error) {
        next(error)
    }
}

async function updateAccount(req, res, next) {
    try {
        const { account_id, account_firstname, account_lastname, account_email } = req.body;
        const parsedId = parseInt(account_id)

        if (parsedId !== res.locals.accountData.account_id) {
            req.flash("notice", "You can only update your own account")
            return res.redirect("/account/")
        }

        const updateResult = await accountModel.updateAccount(parsedId, account_firstname, account_lastname, account_email)

        if (updateResult) {
            const payload = {
                account_id: updateResult.account_id,
                account_firstname: updateResult.account_firstname,
                account_lastname: updateResult.account_lastname,
                account_email: updateResult.account_email,
                account_type: updateResult.account_type
            }
            
            const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
            res.cookie("jwt", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

            req.flash("notice", "Account information updated successfully")
            res.redirect("/account/")

        } else {
            req.flash("notice", "Updated failed. Please try again.")
            res.redirect(`/account/update/${account_id}`)
        }

    } catch(error) {
        next(error)
    }
}

async function changePassword(req, res, next) {
    try {
        const { account_id, account_password } = req.body
        const parseId = parseInt(account_id)

        if (parseId !== res.locals.accountData.account_id) {
            req.flash("notice", "You can only change your own password")
            res.redirect("/account/")
        }

        const hashedPassword = await bcrypt.hash(account_password, 10)
        const updateResult = await accountModel.updateAccount(parseId, hashedPassword)

        if (updateResult) {
            req.flash("notice", "Password changed successfully")
            res.redirect("/account/")

        } else {
            req.flash("notice", "Password change failed. Please try again.")
            res.redirect(`/account/update/${account_id}`)
        }

    } catch(error) {
        next(error)
    }
}

async function logout(req, res, next) {
    res.clearCookie("jwt")
    req.flash("notice", "You have been logged out")
    res.redirect("/")
}

module.exports = { 
    buildLogin, 
    buildRegister, 
    registerAccount, 
    loginAccount, 
    buildManagement, 
    buildUpdateAccount, 
    updateAccount, 
    changePassword, 
    logout 
}