const express = require("express");
const router = express.Router();
const BacktestController = require("../controllers/backtestController");

router.post("/backtest", BacktestController.runBacktest);
router.get("/backtest/results", BacktestController.getResults);

module.exports = router;
