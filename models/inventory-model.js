const pool = require("../database/")

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        
        return data

    } catch(error) {
        console.error("getclassificationbyid error", error)
        return []
    }
}

async function getInventoryById(inventory_id) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.inventory WHERE inv_id = $1",
            [inventory_id]
        )

        return data.rows[0]

    } catch(error) {
        console.log("Error")
        throw error
    }
}

async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        await pool.query(sql, [classification_name])
        return true
    } catch(error) {
        return false
    }
}
async function addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
    try {
        const sql = `
            INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) 
            VALUES ($1 $2 $3 $4 $5 $6 $7 $8 $9 $10) RETURNING *
        `
        await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
        return true
    } catch(error) {
        return false
    }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventory }