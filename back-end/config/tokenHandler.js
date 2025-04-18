const express = require('express');
const passport = require('passport');
const router = express.Router();
const { Token } = require("../models/databaseSchema");

const genPassword = require('../config/passwordUtils').genPassword;
const bcrypt = require("bcrypt");
const crypto = require("crypto");


const generateToken = async (id) => {
    let token = await Token.findOne({ userId: id });
    // delete existing token
    if (token) {
        await Token.deleteOne({ userId: id });
    }
    // generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    //hash reset token
    const hashedToken = await bcrypt.hash(resetToken, 10)
    // save token in database
    await new Token({
        userId: id,
        token: hashedToken,
        createdAt: Date.now()
    }).save()
    return resetToken;
}
const isValidToken = async ({ token, id }) => {
    try {
        const savedToken = await Token.findOne({ userId: id }).lean();
        //compare the token
        if (savedToken) {
            const isValidToken = await bcrypt.compare(token, savedToken.token);
            return isValidToken;
        } else return false
    } catch (er) {
        throw er
    }
}

module.exports = {
    generateToken,
    isValidToken
}