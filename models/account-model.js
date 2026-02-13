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

module.exports = { registerAccount, getAccountByEmail }