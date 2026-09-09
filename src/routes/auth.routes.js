import { Router } from "express";
const authRouter = Router();
import * as AuthController from "../../controller/auth.controller.js";

authRouter.post("/user/register", AuthController.register);
authRouter.post("/user/login", AuthController.login);
export default authRouter;
