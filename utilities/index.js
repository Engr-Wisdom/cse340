const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

Util.getNav = async (req, res, next) => {

    const data = await invModel.getClassifications()
    let nav = "<ul>"
    nav += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach(row => {
        nav += "<li>"
        nav += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name}">
        ${row.classification_name}</a>`
        nav += "</li>"
    })

    nav += "</ul>"
    return nav
}

Util.buildClassificationGrid = async (data) => {
    let grid = ""
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            // Format price with commas
            const formattedPrice = new Intl.NumberFormat('en-US').format(vehicle.inv_price)
            
            grid += '<li>'
            grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" on CSE Motors />
            </a>`

            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
            </a>`
            grid += '</h2>'
            grid += `<span>$ ${formattedPrice}</span>`
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'

    } else {
        grid ='<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }

    return grid
}

Util.buildInventoryDetailHTML = (vehicle) => {
    // Format price with commas
    const formattedPrice = new Intl.NumberFormat('en-US').format(vehicle.inv_price)
    
    // Format mileage with commas (if miles exist)
    let formattedMiles = vehicle.inv_miles
    if (vehicle.inv_miles) {
        formattedMiles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
    }
    
    return `
    <section>
        <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <div class="vehicle-detail">
            <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
            <div>
                <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
                <p class="price"><b>Price: $${formattedPrice}</b></p>
                <p><b>Description:</b> ${vehicle.inv_description}</p>
                <p class="color"><b>Color:</b> ${vehicle.inv_color}</p>
                <p><b>Miles:</b> ${formattedMiles}</p>
            </div>
        </div>
    </section>
    `
}

Util.buildClassificationList = async (classification_id = null) => {
    const data = await invModel.getClassifications()
    let list = `<select id="classificationList" name="classification_id" required>`
    list += `<option value="">Choose a Classification</option>`
    data.rows.forEach(row => {
        list += `<option value="${row.classification_id}"`
        if (classification_id == row.classification_id) {
            list += " selected"
        }
        list += `>${row.classification_name}</option>` // removed the $
    })
    list += `</select>`
    return list
}


/* ************************
* Middleware For Handling Errors
* Wrap other function in this for
* General Error Handling
************************ */

/* *************************** 
* Middleware to check token validity
**************************** */

// Util.checkJWTToken = (req, res, next) => {
//     if (req.cookies.jwt) {
//         jwt.verify(
//             req.cookies.jwt,
//             process.env.ACCESS_TOKEN_SECRET,
//             function (err, accountData) {
//                 if (err) {
//                     req.flash("Please log in")
//                     res.clearCookie("jwt")
//                     return res.redirect("/account/login")
//                 }
//                 res.locals.accountData = accountData
//                 res.locals.loggedin = 1
//                 next()
//             })
            
//     } else {
//         next()
//     }
// }

/* *************************** 
* Middleware to check token validity
**************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    // Just clear the cookie and continue - don't redirect
                    console.log("JWT Error:", err.message)
                    res.clearCookie("jwt")
                    return next()
                }
                console.log("JWT Verified - AccountData:", accountData) // Debug log
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/**************************
 * Check Login
 *********************** */

Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

module.exports = Util