const pool = require("../database/")
const bcrypt = require("bcryptjs")

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const hashedPassword = await bcrypt.hash(account_password, 10) // 10 salt rounds
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword])
    } catch(error) {
        return error.message
    }
}


async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query("SELECT * FROM account WHERE account_email = $1", [account_email])
        return result.rows[0]

    } catch(error) {
        throw new Error("NO matching email found")
    }
}

async function getAccountById(account_id) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
            [account_id]
        )

        return result.rows[0]

    } catch(error) {
        console.error(`getAccountById error: ${error}`)
        throw error
    }
}

async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
    try {
        const sql = `
            UPDATE account
            SET account_firstname = $1, account_lastname = $2, account_email = $3
            WHERE account_id = $4
            RETURNING *
        `
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
        return result.rows[0]

    } catch(error) {
        console.error(`pdateAccount error: ${error}`)
    }
}

module.exports = { registerAccount, getAccountByEmail, getAccountById, updateAccount }