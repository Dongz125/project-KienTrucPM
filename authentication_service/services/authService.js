// services/authService.js
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const tokenService = require("./tokenService");
const { config } = require("../config/index");

const authService = {
    register: async ({ email, password, fullName }) => {
        // check exists
        const existing = await userModel.findByEmail(email);

        if (existing) {
            const err = new Error("Email already registered");
            err.status = 400;
            throw err;
        }

        const saltRounds = config.bcryptRounds || 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const user = await userModel.createUser({
            email,
            passwordHash,
            fullName,
        });
        // no return password
        return user;
    },

    login: async ({ email, password }) => {
        const user = await userModel.findByEmail(email);

        if (!user) {
            const err = new Error("Invalid credentials");
            err.status = 401;
            throw err;
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            const err = new Error("Invalid credentials");
            err.status = 401;
            throw err;
        }

        const payload = { sub: user.id, email: user.email };
        const accessToken = tokenService.createAccessToken(payload);
        const refreshToken = tokenService.createRefreshToken(payload);

        // save refresh token in redis
        await tokenService.saveRefreshToken(user.id, refreshToken);

        return {
            user: { id: user.id, email: user.email, full_name: user.full_name },
            accessToken,
            refreshToken,
        };
    },

    refreshAccessToken: async (refreshToken) => {
        try {
            // verify signature & expiry
            const decoded = tokenService.verifyRefreshToken(refreshToken);
            // check in redis
            const ownerId = await tokenService.isRefreshTokenValid(
                refreshToken,
            );

            if (!ownerId || String(ownerId) !== String(decoded.sub)) {
                const err = new Error("Invalid refresh token");
                err.status = 401;
                throw err;
            }

            const payload = { sub: decoded.sub, email: decoded.email };
            const accessToken = tokenService.createAccessToken(payload);

            return { accessToken };
        } catch (e) {
            const err = new Error("Invalid refresh token");
            err.status = 401;
            throw err;
        }
    },

    logout: async (refreshToken) => {
        await tokenService.revokeRefreshToken(refreshToken);
        return true;
    },
};

module.exports = authService;
