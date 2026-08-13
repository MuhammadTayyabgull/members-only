export const isAuthenticated = (req, res, next) => {
  if (
    typeof req.isAuthenticated === "function"
      ? !req.isAuthenticated()
      : !req.user
  ) {
    return res.redirect("/auth/login");
  }
  next();
};

export const isMember = (req, res, next) => {
  const authed =
    typeof req.isAuthenticated === "function"
      ? req.isAuthenticated()
      : !!req.user;
  if (authed && req.user.is_member) {
    return next();
  }
  return res.status(403).send("Members Only");
};

export const isAdmin = (req, res, next) => {
  const authed =
    typeof req.isAuthenticated === "function"
      ? req.isAuthenticated()
      : !!req.user;
  if (authed && req.user.is_admin) {
    return next();
  }
  return res.status(403).send("Admins Only");
};

export const redirectIfLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};
