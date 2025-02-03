// const { User } = require("../models/databaseSchema");

const addToContacts = async (userId, contactId) => {
    return await User.updateOne(
        { _id: userId },
        { $addToSet: { contacts: contactId } }
    );
};

module.exports = addToContacts;