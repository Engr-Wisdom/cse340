const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async (req, res) => {
    req.flash("notice", "This is a fash message.")
   const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav})
}

module.exports = baseController