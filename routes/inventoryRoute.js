const express = require("express")
const router = new express.Router()
const invCont = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inv-validation")
const authorization = require("../utilities/authorization")

router.get("/type/:classificationId", utilities.handleErrors(invCont.buildByClassificationId))
router.get("/detail/:inventoryId", utilities.handleErrors(invCont.buildInventoryDetail))
router.get("/", authorization.checkInventoryAccess, utilities.handleErrors(invCont.buildManagement))
router.get("/add-classification", authorization.checkInventoryAccess, utilities.handleErrors(invCont.buildAddClassification))
router.get("/add-inventory", authorization.checkInventoryAccess, utilities.handleErrors(invCont.buildAddInventory))
router.get("/getInventory/:classification_id", utilities.handleErrors(invCont.getInventoryJSON))
router.get("/update/:inventory_id", authorization.checkInventoryAccess, utilities.handleErrors(invCont.buildUpdateInventory))
router.get("/delete/:inv_id", authorization.checkInventoryAccess, utilities.handleErrors(invCont.buildDeleteInventory))

router.post(
    "/add-classification",
    authorization.checkInventoryAccess,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invCont.addClassification)
)

router.post(
    "/add-inventory",
    authorization.checkInventoryAccess,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invCont.addInventory)
)

router.post(
    "/update/",
    authorization.checkInventoryAccess,
    invValidate.newInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invCont.updateInventory)
)

router.post(
    "/delete/",
    authorization.checkInventoryAccess,
    utilities.handleErrors(invCont.deleteInventory)
)

module.exports = router