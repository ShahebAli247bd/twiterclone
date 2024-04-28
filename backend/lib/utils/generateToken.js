import jwt from "jsonwebtoken";
/**
 * Rendom String Generator
 * node
 * >require('node:crypto').randomBytes(64).toString('hex')
 */
console.log(process.env.JWT_SECRET);
export const generateTokenAndSetCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //ms of 15days,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development", //if node env is not development then it is true, it means production true
  });
};
