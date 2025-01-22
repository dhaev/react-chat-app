const express = require('express');
const { User } = require("../models/databaseSchema");
const { validationResult } = require('express-validator');
const genPassword = require('../config/passwordUtils').genPassword;

const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).json({ error: firstError });
    }

    try {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).json({ error: "User with this email already exists" });
        }
        const displayNameExists = await User.findOne({ displayName: req.body.uname });
        if (displayNameExists) {
            return res.status(400).json({ error: "User with this name already exists" });
        }

        const saltHash = genPassword(req.body.pw);
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        const newUser = new User({
            displayName: req.body.uname,
            email: req.body.email,
            hash: hash,
            salt: salt,
        });

        // Save the new user
        const savedUser = await newUser.save();

        // Respond with success message
        res.status(200).json({ message: "Sign up successful" });

    } catch (error) {
        res.status(500).json({ message: "internal server error" });
        // Handle error, maybe redirect to an error page
    }
}

module.exports = register;