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

module.exports = { getCategories }