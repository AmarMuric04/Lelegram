import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function isAuth(req, res, next) {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error = new Error("No token provided. Please log in.");
    error.statusCode = 403;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
  } catch (err) {
    const error = new Error("Please sign in and try again.");
    error.statusCode = 401;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated. Token is invalid.");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
}
