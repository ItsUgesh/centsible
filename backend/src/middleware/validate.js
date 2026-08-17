const { z } = require('zod')

// Middleware factory — validates req.body against a Zod schema
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    const message = result.error.errors[0]?.message || 'Invalid input'
    return res.status(400).json({ error: message })
  }
  req.body = result.data
  next()
}

// ── Schemas ──────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], { error: 'Type must be income or expense' }),
  amount: z.coerce.number().positive('Amount must be greater than 0').max(1000000, 'Amount too large'),
  description: z.string().max(255).optional(),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
  date: z.string().min(1, 'Date is required')
})

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100)
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
})

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  icon: z.string().optional()
})

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  transactionSchema,
  profileSchema,
  passwordSchema,
  categorySchema
}
