const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")
const { validationResult } = require('express-validator')

const reviewController = {}

reviewController.buildReviewForm = async (req, res, next) => {
    try {
        const inv_id = parseInt(req.params.inv_id)
        const nav = await utilities.getNav()

        res.render("review/add-review", {
            title: "Add Review",
            nav,
            inv_id,
            review_text: '',  // ← CRITICAL: Initialize empty string
            review_rating: '', // ← CRITICAL: Initialize empty string
            errors: null,
            account_id: res.locals.accountData?.account_id
        })

    } catch(error) {
        next(error)
    }
}

reviewController.addReview = async (req, res, next) => {
    try {
        const { review_text, review_rating, inv_id } = req.body
        const account_id = res.locals.accountData.account_id
        
        // Check for validation errors
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            const nav = await utilities.getNav()
            return res.render("review/add-review", {
                title: "Add Review",
                nav,
                inv_id,
                review_text: review_text,
                review_rating: review_rating,
                errors: errors,
                account_id: account_id
            })
        }

        const result = await reviewModel.addReview(review_text, review_rating, account_id, inv_id)

        if (result) {
            req.flash("notice", "Review added successfully")
            res.redirect(`/inv/detail/${inv_id}`)
    
        } else {
            req.flash("notice", "Failed to add review. Please try again.")
            res.redirect(`/review/add/${inv_id}`)
        }

    } catch(error) {
        next(error)
    }
}

reviewController.deleteReview = async (req, res, next) => {
    try {
        const review_id = parseInt(req.params.review_id)
        const account_id = res.locals.accountData.account_id
        const inv_id = req.body.inv_id || req.query.inv_id

        const result = await reviewModel.deleteReview(review_id, account_id)

        if (result.rowCount > 0) {
            req.flash("notice", "Review deleted successfully.")
        } else {
            req.flash("notice", "Failed to delete review.")
        }

        res.redirect(`/inv/detail/${inv_id}`)

    } catch(error) {
        next(error)
    }
}

reviewController.getVehicleReview = async (req, res, next) => {
    try {
        const inv_id = parseInt(req.params.inv_id)
        const reviews = await reviewModel.getReviewsByInvId(inv_id)
        const average = await reviewModel.getAverageRating(inv_id)

        res.locals.reviews = reviews
        res.locals.averageRating = Math.round(average * 10) / 10
        next()

    } catch(error) {
        next(error)
    }
}

module.exports = reviewController