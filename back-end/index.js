require("dotenv").config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const connectToDB = require("./config/mongodbConn");
const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
const { ensureAuth, ensureGuest, onAuthorizeSuccess, onAuthorizeFail } = require('./middleware/auth');
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const https = require('https');
const socketio = require('socket.io');
const cors = require('cors');
const path = require('path');
//const corsOptions = require('./config/corsOptions')

const PORT = process.env.PORT || 5000

// Connect to database
connectToDB()

// require("./config/googlePassport")(passport);
require("./config/localPassport")(passport);

const app = express();
app.use(logger)
const server = https.createServer(app);
const io = socketio(server);

// Custom CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://web-chat-cliento.onrender.com',
    'http://web-chat-cliento.onrender.com',
    'https://localhost:3000',
    'http://localhost:3000'
  ];
  const origin = req.headers.origin;

  // if (allowedOrigins.includes(origin)) {
  //   res.setHeader('Access-Control-Allow-Origin', origin);
  // }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Preflight request
  }

  next();
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use cookie-parser
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: process.env.PASSPORT_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // Equals 1 day
    httpOnly: true,
    sameSite: 'none',
    secure: true
  }
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/images/', express.static(path.join(__dirname, 'images')));
app.use('/uploads/images/', express.static(path.join(__dirname, '/uploads/images')));
app.use('/uploads/videos/', express.static(path.join(__dirname, '/uploads/videos')));
app.use('/uploads/others/', express.static(path.join(__dirname, '/uploads/others')));

app.use('/', require('./routes/index'));
app.use('/auth', ensureGuest, require('./routes/auth'));
app.use('/home', ensureAuth, require('./routes/home'));

app.all('*', (req, res) => {
  res.status(404).json({ message: '404 Not Found' })
})
app.use(errorHandler)

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: 'connect.sid',
  secret: process.env.PASSPORT_SECRET_KEY,
  store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail
}));

io.on('connection', socket => {
  socket.join(socket.request.user.id)
  console.log(`User ${socket.request.user.id} connected with socket ${socket.id}`);

  socket.on('sendMessage', (msg, userDetails, otherUserDetails) => {
    console.log(msg, userDetails, otherUserDetails);
    io.to(msg.sender).emit('receiveMessage', msg, otherUserDetails);
    if (io.sockets.adapter.rooms.get(msg.receiver)) {
      try {
        socket.to(msg.receiver).emit('receiveMessage', msg, userDetails);
        console.log("sending...",msg)
      } catch (error) {
        console.error("unable to send message " + error)
      }
    }else{
      console.log("User is offline")
    }
  })

  socket.on("deleteMessage", (messageId, userId, otherUserId) => {
    io.to(userId).emit("deleteMessage", messageId, otherUserId);
  });

});

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to mongodbConn')
  server.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {

  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})

module.exports = server; 
