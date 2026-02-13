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
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        classificationList,
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
        const classificationList = await utilities.buildClassificationList()
        res.render("inventory/management", {
            title: "Inventory Management",
            nav,
            classificationList,
            errors: null
        })
    } else {
        req.flash("notice", `Failed to add ${classification_name}`)
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

invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData.rows.length > 0) {
        return res.json(invData.rows)
    } else {
        return res.json([])
    }
}

invCont.updateInventory = async (req, res, next) => {
    const inv_id = parseInt(req.params.inv_id)
    const nav = utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationList = await utilities.buildClassificationList(itemData.classification_id)
    const itemsName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("inventory/update-inventory", {
        title: `update ${itemsName}`,
        nav,
        classificationList: classificationList,
        errors: null,
        inv_id:  itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_year: itemData.inv_year,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id,
    })
}

invCont.updateInventory = async (req, res, next) => {
    const {
        inv_id, 
        inv_make, 
        inv_model, 
        inv_description,
        inv_image,
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color, 
        classification_id 
    } = req.body;
    const result = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,  
    )
    const nav = await utilities.getNav()

    if (result) {
        const itemName = `${result.inv_make} ${result.inv_model}`
        req.flash("notice", `${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationList = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "sorry the insert failed")
        res.status(501).render("inventory/update-inventory", {
            title: "Update " + itemName,
            nav,
            classificationList: classificationList,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,  
        })
    }
}

invCont.buildDeleteInventory = async (res, req, next) => {
    const nav = await utilities.getNav()
    const inv_id = parseInt(req.params.inv_id)
    const itemData = await invModel.getInventoryById(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("inventory/delete-confirm", {
        title: `Delete ${itemName}`,
        nav,
        errors: null
    })
}

invCont.deleteInventory = async (req, res, next) => {
    const { inv_id } = req.body;
    const result = await invModel.deleteInventory(inv_id)
    const nav = await utilities.getNav()
    const itemData = parseInt(req.params.inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    if (result) {
        req.flash("notice", `${itemName} deleted successfully.`)
        res.render("inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", `Failed to delete ${itemName}`)
        res.render("inventory/delete-confirm", {
            title: `Delete ${itemName}`,
            nav,
            errors: null,
        })
    }
}

module.exports = invCont