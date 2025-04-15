module.exports = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Apenas administradores podem realizar esta ação." });
  }
  next();
};
