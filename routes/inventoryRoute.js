const express = require("express")
const router = new express.Router()
const invCont = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inv-validation")

router.get("/type/:classificationId", utilities.handleErrors(invCont.buildByClassificationId))
router.get("/detail/:inventoryId", utilities.handleErrors(invCont.buildInventoryDetail))
router.get("/", utilities.handleErrors(invCont.buildManagement))
router.get("/add-classification", utilities.handleErrors(invCont.buildAddClassification))
router.get("/add-inventory", utilities.handleErrors(invCont.buildAddInventory))
router.get("/getInventory/:classification_id", utilities.handleErrors(invCont.getInventoryJSON))
router.get("/update/:inventory_id", utilities.handleErrors(invCont.updateInventory))
router.get("/:inv_id", utilities.handleErrors(invCont.buildDeleteInventory))

router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invCont.addClassification)
)

router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invCont.addInventory)
)

router.post(
    "/update/",
    invValidate.newInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invCont.updateInventory)
)

router.post(
    "/delete/",
    utilities.handleErrors(invCont.deleteInventory)
)

module.exports = router