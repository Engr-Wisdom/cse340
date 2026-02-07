const express = require("express")
const router = new express.Router()
const invCont = require("../controllers/invController")
const utitlities = require("../utilities/")

router.get("/type/:classificationId", invCont.buildByClassificationId)
router.get("/detail/:inventoryId", utitlities.handleErrors(invCont.buildInventoryDetail))

module.exports = router