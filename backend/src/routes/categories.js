const express = require('express')
const router = express.Router()
const { getCategories, createCategory } = require('../controllers/categoryController')
const authGuard = require('../middleware/auth')
const { validate, categorySchema } = require('../middleware/validate')

router.get('/', authGuard, getCategories)
router.post('/', authGuard, validate(categorySchema), createCategory)

module.exports = router