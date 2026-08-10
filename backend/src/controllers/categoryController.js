const prisma = require('../config/db')

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    res.json({ categories })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

const createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body
    if (!name) return res.status(400).json({ error: 'Name is required' })
    const category = await prisma.category.create({
      data: { name, icon: icon || '📦', isDefault: false }
    })
    res.status(201).json(category)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { getCategories, createCategory }