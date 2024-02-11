const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const connectToDB = require("./config/mongodb");
const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
const { ensureAuth, ensureGuest } = require('./middleware/auth');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const path = require('path');
// const dotenv = require("dotenv");
// dotenv.config();

require("./config/googlePassport")(passport);
require("./config/localPassport")(passport);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Connect to database
connectToDB()

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'hbs');

// Enable CORS
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000', 'http://google.com',
 'http://192.168.2.19:3000', 'http://192.168.2.19:3000/', 'http://192.168.2.19:5000',
  'http://192.168.2.19:5000/','http://192.168.1.14/'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

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
    sameSite: 'lax',
    secure: false
  }
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/index'));
app.use('/auth',ensureGuest,  require('./routes/auth'));
app.use('/home',ensureAuth,  require('./routes/home'));

function onAuthorizeSuccess(data, accept) {
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  if (error)
    console.log('failed connection to socket.io:', message);
  accept(null, false);
}

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

  socket.on('sendMessage', (msg) => {
    console.log(`User ${msg.sender} is sending message to ${msg.receiver}`);
    io.to(msg.sender).emit('receiveMessage', msg);
    if (io.sockets.adapter.rooms.get(msg.receiver)) {
      try {
        socket.to(msg.receiver).emit('receiveMessage', msg);
        console.log(`User ${msg.sender} sent ${msg.content} to ${msg.receiver}`);
      } catch (error) {
        console.error("unable to send message " + error)
      }
    }
  })

  socket.on("deleteMessage", (messageId, userId, otherUserId) => {
    io.to(userId).emit("deleteMessage", messageId, otherUserId);
  });

});


const PORT = 5000 || process.env.PORT;

server.listen(PORT, "192.168.2.19", () => console.log(`server running on port ${PORT}`));
