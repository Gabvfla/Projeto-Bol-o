const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  createPool,
  joinPool,
  getMyPools,
} = require("../controllers/poolController");
const isAdmin = require("../middlewares/isAdmin");

router.post("/", auth, isAdmin, createPool); // Criar bolão
router.post("/:poolId/join", auth, joinPool); // Entrar em bolão
router.get("/me", auth, getMyPools); // Ver bolões do usuário

module.exports = router;
