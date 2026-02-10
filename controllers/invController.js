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

invCont.buildManagement = async (req, res, next) => {
    const nav = await utilities.getNav()
    res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
    });
}

invCont.buildAddClassification = async (req, res, next) => {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

invCont.addClassification = async (req, res, next) => {
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name)
    const nav = await utilities.getNav()

    if (result) {
        req.flash("notice", `${classification_name} added successfully.`)
        res.render("inventory/management", {
            title: "Inventory Management",
            nav,
        })
    } else {
        req.flash("notice", "Failed to add classification")
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
        })
    }
}

invCont.buildAddInventory = async (req, res, next) => {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()

    res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        inv_make: "",
        inv_model: "",
        inv_description: "",
        inv_image: "",
        inv_thumbnail: "",
        inv_price: "",
        inv_year: "",
        inv_miles: "",
        inv_color: "",
        errors: null,
        // ...(req.body || {})
    })
}

invCont.addInventory = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body;
    const result = await invModel.addInventory(
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
    )
    const nav = await utilities.getNav()

    if (result) {
        req.flash("notice", `${inv_make} added successfully.`)
        res.render("inventory/management", {
            title: "Inventory Management",
            nav,
        })
    } else {
        req.flash("notice", "Failed to add Inventory")
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            errors: null,
        })
    }
}

module.exports = invCont