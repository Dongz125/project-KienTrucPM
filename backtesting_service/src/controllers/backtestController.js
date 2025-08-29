const BacktestService = require("../services/backtestService");

const BacktestController = {
    async runBacktest(req, res) {
        console.log("Request body:", req.body); // 👈 thêm log

        try {
            const { symbol, start, end, strategy, params } = req.body;
            const result = await BacktestService.runBacktest(
                symbol,
                start,
                end,
                strategy,
                params,
            );
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getResults(req, res) {
        try {
            const results = await BacktestService.getResults();
            res.json(results);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = BacktestController;
