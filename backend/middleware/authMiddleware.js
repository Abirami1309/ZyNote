const jwt = require("jsonwebtoken");

/*const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "No token"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      "zynote_secret_key"
    );

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};*/



const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  console.log("Authorization Header:", token);

  if (!token) {
    return res.status(401).json({
      message: "No token"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      "zynote_secret_key"
    );

    console.log("Decoded User:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);

    return res.status(401).json({
      message: "Invalid token"
    });
  }
};
module.exports = authMiddleware;