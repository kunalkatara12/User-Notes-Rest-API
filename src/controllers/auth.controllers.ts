import { hash ,compare} from "bcrypt";
import {Request,Response, NextFunction } from "express";
import { COOKIE_NAME } from "../utils/constant.utils";
import { createToken } from "../utils/token_manager.utils";
import User from "../models/User.models";
export const authSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    //existing user
    const exUser = await User.findOne({ email });
    if (exUser)
      return res.status(401).json({
        message: "User is already registered",
      });
    // password and confirm password should match
    if (password !== confirmPassword) {
      return res.status(400).json({
        message:
          "Password and confirm password do not match in auth.controllers.ts",
      });
    }
    if (password === "" || password === null || password === undefined)
      return res.status(404).json({
        message: "password is empty",
      });

    //hashing password
    const hashedPassword = await hash(password, 10);
    //saving user
    const user = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();

    // clear previous cookies
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      // domain: "",
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
    });
    // expire date
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    //create token
    const token = createToken(user._id.toString(), user.email, "7d");
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      // domain: "",
      expires,
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({
      message: "Ok",
      token,
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error in auth.controllers.ts",
      cause: error.message,
    });
  }
};


export const authLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(401).json({
        message: "User is not registered",
      });
    }
    //compare Password
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({
        message: "Incorrect Password",
      });
    }

    // clear previous cookies
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      // domain: "",
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
    });
    // expire date
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    //create token
    const token = createToken(user._id.toString(), user.email, "7d");
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      // domain: "",
      expires,
      httpOnly: true,
      signed: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({
      message: "Ok",
      token,
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error in auth.controllers.ts",
      cause: error.message,
    });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json({
      message: "These are the users",
      allUsers,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error in auth.controllers.ts",
      cause: error.message,
    });
  }
}