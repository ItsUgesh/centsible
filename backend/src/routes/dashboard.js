const express = require('express')
const router = express.Router()
const { getSummary, getByCategory, getByMonth, getPrediction } = require('../controllers/dashboardController')
const authGuard = require('../middleware/auth')

router.get('/summary',     authGuard, getSummary)
router.get('/by-category', authGuard, getByCategory)
router.get('/by-month',    authGuard, getByMonth)
router.get('/prediction',  authGuard, getPrediction)

module.exports = router