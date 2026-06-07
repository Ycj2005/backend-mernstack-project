import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";
export async function UserRegister(req, res) {
  try {
    const { username, email, password } = req.body;

    const emailexist = await User.findOne({ email: email });
    if (emailexist) {
      res.json({
        status: 429,
        msg: "email is already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const registered_user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.json({
      status: 200,
      msg: "registered succesfully ",
      username,
    });
  } catch (error) {
    console.log("register error : ", error);
    res.json({
      status: 500,
      msg: "Internal server error",
    });
  }
}

export async function Login(req, res) {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email: email });

    if (!userExist) {
      res.json({
        status: 429,
        msg: "Invalid email",
      });
    }
    const compare_password = await bcrypt.compare(password, userExist.password);
    if (!compare_password) {
      res.json({
        status: 429,
        msg: "Invalid password",
      });
    }

    let token = jwt.sign(
      {
        id: userExist._id,
        username: userExist.username,
        email: userExist.email,
      },
      JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "7d",
      },
    );

    res.json({
      status: 200,
      msg: "user login succesfully",
      token,
    });
  } catch (error) {
    console.log("error : ", error);
    res.json({
      status: 500,
      msg: "Internal server error",
    });
  }
}
