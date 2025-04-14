const mongoose = require('mongoose')

const guessSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  guessA: { type: Number, required: true },
  guessB: { type: Number, required: true },
  scorers: [String], // jogadores que o usuário acha que vão marcar gols
  points: { type: Number, default: 0 }
})

module.exports = mongoose.model('Guess', guessSchema)
