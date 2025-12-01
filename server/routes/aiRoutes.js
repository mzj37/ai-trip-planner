const express = require('express');
const router = express.Router();
const { chat, form, surprise } = require('../controllers/aiController');

// AI routes - no auth required (anyone can plan)
router.post('/chat', chat);
router.post('/form', form);
router.post('/surprise', surprise);

module.exports = router;