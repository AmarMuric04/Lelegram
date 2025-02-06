import jwt from "jsonwebtoken";

export const createJWT = (user) => {
  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
    },
    process.env.JWT_TOKEN,
    {
      expiresIn: "7d",
    }
  );

  return token;
};
