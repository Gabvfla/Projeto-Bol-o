const Guess = require("../models/Guess");
const Match = require("../models/Match");

// Criar um palpite
exports.createGuess = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { guessA, guessB, scorers } = req.body;

    const match = await Match.findById(matchId);
    if (!match)
      return res.status(404).json({ message: "Partida não encontrada." });
    if (match.ended)
      return res.status(400).json({ message: "Partida já foi finalizada." });

    // Impedir palpite duplicado do mesmo usuário
    const existingGuess = await Guess.findOne({
      match: matchId,
      user: req.user._id,
    });
    if (existingGuess) {
      return res
        .status(400)
        .json({ message: "Você já fez um palpite para essa partida." });
    }

    const guess = new Guess({
      match: matchId,
      user: req.user._id,
      guessA,
      guessB,
      scorers,
    });

    await guess.save();
    res.status(201).json(guess);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar palpite." });
  }
};

// Buscar palpites do usuário por bolão
exports.getUserGuessesByPool = async (req, res) => {
  try {
    const { poolId } = req.params;
    const guesses = await Guess.find({ user: req.user._id }).populate({
      path: "match",
      match: { pool: poolId },
    });

    const filtered = guesses.filter((g) => g.match !== null);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar palpites." });
  }
};
