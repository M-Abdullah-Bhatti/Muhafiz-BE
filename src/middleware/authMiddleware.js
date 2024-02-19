const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const SECRET_KEY = "FITGURUAPI";

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null || authHeader == null || authHeader == "") {
      return res
        .status(403)
        .send({ message: "You're not logged in. Please login first" });
    }

    const verify = jwt.verify(token, SECRET_KEY);
    if (verify) {
      req.user = await UserModel.findById(verify.id);

      return next();
    } else {
      return res.status(403).send({ message: "Unauthorized Access" });
    }
  } catch (error) {
    // console.error("err", error);
    res.status(401).send({ message: "Unauthorized" });
  }
};
