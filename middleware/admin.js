module.exports = function (req, res, next) {
  try {
    if (!req.user.isAdmin)
      return res.status(403).send("Access denied. User is not admin.");
    next();
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Invalid token.");
  }
};
