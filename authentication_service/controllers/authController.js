// controllers/authController.js
const authService = require("../services/authService");

const authController = {
    register: async (req, res) => {
        try {
            const { email, password, fullName } = req.body;

            if (!email || !password)
                return res
                    .status(400)
                    .json({ message: "Email and password required" });

            const user = await authService.register({
                email,
                password,
                fullName,
            });
            res.status(201).json({ user });
        } catch (err) {
            res.status(err.status || 500).json({
                message: err.message || "Internal error",
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const { user, accessToken, refreshToken } = await authService.login(
                {
                    email,
                    password,
                },
            );
            res.json({ user, accessToken, refreshToken });
        } catch (err) {
            res.status(err.status || 500).json({
                message: err.message || "Internal error",
            });
        }
    },

    refresh: async (req, res) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken)
                return res
                    .status(400)
                    .json({ message: "refreshToken required" });

            const data = await authService.refreshAccessToken(refreshToken);
            res.json(data);
        } catch (err) {
            res.status(err.status || 500).json({
                message: err.message || "Internal error",
            });
        }
    },

    logout: async (req, res) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken)
                return res
                    .status(400)
                    .json({ message: "refreshToken required" });

            await authService.logout(refreshToken);
            res.json({ message: "Logged out" });
        } catch (err) {
            res.status(err.status || 500).json({
                message: err.message || "Internal error",
            });
        }
    },
};

module.exports = authController;
