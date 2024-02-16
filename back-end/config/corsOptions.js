const allowedOrigins = require('./allowedOrigins')


const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
       return callback(null, true);
      }else{
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions 