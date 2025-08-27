// config/index.js
require("dotenv").config();

const config = {
    port: process.env.PORT || 4000,
    db: {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "auth_db",
    },
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    jwt: {
        accessSecret: process.env.ACCESS_TOKEN_SECRET || "access-secret-key",
        refreshSecret: process.env.REFRESH_TOKEN_SECRET || "refresh-secret-key",
        accessTtl: Number(process.env.ACCESS_TOKEN_TTL) || 900,
        refreshTtl: Number(process.env.REFRESH_TOKEN_TTL) || 604800,
    },
    bcryptRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
};

module.exports = { config };
