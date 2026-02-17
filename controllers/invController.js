const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")
const reviewModel = require("../models/review-model")
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
        const inventory_id = parseInt(req.params.inventoryId)
        const vehicle = await invModel.getInventoryById(inventory_id)

        if (!vehicle) {
            throw new Error("Vehicle not found")
        }
        const nav = await utilities.getNav()
        const detailHtml = await utilities.buildInventoryDetailHTML(vehicle)
        const reviews = await reviewModel.getReviewsByInvId(inventory_id)
        const average = await reviewModel.getAverageRating(inventory_id)

        res.render("inventory/detail", {
            title: `${vehicle.inv_make} ${vehicle.inv_model}`,
            nav,
            detailHtml,
            inv_id: inventory_id,
            reviews: reviews,
            averageRating: Math.round(average * 10) / 10
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
        inv_image: "/images/vehicles/no-image.png",
        inv_thumbnail: "/images/vehicles/no-image.png",
        inv_price: "",
        inv_year: "",
        inv_miles: "",
        inv_color: "",
        errors: null,
        // ...(req.body || {})
    })
}

invCont.addInventory = async (req, res, next) => {
    let { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body;
    
    if (!inv_image || inv_image.trim() === "") {
        inv_image = "/images/vehicles/no-image.png"
    }

    if (!inv_thumbnail || inv_thumbnail.trim() === "") {
        inv_thumbnail = "/images/vehicles/no-image-tn.png"
    }

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
        const classificationList = await utilities.buildClassificationList()

        res.render("inventory/management", {
            title: "Inventory Management",
            nav,
            classificationList,
            errors: null
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
    const rows = invData?.rows || []
    return res.json(rows)
}

invCont.buildUpdateInventory = async (req, res, next) => {
    const inv_id = parseInt(req.params.inventory_id)
    const nav = await utilities.getNav()
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
  try {
    let {
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
    } = req.body

    const nav = await utilities.getNav()

    inv_image = inv_image && inv_image.trim() !== "" ? inv_image : "/images/vehicles/no-image.png"

    inv_thumbnail = inv_thumbnail && inv_thumbnail.trim() !== "" ? inv_thumbnail : "/images/vehicles/no-image-tn.png"

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
      classification_id
    )

    if (result) {
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", `${itemName} was successfully updated.`)

      return res.redirect("/inv/")
    }

    const classificationList = await utilities.buildClassificationList(classification_id)

    req.flash("notice", "Update failed. Please try again.")

    res.status(501).render("inventory/update-inventory", {
      title: `Update ${inv_make} ${inv_model}`,
      nav,
      classificationList,
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
      classification_id
    })

  } catch (error) {
    next(error)
  }
}


invCont.buildDeleteInventory = async (req, res, next) => {
    const nav = await utilities.getNav()
    const inv_id = parseInt(req.params.inv_id)
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationList = await utilities.buildClassificationList()

    res.render("inventory/delete-confirm", {
        title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
        nav,
        classificationList,
        inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
        errors: null
    })
}
invCont.deleteInventory = async (req, res, next) => {
    const inv_id = parseInt(req.body.inv_id);
    const nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);

    if (!itemData) {
        req.flash("notice", "Vehicle not found");
        return res.redirect("/inv/");
    }

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    const result = await invModel.deleteInventory(inv_id);

    if (result.rowCount > 0) {
        req.flash("notice", `${itemName} deleted successfully.`);
        const classificationList = await utilities.buildClassificationList();
        res.render("inventory/management", {
            title: "Inventory Management",
            nav,
            classificationList,
            errors: null
        });
    } else {
        req.flash("notice", `Failed to delete ${itemName}`);
        res.redirect(`/inv/delete/${inv_id}`);
    }
};


module.exports = invCont