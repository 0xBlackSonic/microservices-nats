import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const generateSession = (
  userId: string = "",
  jwtExpires: string = "0s",
  refreshExpires: string = "0s"
) => {
  const payload = {
    id: userId || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn: jwtExpires,
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY!, {
    expiresIn: refreshExpires,
  });

  return {
    jwt: jwtToken,
    refresh: refreshToken,
  };
};
