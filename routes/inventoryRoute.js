const express = require("express")
const router = new express.Router()
const invCont = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inv-validation")

router.get("/type/:classificationId", invCont.buildByClassificationId)
router.get("/detail/:inventoryId", utilities.handleErrors(invCont.buildInventoryDetail))
router.get("/", utilities.handleErrors(invCont.buildManagement))
router.get("/add-classification", utilities.handleErrors(invCont.buildAddClassification))
router.get("/add-inventory", utilities.handleErrors(invCont.buildAddInventory))

router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invCont.addClassification)
)

router.post(
    "/add-inventtory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invCont.addInventory)
)

module.exports = router