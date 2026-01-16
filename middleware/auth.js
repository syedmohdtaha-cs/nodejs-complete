// Authentication middleware
const requireAuth = (req, res, next) => {
  console.log(req.session.isLoggedInSession, "req.session.isLoggedInSession");

  if (!req.session.isLoggedInSession) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // User is authenticated, proceed to the next middleware/controller
  next();
};

module.exports = {
  requireAuth,
};
