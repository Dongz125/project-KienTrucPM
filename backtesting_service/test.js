const axios = require("axios");

(async () => {
    try {
        console.log("🔍 Testing API...");
        // Run a backtest
        const backtest = await axios.post(
            "http://localhost:6000/api/backtest",
            {
                symbol: "BTCUSDT",
                start: 1620000000000,
                end: 1621000000000,
                strategy: "movingAverage",
                params: { short: 5, long: 10 },
            },
        );

        console.log("✅ Backtest response:", backtest.data);

        // Get all results
        const results = await axios.get(
            "http://localhost:6000/api/backtest/results",
        );
        console.log("✅ Backtest results:", results.data);
    } catch (err) {
        console.error("❌ Test failed", err.message);
    }
})();
