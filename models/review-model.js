const pool = require("../database/")

async function addReview(review_text, review_rating, account_id, inv_id) {
    try {
        const sql = "INSERT INTO review (review_text, review_rating, account_id, inv_id) VALUES ($1, $2, $3, $4) RETURNING *"
        return await pool.query(sql, [review_text, review_rating, account_id, inv_id])

    } catch(error) {
        console.error("addReview error: " + error)
        return null
    }
}

async function getReviewsByInvId(inv_id) {
    try {
        const sql = `
            SELECT r.*, a.account_firstname, a.account_lastname FROM review r
            JOIN account a ON r.account_id = a.account_id
            WHERE r.inv_id = $1
            ORDER BY r.review_date DESC
        `

        const result = await pool.query(sql, [inv_id])
        return result.rows

    } catch(error) {
        console.error("getReviewsByInvId errors: " + error)
        return []
    }
}

async function getAverageRating(inv_id) {
    try {
        const sql = "SELECT AVG(review_rating) as average FROM review WHERE inv_id = $1"
        const result = await pool.query(sql, [inv_id])
        return result.rows[0].average || 0

    } catch(error) {
        console.error("getAverageRating errors " + error)
        return 0
    }
}

async function deleteReview(review_id, account_id) {
    try {
        const sql = "DELETE FROM review WHERE review_id = $1 AND account_id = $2 RETURNING *"
        return await pool.query(sql, [review_id, account_id])
        
    } catch(error) {
        console.error("deleteReview errors: " + error)
        return null
    }
}

module.exports = { addReview, getReviewsByInvId, getAverageRating, deleteReview }