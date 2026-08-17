const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const prisma = require('../config/db')
const { sendVerificationEmail } = require('../services/emailService')

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
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })

  return token
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
      // If already verified — just say email in use
      if (existing.emailVerified) {
        return res.status(400).json({ error: 'Email already in use' })
      }
      // If unverified — resend a fresh verification link
      const verificationToken = crypto.randomBytes(32).toString('hex')
      const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
      await prisma.user.update({
        where: { email },
        data: { verificationToken, verificationTokenExpiry }
      })
      await sendVerificationEmail(email, existing.name, verificationToken)
      return res.status(200).json({ message: 'A new verification link has been sent to your email.' })
    }

    // Hash password — never store plain text
    const passwordHash = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: { name, email, passwordHash, provider: 'email', verificationToken, verificationTokenExpiry }
    })

    // Send verification email
    await sendVerificationEmail(email, name, verificationToken)

    res.status(201).json({ message: 'Account created. Please check your email to verify your account.' })

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

    // Block unverified email accounts
    if (!user.emailVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.', code: 'EMAIL_NOT_VERIFIED' })
    }

    const token = sendToken(res, user)
    res.json({ message: 'Logged in', token, user: { id: user.id, name: user.name, email: user.email, provider: user.provider } })

  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
}

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' })

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name: name.trim() }
    })
    res.json({ message: 'Profile updated', user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// PUT /api/auth/password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'All fields are required' })
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' })

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } })
    if (!user.passwordHash) return res.status(400).json({ error: 'Password change not available for Google accounts' })

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' })

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: req.user.userId }, data: { passwordHash } })
    res.json({ message: 'Password updated' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// POST /api/auth/verify-email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body
    if (!token) return res.status(400).json({ error: 'Token is required' })

    // Find user by token (ignore expiry first to detect already-verified case)
    const user = await prisma.user.findFirst({ where: { verificationToken: token } })

    if (!user) {
      // Token not found at all — could mean already verified (spam filter consumed it)
      return res.status(400).json({ error: 'Invalid or expired link', code: 'INVALID' })
    }

    // Already verified (spam filter pre-clicked the link)
    if (user.emailVerified) {
      return res.json({ message: 'Email already verified', alreadyVerified: true })
    }

    // Token exists but expired
    if (new Date() > user.verificationTokenExpiry) {
      return res.status(400).json({ error: 'Verification link has expired', code: 'EXPIRED' })
    }

    // All good — verify the user (keep token so clicking again still works)
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true }
    })
    res.json({ message: 'Email verified', alreadyVerified: false })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// POST /api/auth/resend-verification
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ error: 'No account found with this email' })
    if (user.emailVerified) return res.status(400).json({ error: 'Email is already verified. Please log in.' })

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await prisma.user.update({
      where: { email },
      data: { verificationToken, verificationTokenExpiry }
    })
    await sendVerificationEmail(email, user.name, verificationToken)
    res.json({ message: 'Verification email resent' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { register, login, logout, updateProfile, updatePassword, verifyEmail, resendVerification }