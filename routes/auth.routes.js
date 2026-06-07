// POST /api/auth/register
// POST /api/auth/login
import express from "express";
import { Login, UserRegister } from "../controllers/user.controller.js";
const authRouter = express.Router();

authRouter.post('/register', UserRegister)
authRouter.post('/login', Login)

export default authRouter;