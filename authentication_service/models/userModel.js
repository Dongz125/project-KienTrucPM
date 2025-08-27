// models/userModel.js
const { query } = require("../config/db");

const userModel = {
    createUser: async ({ email, passwordHash, fullName }) => {
        const text = `INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, created_at`;
        const values = [email, passwordHash, fullName];
        const res = await query(text, values);
        return res.rows[0];
    },

    findByEmail: async (email) => {
        const text = `SELECT id, email, password_hash, full_name, created_at FROM users WHERE email = $1`;
        const res = await query(text, [email]);
        return res.rows[0];
    },

    findById: async (id) => {
        const text = `SELECT id, email, full_name, created_at FROM users WHERE id = $1`;
        const res = await query(text, [id]);
        return res.rows[0];
    },
};

module.exports = userModel;
