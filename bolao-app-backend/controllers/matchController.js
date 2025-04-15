const Match = require("../models/Match");
const Pool = require("../models/Pool");
const Guess = require("../models/Guess");

// Criar partida
exports.createMatch = async (req, res) => {
  try {
    const { poolId } = req.params;
    const { teamA, teamB, date } = req.body;

    const pool = await Pool.findById(poolId);
    if (!pool)
      return res.status(404).json({ message: "Bolão não encontrado." });

    if (!pool.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Apenas o dono do bolão pode criar partidas." });
    }

    const match = new Match({ pool: poolId, teamA, teamB, date });
    await match.save();

    res.status(201).json(match);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar partida." });
  }
};

// Finalizar partida e registrar placar + artilheiros
exports.finishMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { scoreA, scoreB, scorers } = req.body;

    const match = await Match.findById(matchId).populate("pool");
    if (!match)
      return res.status(404).json({ message: "Partida não encontrada." });

    if (!match.pool.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Apenas o dono do bolão pode finalizar a partida." });
    }

    match.scoreA = scoreA;
    match.scoreB = scoreB;
    match.scorers = scorers;
    match.ended = true;
    await match.save();

    // Calcular pontuação dos palpites
    const guesses = await Guess.find({ match: match._id });

    for (const guess of guesses) {
      let points = 0;

      if (guess.guessA === scoreA && guess.guessB === scoreB) {
        points += 5; // placar exato
      } else if (
        (guess.guessA > guess.guessB && scoreA > scoreB) ||
        (guess.guessA < guess.guessB && scoreA < scoreB) ||
        (guess.guessA === guess.guessB && scoreA === scoreB)
      ) {
        points += 2; // acertou vencedor/empate
      }

      const scorersAcertados = guess.scorers.filter((jogador) =>
        match.scorers.includes(jogador)
      );
      points += scorersAcertados.length; // 1 ponto por artilheiro certo

      guess.points = points;
      await guess.save();
    }

    res.json({ message: "Partida finalizada e palpites avaliados.", match });
  } catch (err) {
    res.status(500).json({ message: "Erro ao finalizar partida." });
  }
};

// Listar partidas de um bolão
exports.getMatchesByPool = async (req, res) => {
  try {
    const { poolId } = req.params;
    const matches = await Match.find({ pool: poolId }).sort({ date: 1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar partidas." });
  }
};
