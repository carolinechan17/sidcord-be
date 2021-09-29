const admin = require("../admin");

async function IsAuth(req, res, next) {
  const token = req.header("authentication");

  const decodedToken = await admin
    .auth()
    .verifyIdToken(token)
    .catch((error) => {
      console.log(error);
      return error;
    });

  if (decodedToken.message) {
    return res.status(403).json(decodedToken);
  }
  req.body.uid = decodedToken.uid;
  next();
}

module.exports = IsAuth;
