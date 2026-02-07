const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")
const invCont = {}


invCont.buildByClassificationId = async (req, res, next) => {
    try {
        const classification_id = req.params.classificationId
        const data = await invModel.getInventoryByClassificationId(classification_id)
        const grid = await utilities.buildClassificationGrid(data.rows)
        const nav = await utilities.getNav()
        
        // FIX THIS LINE: Check data.rows.length, not data.length
        const className = data.rows.length > 0 ? data.rows[0].classification_name : "Inventory"
        
        res.render("./inventory/classification", {
            title: `${className} vehicles`,
            nav,
            grid
        })
    } catch(err) {
        next(err)
    }
}

invCont.buildInventoryDetail = async (req, res, next) => {
    try {
        const inventory_id = req.params.inventoryId
        const vehicle = await invModel.getInventoryById(inventory_id)

        if (!vehicle) {
            throw new Error("Vehicle not found")
        }
        const nav = await utilities.getNav()
        const detailHtml = await utilities.buildInventoryDetailHTML(vehicle)

        res.render("inventory/detail", {
            title: `${vehicle.inv_make} ${vehicle.inv_model}`,
            nav,
            detailHtml
        })
    } catch(err) {
        next(err)
    }
}

module.exports = invCont