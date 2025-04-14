const mongoose = require('mongoose')

const matchSchema = new mongoose.Schema({
  pool: { type: mongoose.Schema.Types.ObjectId, ref: 'Pool' },
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  date: { type: Date, required: true },
  scoreA: Number,
  scoreB: Number,
  scorers: [String], // jogadores que marcaram gols
  ended: { type: Boolean, default: false }
})

module.exports = mongoose.model('Match', matchSchema)
