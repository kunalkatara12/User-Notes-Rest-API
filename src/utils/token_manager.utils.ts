import { NextFunction, Request, Response } from "express";
import jwt, { sign } from "jsonwebtoken";
import { COOKIE_NAME } from "./constant.utils";

export const createToken = (
  id: string,
  email: string,
  expiresIn: string | number
) => {
  const payload = {
    id,
    email,
  };
  const token = sign(payload, process.env.JWT_SECRET as string, { expiresIn });
  // console.log(token)
  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[`${COOKIE_NAME}`];
  // console.log(token)
  if (!token || token.trim() === "") {
    return res.status(401).json({
      message: "Token not recieved in token-manager.utils.ts",
    });
  }

  return new Promise<void>((resolve, reject) => {
    return jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err:any, success:any) => {
        if (err) {
          reject(err);
          return res.status(401).json({
            message: "Token expired in token-manager.utils.ts",
          });
        } else {
          console.log("Token verified in token-manager.utils.ts");
          resolve();
          res.locals.jwtData = success;
          return next();
        }
      }
    );
  });
};
