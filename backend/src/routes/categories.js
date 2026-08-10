const express = require('express')
const router = express.Router()
const { getCategories, createCategory } = require('../controllers/categoryController')
const authGuard = require('../middleware/auth')

router.get('/', authGuard, getCategories)
router.post('/', authGuard, createCategory)

module.exports = router