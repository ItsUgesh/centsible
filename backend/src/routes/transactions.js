const express = require('express')
const router = express.Router()
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController')
const authGuard = require('../middleware/auth')

router.get('/',      authGuard, getTransactions)
router.post('/',     authGuard, createTransaction)
router.put('/:id',  authGuard, updateTransaction)
router.delete('/:id', authGuard, deleteTransaction)

module.exports = router