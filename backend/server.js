require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const categoryRoutes = require('./src/routes/categories')
const transactionRoutes = require('./src/routes/transactions')
const dashboardRoutes = require('./src/routes/dashboard')

const authRoutes = require('./src/routes/auth')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(passport.initialize())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ Centsible API is running' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})