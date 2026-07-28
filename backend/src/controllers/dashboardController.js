const prisma = require('../config/db')

// GET /api/dashboard/summary
const getSummary = async (req, res) => {
  try {
    const userId = req.user.userId
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const [incomeResult, expenseResult] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: 'income', date: { gte: start, lte: end } },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'expense', date: { gte: start, lte: end } },
        _sum: { amount: true }
      })
    ])

    const income = Number(incomeResult._sum.amount || 0)
    const expenses = Number(expenseResult._sum.amount || 0)
    const balance = income - expenses

    res.json({ income, expenses, balance })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// GET /api/dashboard/by-category
const getByCategory = async (req, res) => {
  try {
    const userId = req.user.userId
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const transactions = await prisma.transaction.findMany({
      where: { userId, type: 'expense', date: { gte: start, lte: end } },
      include: { category: true }
    })

    // Group by category
    const grouped = {}
    for (const t of transactions) {
      const name = t.category?.name || 'Other'
      const color = t.category?.color || '#94a3b8'
      const icon = t.category?.icon || '📦'
      if (!grouped[name]) grouped[name] = { name, color, icon, total: 0 }
      grouped[name].total += Number(t.amount)
    }

    const data = Object.values(grouped).sort((a, b) => b.total - a.total)
    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// GET /api/dashboard/by-month
const getByMonth = async (req, res) => {
  try {
    const userId = req.user.userId
    const months = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const start = new Date(date.getFullYear(), date.getMonth(), 1)
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

      const [income, expense] = await Promise.all([
        prisma.transaction.aggregate({
          where: { userId, type: 'income', date: { gte: start, lte: end } },
          _sum: { amount: true }
        }),
        prisma.transaction.aggregate({
          where: { userId, type: 'expense', date: { gte: start, lte: end } },
          _sum: { amount: true }
        })
      ])

      months.push({
        month: start.toLocaleString('default', { month: 'short' }),
        income: Number(income._sum.amount || 0),
        expenses: Number(expense._sum.amount || 0)
      })
    }

    res.json({ data: months })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// GET /api/dashboard/prediction
const getPrediction = async (req, res) => {
  try {
    const userId = req.user.userId
    const monthlyTotals = []

    for (let i = 5; i >= 1; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const start = new Date(date.getFullYear(), date.getMonth(), 1)
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

      const result = await prisma.transaction.aggregate({
        where: { userId, type: 'expense', date: { gte: start, lte: end } },
        _sum: { amount: true }
      })

      monthlyTotals.push(Number(result._sum.amount || 0))
    }

    // Moving average of last 3 months
    const last3 = monthlyTotals.slice(-3)
    const prediction = last3.reduce((sum, val) => sum + val, 0) / last3.length

    res.json({ prediction: Math.round(prediction * 100) / 100 })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { getSummary, getByCategory, getByMonth, getPrediction }