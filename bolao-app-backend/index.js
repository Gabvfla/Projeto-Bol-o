require('dotenv').config()
const express = require('express')
const mongoose = require('./config/db')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const poolRoutes = require('./routes/poolRoutes')
const matchRoutes = require('./routes/matchRoutes')
const guessRoutes = require('./routes/guessRoutes')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/pools', poolRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/guesses', guessRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
