// const invModel = require("../models/inventory-model")
// const Util = {}

// Util.getNav = async (req, res, next) => {

//     const data = await invModel.getClassifications()
//     let nav = "<ul>"
//     nav += '<li><a href="/" title="Home page">Home</a></li>'
//     data.rows.forEach(row => {
//         nav += "<li>"
//         nav += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name}">
//         ${row.classification_name}</a>`
//         nav += "</li>"
//     })

//     nav += "</ul>"
//     return nav
// }

// Util.buildClassificationGrid = async (data) => {
//     let grid = ""
//     if (data.length > 0) {
//         grid = '<ul id="inv-display">'
//         data.forEach(vehicle => {
//             grid += '<li>'
//             grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
//                 <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" on CSE Motors />
//             </a>`

//             grid += '<div class="namePrice">'
//             grid += '<hr />'
//             grid += '<h2>'
//             grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
//                 ${vehicle.inv_make} ${vehicle.inv_model}
//             </a>`
//             grid += '</h2>'
//             grid += `<span>$ ${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`
//             grid += '</div>'
//             grid += '</li>'
//         })
//         grid += '</ul>'

//     } else {
//         grid ='<p class="notice">Sorry, no matching vehicles could be found.</p>'
//     }

//     return grid
// }

// Util.buildInventoryDetailHTML = (vehicle) => {
//     return `
//     <section>
//         <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
//         <div class="vehicle-detail">
//             <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
//             <div>
//                 <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
//                 <p class="price"><b>Price: $${vehicle.inv_price}</b></p>
//                 <p><b>Description:</b> ${vehicle.inv_description}</p>
//                 <p class="color"><b>Color:</b> ${vehicle.inv_color}</p>
//                 <p><b>Miles:</b> ${vehicle.inv_miles}</p>
//             </div>
//         </div>
//     </section>
//     `
// }

// /* ************************
// * Middleware For Handling Errors
// * Wrap other function in this for
// * General Error Handling
// ************************ */

// Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// module.exports = Util





const invModel = require("../models/inventory-model")
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
    let data = await invModel.getClassifications()
    let list = `<select name="classification_id" required>`
    list += `<option value="">Choose a Classification</option>`
    data.rows.forEach(row => {
        list += `<option value="${row.classification_id}"`
        if (classification_id == row.classification_id) {
            list += " selected"
        }
        list += `>$${row.classification_name}</option>`
    })
    list += `</select>`
    return list
}

/* ************************
* Middleware For Handling Errors
* Wrap other function in this for
* General Error Handling
************************ */

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util