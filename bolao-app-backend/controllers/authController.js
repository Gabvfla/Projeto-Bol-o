const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email já cadastrado.' })

    const user = new User({ name, email, password })
    await user.save()

    const token = generateToken(user._id)
    res.status(201).json({ user, token })
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar usuário.' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciais inválidas.' })
    }

    const token = generateToken(user._id)
    res.json({ user, token })
  } catch (err) {
    res.status(500).json({ message: 'Erro ao logar.' })
  }
}
