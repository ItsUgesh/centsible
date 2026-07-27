const express = require('express')
const router = express.Router()
const { register, login, logout } = require('../controllers/authController')
const authGuard = require('../middleware/auth')
const prisma = require('../config/db')
const passport = require('passport')
require('../config/passport')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

// GET /api/auth/me
router.get('/me', authGuard, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, avatarUrl: true, provider: true }
    })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/auth/google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

// GET /api/auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    const jwt = require('jsonwebtoken')
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.redirect('http://localhost:5173/dashboard')
  }
)

module.exports = router