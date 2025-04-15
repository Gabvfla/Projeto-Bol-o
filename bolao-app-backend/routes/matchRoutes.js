const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  createMatch,
  finishMatch,
  getMatchesByPool,
} = require("../controllers/matchController");
const isAdmin = require("../middlewares/isAdmin");

router.post("/:poolId", auth, isAdmin, createMatch); // Criar partida
router.put("/finish/:matchId", auth, isAdmin, finishMatch); // Finalizar partida
router.get("/pool/:poolId", auth, getMatchesByPool); // Listar partidas de um bolão

module.exports = router;
