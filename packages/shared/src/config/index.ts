export const config = {
  sessions: {
    jwtKey: process.env.JWT_SECRET_KEY,
    jwtExpire: process.env.JWT_EXPIRATION,
    refreshKey: process.env.REFRESH_SECRET_KEY,
    refreshExpire: process.env.REFRESH_EXPIRATION,
  },
};
