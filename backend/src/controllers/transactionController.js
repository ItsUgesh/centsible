const prisma = require('../config/db')

// GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { type, categoryId, month, limit } = req.query
    const userId = req.user.userId

    const where = { userId }

    if (type) where.type = type
    if (categoryId) where.categoryId = parseInt(categoryId)

    // month arrives as "2026-08" from the frontend
    if (month) {
      const [yr, mo] = month.split('-')
      const start = new Date(parseInt(yr), parseInt(mo) - 1, 1)
      const end = new Date(parseInt(yr), parseInt(mo), 0, 23, 59, 59)
      where.date = { gte: start, lte: end }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
      ...(limit ? { take: parseInt(limit) } : {})
    })

    res.json({ transactions })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const { type, amount, categoryId, description, date } = req.body
    const userId = req.user.userId

    if (!type || !amount || !date) {
      return res.status(400).json({ error: 'Type, amount and date are required' })
    }
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type must be income or expense' })
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        amount: parseFloat(amount),
        categoryId: categoryId ? parseInt(categoryId) : null,
        description,
        date: new Date(date)
      },
      include: { category: true }
    })

    res.status(201).json({ transaction })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId
    const { type, amount, categoryId, description, date } = req.body

    // Check it belongs to this user
    const existing = await prisma.transaction.findFirst({
      where: { id, userId }
    })
    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        type,
        amount: parseFloat(amount),
        categoryId: categoryId ? parseInt(categoryId) : null,
        description,
        date: new Date(date)
      },
      include: { category: true }
    })

    res.json({ transaction })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    // Check it belongs to this user
    const existing = await prisma.transaction.findFirst({
      where: { id, userId }
    })
    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    await prisma.transaction.delete({ where: { id } })
    res.json({ message: 'Transaction deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction }