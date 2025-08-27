// test.js
const axios = require("axios");

const base = "http://localhost:4000/api/auth";

(async () => {
    try {
        console.log("1) Registering user...");
        const email = `test${Date.now()}@example.com`;
        const password = "Password123!";
        let res = await axios.post(`${base}/register`, {
            email,
            password,
            fullName: "Test User",
        });
        console.log("register result:", res.data);

        console.log("2) Logging in...");
        res = await axios.post(`${base}/login`, { email, password });
        console.log("login result:", res.data);
        const { accessToken, refreshToken } = res.data;

        console.log("3) Refreshing access token...");
        res = await axios.post(`${base}/refresh`, { refreshToken });
        console.log("refresh result:", res.data);

        console.log("4) Logging out...");
        res = await axios.post(`${base}/logout`, { refreshToken });
        console.log("logout result:", res.data);
    } catch (err) {
        if (err.response) {
            console.error("API error:", err.response.status, err.response.data);
        } else {
            console.error(err);
        }
    }
})();
