import express, { Request, Response } from "express";
const router = express.Router();
const asyncHandler = require("express-async-handler");
const userController = require("../controllers/users");
const { auth }  = require("../middleware");

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

router.post(
  "/logout",
  auth,
  asyncHandler((req: Request, res: Response) => {
    return userController.logoutUser (req, res);
  })
);

router.get(
  "/user",
    auth,
  asyncHandler((req: Request, res: Response) => {
    return userController.getUser (req, res);
  })
);

router.put(
    "/user/details",
      auth,
    asyncHandler((req: Request, res: Response) => {
      return userController.updateUser (req, res);
    })
  );

module.exports = router;
