// Test data seed — adds 3 months of transactions for a specific user
// Usage: node prisma/seed-test.js your@email.com

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('❌  Please provide an email: node prisma/seed-test.js your@email.com')
    process.exit(1)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error(`❌  No user found with email: ${email}`)
    process.exit(1)
  }

  const categories = await prisma.category.findMany({ take: 6 })
  if (categories.length === 0) {
    console.error('❌  No categories found. Run npm run seed first.')
    process.exit(1)
  }

  const now = new Date()

  // Helper — date in a specific past month
  const dateIn = (monthsAgo, day) => {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day)
    return d
  }

  const transactions = [
    // ── 3 months ago ──
    { type: 'income',  amount: 1800, description: 'Salary',        categoryId: categories[0].id, date: dateIn(3, 1) },
    { type: 'expense', amount: 450,  description: 'Rent',          categoryId: categories[1].id, date: dateIn(3, 3) },
    { type: 'expense', amount: 80,   description: 'Groceries',     categoryId: categories[2].id, date: dateIn(3, 7) },
    { type: 'expense', amount: 35,   description: 'Netflix & gym', categoryId: categories[3].id, date: dateIn(3, 10) },
    { type: 'expense', amount: 120,  description: 'Clothes',       categoryId: categories[4].id, date: dateIn(3, 15) },
    { type: 'expense', amount: 60,   description: 'Dinner out',    categoryId: categories[2].id, date: dateIn(3, 20) },

    // ── 2 months ago ──
    { type: 'income',  amount: 1800, description: 'Salary',        categoryId: categories[0].id, date: dateIn(2, 1) },
    { type: 'expense', amount: 450,  description: 'Rent',          categoryId: categories[1].id, date: dateIn(2, 3) },
    { type: 'expense', amount: 95,   description: 'Groceries',     categoryId: categories[2].id, date: dateIn(2, 8) },
    { type: 'expense', amount: 200,  description: 'Flights',       categoryId: categories[5].id, date: dateIn(2, 12) },
    { type: 'expense', amount: 45,   description: 'Pharmacy',      categoryId: categories[3].id, date: dateIn(2, 18) },
    { type: 'expense', amount: 30,   description: 'Coffee & cafe', categoryId: categories[2].id, date: dateIn(2, 25) },

    // ── 1 month ago ──
    { type: 'income',  amount: 2100, description: 'Salary + bonus', categoryId: categories[0].id, date: dateIn(1, 1) },
    { type: 'expense', amount: 450,  description: 'Rent',           categoryId: categories[1].id, date: dateIn(1, 3) },
    { type: 'expense', amount: 110,  description: 'Groceries',      categoryId: categories[2].id, date: dateIn(1, 6) },
    { type: 'expense', amount: 75,   description: 'New shoes',      categoryId: categories[4].id, date: dateIn(1, 14) },
    { type: 'expense', amount: 55,   description: 'Spotify + gym',  categoryId: categories[3].id, date: dateIn(1, 20) },
    { type: 'expense', amount: 90,   description: 'Restaurant',     categoryId: categories[2].id, date: dateIn(1, 27) },
  ]

  await prisma.transaction.createMany({
    data: transactions.map(t => ({ ...t, userId: user.id }))
  })

  // Summary for each month
  const months = [3, 2, 1]
  console.log(`\n✅  Seeded ${transactions.length} transactions for ${user.name} (${email})\n`)
  console.log('📊  Monthly expense totals:')
  for (const m of months) {
    const monthTxs = transactions.filter(t => t.type === 'expense' && t.date.getMonth() === dateIn(m, 1).getMonth())
    const total = monthTxs.reduce((s, t) => s + t.amount, 0)
    const label = dateIn(m, 1).toLocaleString('default', { month: 'long', year: 'numeric' })
    console.log(`   ${label}: €${total}`)
  }

  const last3expenses = [3, 2, 1].map(m =>
    transactions.filter(t => t.type === 'expense' && t.date.getMonth() === dateIn(m, 1).getMonth())
      .reduce((s, t) => s + t.amount, 0)
  )
  const prediction = last3expenses.reduce((s, v) => s + v, 0) / 3
  console.log(`\n🔮  Predicted next month: €${prediction.toFixed(2)}`)
  console.log('\n   Refresh the dashboard to see the prediction card!\n')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
