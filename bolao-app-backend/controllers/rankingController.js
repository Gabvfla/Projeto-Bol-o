const Match = require("../models/Match");
const Guess = require("../models/Guess");
const User = require("../models/User");

exports.getRankingByPool = async (req, res) => {
  try {
    const { poolId } = req.params;

    // 1. Buscar partidas finalizadas do bolão
    const matches = await Match.find({ pool: poolId, ended: true });
    const matchIds = matches.map((m) => m._id);

    if (matchIds.length === 0) {
      return res.json([]); // ainda sem partidas finalizadas
    }

    // 2. Buscar todos os palpites relacionados a essas partidas
    const guesses = await Guess.find({ match: { $in: matchIds } });

    // 3. Calcular pontuação por usuário
    const scores = {};

    guesses.forEach((guess) => {
      const match = matches.find(
        (m) => m._id.toString() === guess.match.toString()
      );
      if (!match) return;

      const userId = guess.user.toString();
      if (!scores[userId]) scores[userId] = { points: 0, goals: 0 };

      const realResultA = match.scoreA;
      const realResultB = match.scoreB;

      // Pontuação por placar
      if (guess.guessA === realResultA && guess.guessB === realResultB) {
        scores[userId].points += 3;
      } else {
        const winnerGuess =
          guess.guessA > guess.guessB
            ? "A"
            : guess.guessA < guess.guessB
            ? "B"
            : "D";
        const winnerReal =
          realResultA > realResultB
            ? "A"
            : realResultA < realResultB
            ? "B"
            : "D";
        if (winnerGuess === winnerReal) {
          scores[userId].points += 1;
        }
      }

      // Pontuação por artilheiros
      if (Array.isArray(guess.scorers) && Array.isArray(match.scorers)) {
        const correctScorers = guess.scorers.filter((name) =>
          match.scorers.includes(name)
        );
        scores[userId].points += correctScorers.length;
      }
    });

    // 4. Buscar nomes dos usuários e montar ranking
    const users = await User.find({ _id: { $in: Object.keys(scores) } });

    const ranking = users.map((user) => ({
      userId: user._id,
      name: user.name,
      points: scores[user._id.toString()].points,
    }));

    // 5. Ordenar por pontos (decrescente)
    ranking.sort((a, b) => b.points - a.points);

    res.json(ranking);
  } catch (err) {
    res.status(500).json({ message: "Erro ao calcular ranking." });
  }
};
