const express = require('express');
const { checkId, checkContent, checkUsername, checkEmail, checkPassword } = require('../middleware/validationcheck');
const upload = require('../middleware/multerStorage');
const router = express.Router();

const handleError = (err, req, res, next) => {

  res.status(500).send('Server error');
};

const getUserProfile = require('../api/getUserProfile');
const updateUserInfo = require('../api/updateUserInfo');
const updateUserImage = require('../api/updateUserImage');
const updateUserPassword = require('../api/updateUserPassword');
const logout = require('../api/logout');
const getConversations = require('../api/getConversations');
const getConversation = require('../api/getConversation');
const clearChatHistoryForUser = require('../api/clearChatHistoryForUser');
const sendMessage = require('../api/sendMessage');
const getChatMessages = require('../api/getChatMessages');
const deleteMessageForUser = require('../api/deleteMessageForUser');
const updateReadMessages = require('../api/updateReadMessages');
const searchUsers = require('../api/searchUsers');

// User Profile
router.get("/getUserProfile", getUserProfile);
router.put('/updateUserInfo', [checkUsername(), checkEmail()], updateUserInfo)
router.put('/updateUserImage', upload.single('image'), updateUserImage)
router.put('/updateUserPassword', [checkPassword('oldPassword'), checkPassword('newPassword')], updateUserPassword)
router.get('/logout', logout);

// Conversations
router.get('/getConversations', getConversations);
router.get('/getConversation', [checkId('otherUserId')], getConversation);
router.delete('/clearChatHistoryForUser', [checkId('otherUserId')], clearChatHistoryForUser)

// Messages
router.post('/sendMessage', [checkId('receiverId'), checkContent('content')], sendMessage);
router.get('/getChatMessages', [checkId('otherUserId')], getChatMessages);
router.delete('/deleteMessageForUser', [checkId('otherUserId'), checkId('messageId')], deleteMessageForUser);
router.put('/updateReadMessages', [checkId('otherUserId')], updateReadMessages);

// Search
router.get('/searchUsers', [checkContent('searchQuery')], searchUsers);

router.use(handleError);

module.exports = router;


