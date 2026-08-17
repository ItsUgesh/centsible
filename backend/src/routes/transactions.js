const express = require('express')
const router = express.Router()
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController')
const authGuard = require('../middleware/auth')
const { validate, transactionSchema } = require('../middleware/validate')

router.get('/',       authGuard, getTransactions)
router.post('/',      authGuard, validate(transactionSchema), createTransaction)
router.put('/:id',   authGuard, validate(transactionSchema), updateTransaction)
router.delete('/:id', authGuard, deleteTransaction)

module.exports = router