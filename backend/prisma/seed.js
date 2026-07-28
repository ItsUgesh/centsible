const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'Food & Dining',   icon: '🍔', color: '#f59e0b' },
    { name: 'Transport',       icon: '🚗', color: '#3b82f6' },
    { name: 'Entertainment',   icon: '🎬', color: '#8b5cf6' },
    { name: 'Rent & Bills',    icon: '🏠', color: '#ef4444' },
    { name: 'Shopping',        icon: '🛍️', color: '#ec4899' },
    { name: 'Health',          icon: '💊', color: '#10b981' },
    { name: 'Education',       icon: '📚', color: '#06b6d4' },
    { name: 'Other',           icon: '📦', color: '#94a3b8' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: categories.indexOf(category) + 1 },
      update: {},
      create: category
    })
  }

  console.log('✅ Categories seeded successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())