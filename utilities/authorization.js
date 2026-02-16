function checkInventoryAccess(req, res, next) {
    const accountData = res.locals.accountData

    if (!accountData || (accountData.account_type !== "Employee" && accountData.account_type !== "Admin")) {
        req.flash("notice", "You must ba logged in with proper permissions to access this page");
        return res.redirect("/account/login")
    }
    next()
}

module.exports = { checkInventoryAccess }