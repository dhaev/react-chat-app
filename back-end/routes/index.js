const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', (req, res) => {
  res.send('Hello World!, ..., Nothing to see here :)=');
});

module.exports = router;