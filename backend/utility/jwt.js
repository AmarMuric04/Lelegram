import jwt from "jsonwebtoken";

export const createJWT = (user, time) => {
  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
    },
    process.env.JWT_TOKEN,
    {
      expiresIn: time,
    }
  );

  return token;
};
