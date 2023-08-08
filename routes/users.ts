import express, { Request, Response } from "express";
const router = express.Router();
const asyncHandler = require("express-async-handler");
const userController = require("../controllers/users");

router.post(
  "/register",
  asyncHandler((req: Request, res: Response) => {
    return userController.registerUser(req, res);
  })
);

router.post(
    "/login",
    asyncHandler((req: Request, res: Response) => {
      return userController.loginUser(req, res);
    })
  );

module.exports = router;
