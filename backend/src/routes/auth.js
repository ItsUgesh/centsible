const express = require('express')
const router = express.Router()
const { register, login, logout } = require('../controllers/authController')
const authGuard = require('../middleware/auth')
const prisma = require('../config/db')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

// GET /api/auth/me — returns current logged in user
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

module.exports = router