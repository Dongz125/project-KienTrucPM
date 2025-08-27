// services/tokenService.js
const jwt = require("jsonwebtoken");
const { config } = require("../config/index");
const { set, get, del } = require("../config/redis");

const tokenService = {
    createAccessToken: (payload) => {
        return jwt.sign(payload, config.jwt.accessSecret, {
            expiresIn: config.jwt.accessTtl,
        });
    },

    createRefreshToken: (payload) => {
        return jwt.sign(payload, config.jwt.refreshSecret, {
            expiresIn: config.jwt.refreshTtl,
        });
    },

    verifyAccessToken: (token) => {
        return jwt.verify(token, config.jwt.accessSecret);
    },

    verifyRefreshToken: (token) => {
        return jwt.verify(token, config.jwt.refreshSecret);
    },

    // store refresh token in redis keyed by userId (can store multiple tokens per user as needed)
    saveRefreshToken: async (userId, token) => {
        // key: refresh:<userId>:<token> or simpler refresh:<token> -> userId
        await set(`refresh:${token}`, String(userId), config.jwt.refreshTtl);
    },

    revokeRefreshToken: async (token) => {
        await del(`refresh:${token}`);
    },

    isRefreshTokenValid: async (token) => {
        const v = await get(`refresh:${token}`);
        return v; // returns userId string or null
    },
};

module.exports = tokenService;
