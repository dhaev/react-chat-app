module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).json({ message: 'Unauthorized' }); // Send a response
    }
  },
    ensureGuest: function (req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      } else {
        res.status(400).json({ message: 'Already signed in' });;
      }
    },

     onAuthorizeSuccess: function(data, accept) {
      accept(null, true);
    },
    
     onAuthorizeFail: function(data, message, error, accept) {
      if (error)
      accept(null, false);
    }
  }