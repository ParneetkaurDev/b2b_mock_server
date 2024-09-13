import { Router } from "express";
import { bapRouter } from "./bap";
import { bppRouter } from "./bpp";
import { authValidatorMiddleware } from "../../middlewares";
import { rateLimiter } from "../../middlewares/rateLimiter";
import { initiateRouter } from "./initiate";

export const b2cRouter = Router();
b2cRouter.use(authValidatorMiddleware);
b2cRouter.use(rateLimiter);
b2cRouter.use("/bap", bapRouter);
b2cRouter.use("/bpp", bppRouter);
b2cRouter.use("/initiate", initiateRouter)