const removeFromContacts = async (userId, contactId) => {
    return await User.updateOne(
        { _id: userId },
        { $pull: { contacts: contactId } }
    );
};

module.exports = removeFromContacts;