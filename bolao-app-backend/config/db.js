const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Erro ao conectar MongoDB:', err))

module.exports = mongoose
 