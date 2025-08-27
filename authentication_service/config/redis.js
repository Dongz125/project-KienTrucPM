// config/redis.js
const redis = require("redis");
const { config } = require("./index");

const client = redis.createClient({ url: config.redisUrl });

// helper wrappers (using promises)
const connect = async () => {
    if (!client.isOpen) {
        await client.connect();
        console.log("Connected to Redis");
    }
};

const set = async (key, value, ttlSeconds) => {
    // value as string
    if (ttlSeconds) {
        await client.set(key, value, { EX: ttlSeconds });
    } else {
        await client.set(key, value);
    }
};

const get = async (key) => {
    return await client.get(key);
};

const del = async (key) => {
    return await client.del(key);
};

module.exports = { client, connect, set, get, del };
