//Function to logout
const logout = (req, res, next) => {
    req.logout((error) => {
      if (error) { return next(error); }
      req.session.destroy((err) => {
        if (err) { return next(err); }
        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).json({ message: 'Logged out successfully' }); // Send a response with 200 OK status
      });
    });
  }

module.exports = logout;