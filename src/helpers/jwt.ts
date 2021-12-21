import jwt from "jsonwebtoken";

const secret = process.env.jwt_secret || "secret";
const refresh_secret = process.env.jwt_secret_refresh || "secret_refresh";

export const createToken = (payload: any, refresh: boolean) => {
  const tokenOpts = {
    expiresIn: refresh ? "7d" : "5m"
  }
  
  delete payload.exp;
  delete payload.iat;

  return jwt.sign(payload, refresh ? refresh_secret: secret, tokenOpts);
}

export const getDataFromToken = (token: string, refresh: boolean) => {
  try {
    return jwt.verify(token, refresh ? refresh_secret : secret);
  } catch {
    return false;
  }
}