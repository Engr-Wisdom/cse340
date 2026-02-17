const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const validate = require("../utilities/review-validation")

router.get(
    "/add/:inv_id", 
    utilities.checkLogin, 
    utilities.handleErrors(reviewController.buildReviewForm)
)

router.post(
    "/add", 
    utilities.checkLogin,
    validate.reviewRules(),
    validate.checkReviewData,
    utilities.handleErrors(reviewController.addReview)
)

router.post(
    "/delete/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router