const express = require('express');
const passport = require('passport');
const router = express.Router();
const register = require('../api/register');
const passwordResetLink = require('../api/passwordResetLink');
const createNewPassword = require('../api/createNewPassword');
const verifyPasswordResetLink = require('../api/verifyPasswordResetLink');
const { checkUsername, checkEmail, checkPassword } = require('../middleware/validationcheck')

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function (req, res) {
    res.status(200).json({ message: "login successful", user: req.user });
});

router.post('/login', [checkEmail(), checkPassword('pw')], passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
    res.status(200).json({ message: "login successful", user: req.user });
});

router.post('/register', [checkUsername(), checkEmail(), checkPassword('pw')], register);

router.post("/password-reset", passwordResetLink)

router.get("/verify-password-reset-link", verifyPasswordResetLink)

router.post("/newPassword", checkPassword('pw'), createNewPassword)

module.exports = router;
