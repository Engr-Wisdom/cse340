const express = require("express")
const router = new express.Router()
const invCont = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inv-validation")

router.get("/type/:classificationId", invCont.buildByClassificationId)
router.get("/detail/:inventoryId", utitlities.handleErrors(invCont.buildInventoryDetail))
router.get("/", utitlities.handleErrors(invCont.buildManagement))
router.get("/add-classification", utitlities.handleErrors(invCont.buildAddClassification))

router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invCont.addClassification)
)

module.exports = router