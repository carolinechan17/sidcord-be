const admin = require("../admin");
async function IsSeller(req, res, next) {
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

  if (!decodedToken.seller) {
    return res.sendStatus(403);
  }
  req.body.uid = decodedToken.uid;
  next();
}

module.exports = IsSeller;
