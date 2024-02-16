const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: false
  },
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: false
  },
    salt: {
    type: String,
    required: false
  },
  image: {
    type: String,
    default:"https://cdn5.vectorstock.com/i/1000x1000/43/94/default-avatar-photo-placeholder-icon-grey-vector-38594394.jpg"
  },
  createdAt: {
     type: Date,
     default: Date.now 
  },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

});
const User = mongoose.model('User', UserSchema);




const MessageSchema = new mongoose.Schema({
  _id: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  content: {
     type: String,
     required: true
  },
  readByReceiver: {
    type: Boolean,
    default: false
  },
  include: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'
 }] ,
  timestamp: {
     type: Date,
     default: Date.now 
  }
});
const Message = mongoose.model('Message', MessageSchema);


const ConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [MessageSchema],
  unreadMessages: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    count: { type: Number, default: 0 }
  }],
  lastUpdated: { 
    type: Date, default: Date.now 
  }
});
const Conversation = mongoose.model('Conversation', ConversationSchema);


const tokenSchema= new mongoose.Schema({
  userId:{
      type: mongoose.Schema.Types.ObjectId,
      require:true,
      ref:"Users"   
  },
  token:{
      type:String,
      require:true
  },
  createdAt:{
      type:Date,
      default:Date.now,
      expires:3600
  }
})
const Token = mongoose.model('Token',tokenSchema);

module.exports = {
  User,
  Message,
  Conversation,
  Token
};