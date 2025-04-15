const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const { getRankingByPool } = require("../controllers/rankingController");

router.get("/:poolId", auth, getRankingByPool);

module.exports = router;
