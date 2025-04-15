const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  createGuess,
  getUserGuessesByPool,
} = require("../controllers/guessController");

router.post("/:matchId", auth, createGuess); // Criar palpite
router.get("/pool/:poolId", auth, getUserGuessesByPool); // Palpites do usuário por bolão

module.exports = router;
