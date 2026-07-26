const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/db')

// Helper — creates JWT and sets it as a cookie
const sendToken = (res, user) => {
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })
}

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    // Hash password — never store plain text
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: { name, email, passwordHash, provider: 'email' }
    })

    sendToken(res, user)
    res.status(201).json({ message: 'Account created', user: { id: user.id, name: user.name, email: user.email } })

  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    sendToken(res, user)
    res.json({ message: 'Logged in', user: { id: user.id, name: user.name, email: user.email } })

  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
}

module.exports = { register, login, logout }