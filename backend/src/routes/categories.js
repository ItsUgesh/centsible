const express = require('express')
const router = express.Router()
const { getCategories } = require('../controllers/categoryController')
const authGuard = require('../middleware/auth')

router.get('/', authGuard, getCategories)

module.exports = router